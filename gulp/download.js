var AdmZip = require('adm-zip'),
    fs = require('fs'),
    request = require('request'),
    async = require('async'),
    sqlite3 = require('sqlite3').verbose();

var download = function(locale) {
    locale = locale ? locale : 'en';

    var log = function(msg) {
        console.log('[' + locale + '] ' + msg);
    };

    var buildDir = function(path) {
        return 'build/data/' + locale + '/' + path;
    };

    if (!fs.existsSync('tmp')) {
        fs.mkdirSync('tmp');
    }
    if (!fs.existsSync('build/data')) {
        fs.mkdirSync('build/data');
    }
    if (!fs.existsSync(buildDir(''))) {
        fs.mkdirSync(buildDir(''));
    }

    async.waterfall(
        [
            function (next) {
                request.get({
                    url: 'http://proxy.guardian.gg/platform/Destiny/Manifest/',
                    json: true
                }, function (e, r, body) {
                    var path = body.Response.mobileWorldContentPaths[locale];

                    if (!path) {
                        log(path);
                        throw "failed to download locale: " + locale;
                    }

                    var dbname = path.split('/');
                    dbname = dbname[dbname.length - 1];

                    var dbpath = 'tmp/' + dbname,
                        pathParts = path.replace('.content', '').split('_'),
                        hash = pathParts[pathParts.length - 1].substring(0, 8),
                        zipname = 'tmp/' + hash + '.zip';

                    fs.exists(dbpath, function (exists) {
                        if (exists) {
                            log('File already exists, skipping...');
                            next(null, dbpath);
                        } else {
                            log('Downloading game manifest data...');
                            var writeStream = fs.createWriteStream(zipname);

                            request
                                .get('http://www.bungie.net' + path)
                                .on('response', function (res) {
                                    res.pipe(writeStream);
                                })
                                .on('end', function () {
                                    log('Download complete, unzipping...');

                                    var zip = new AdmZip(zipname);
                                    zip.extractAllToAsync('tmp/', true, function () {
                                        fs.unlink(zipname);
                                        next(null, dbpath);
                                    });
                                });
                        }
                    });
                });
            },

            function (dbpath, next) {
                log('Opening database ' + dbpath);
                next(null, new sqlite3.Database(dbpath));
            },

            // save activity json
            function (db, next) {
                var data = {};

                db.each('SELECT * FROM DestinyActivityDefinition', function (err, row) {
                    if (err) return next(err);

                    row = JSON.parse(row.json);

                    data[row.activityHash] = {
                        name: row.activityName,
                        description: row.activityDescription,
                        icon: row.icon,
                        level: row.activityLevel,
                        skulls: row.skulls,
                        typeHash: row.activityTypeHash
                    };
                }, function () {
                    log('Writing ' + Object.keys(data).length + ' activities...');
                    fs.writeFile(buildDir('activities.json'), JSON.stringify(data), function(err) {
                        if (err) return next(err);

                        next(null, db);
                    });
                });
            },

            // save item json
            function (db, next) {
                var data = {};

                db.each('SELECT * FROM DestinyInventoryItemDefinition', function (err, row) {
                    if (err) return next(err);

                    row = JSON.parse(row.json);

                    // exotics only
                    if (row.tierType !== 6) {
                        return;
                    }

                    data[row.itemHash] = {
                        name: row.itemName,
                        description: row.itemDescription,
                        icon: row.icon,
                        typeName: row.itemTypeName,
                        bucket: row.bucketTypeHash
                    };
                }, function () {
                    log('Writing ' + Object.keys(data).length + ' items...');
                    fs.writeFile(buildDir('items.json'), JSON.stringify(data), function(err) {
                        if (err) return next(err);

                        next(null, db);
                    });
                });
            },

            // save subclass perk json
            function (db, next) {
                var talentGridToSubclass = {};
                var subclasses = [
                    21395672,
                    1256644900,
                    1716862031,
                    2007186000,
                    2455559914,
                    2962927168,
                    3658182170,
                    3828867689,
                    4143670657
                ];

                db.each('SELECT * FROM DestinyInventoryItemDefinition', function (err, row) {
                    if (err) return next(err);

                    row = JSON.parse(row.json);

                    // find subclass talent grids
                    if (subclasses.indexOf(row.itemHash) != -1) {
                        talentGridToSubclass[row.talentGridHash] = row.itemHash;
                    }
                }, function () {
                    next(null, db, talentGridToSubclass);
                });
            },
            function (db, talentGridToSubclass, next) {
                var data = {};

                db.each('SELECT * FROM DestinyTalentGridDefinition', function (err, row) {
                    if (err) return next(err);

                    row = JSON.parse(row.json);

                    var subclass = talentGridToSubclass[row.gridHash];

                    if (!subclass) {
                        return;
                    }

                    for (var i = 0; i < row.nodes.length; i++) {
                        var node = row.nodes[i];

                        if (!data[subclass]) {
                            data[subclass] = {};
                        }

                        var step = node.steps[0];
                        var name = step.nodeStepName;

                        if (!name || name.length == 0) {
                            continue;
                        }

                        data[subclass][node.nodeHash] = {
                            name: step.nodeStepName,
                            description: step.nodeStepDescription,
                            icon: step.icon,
                            row: node.row,
                            col: node.column
                        }
                    }
                }, function () {
                    log('Writing ' + Object.keys(data).length + ' subclass-nodes...');
                    fs.writeFile(buildDir('subclass-nodes.json'), JSON.stringify(data), function(err) {
                        if (err) return next(err);

                        next(null, db);
                    });
                });
            }
        ],
        function (err, db) {
            if (err) {
                log('Failed with err: ' + err);
            } else {
                db.close();
                log('Finished!');
            }
        }
    );
};

module.exports = download;