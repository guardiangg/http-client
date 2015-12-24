var app = angular.module('app');

app.factory('itemListFactory', [
    '$state',
    '$location',
    'gamedata',
    'util',
    'consts',
    'gettextCatalog',

    function ($state, $location, gamedata, util, consts, gettextCatalog) {
        return function () {
            var self = this,
                observerCallbacks = [],
                types = {
                    primary: null,
                    secondary: null,
                    tertiary: null
                };

            this.seoTitle = 'Items - Guardian.gg';
            this.errors = [];
            this.page = 0;
            this.perPage = 25;
            this.rawData = [];
            this.filteredData = [];
            this.filteredDataTotal = 0;
            this.statColumns = [];
            this.categories = [];
            this.sortColumn = 'name';
            this.sortDirection = 'asc';
            this.listType = 'standard';
            this.typeLists = {
                primary: consts.item_category_list,
                secondary: false,
                tertiary: false
            };
            this.filters = {
                type: {
                    primary: null,
                    secondary: null,
                    tertiary: null
                },
                name: null,
                class: null,
                source: null,
                tiers: [],
                stats: {}
            };

            /**
             * Registers a callback that is fired each time the list is updated (all data updates, filters, sorting)
             * @param {func} callback
             */
            this.registerObserverCallback = function(callback) {
                observerCallbacks.push(callback);
            };

            /**
             * Notifies all registered observer callbacks
             */
            this.notifyObservers = function() {
                _.each(observerCallbacks, function(callback) {
                    callback();
                })
            };

            /**
             * Reloads the controller with designated primary/secondary/tertiary types
             * @param {string} type
             * @param {string} value
             */
            this.filterByType = function(type, value) {
                var options = {
                    primary: types.primary.slug,
                    secondary: types.secondary ? types.secondary.slug : null,
                    tertiary: types.tertiary ? types.tertiary.slug : null
                };

                if (type == 'primary') {
                    options.primary = value;
                    options.secondary = null;
                    options.tertiary = null;
                } else if (type == 'secondary') {
                    options.secondary = value ? value : null;
                    options.tertiary = null;
                } else if (type == 'tertiary') {
                    options.tertiary = value ? value : null;
                }

                var params = $location.search();

                var href = $state.href('app.itemList', options);
                $location.url(href).search(params);
            };

            /**
             * Clientside Filtering
             */
            var csFiltersActive = {};
            var csFilters = {
                sort: {
                    key: 's',
                    filter: function(value) {
                        var parts = value.split(':');
                        if (parts.length !== 2 || (parts[1] !== 'asc' && parts[1] !== 'desc')) {
                            return;
                        }

                        self.sortColumn = parts[0];
                        self.sortDirection = parts[1];

                        return self.filteredData;
                    }
                },
                name: {
                    key: 'n',
                    filter: function(value) {
                        var data = [];

                        _.each(self.filteredData, function(i) {
                            if (i.name.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                                data.push(i);
                            }
                        });

                        self.filteredData = data;
                        self.filters.name = value;

                        return self.filteredData;
                    }
                },
                tiers: {
                    key: 't',
                    filter: function(value) {
                        var tiers = value.split(':');
                        var data = [];

                        _.each(self.filteredData, function(i) {
                            if (tiers.indexOf(i.tier.toString()) > -1) {
                                data.push(i);
                            }
                        });

                        self.filteredData = data;
                        self.filters.tiers = tiers;

                        return self.filteredData;
                    }
                },
                stats: {
                    key: 'st',
                    filter: function(value) {
                        var stats = value.split(';');
                        var statFilter = {};
                        var data = self.filteredData;

                        _.each(stats, function(stat) {
                            var parts = stat.split(':');
                            if (parts.length != 3) {
                                return;
                            }

                            var hash = parts[0];
                            var op = parts[1];
                            var value = parseInt(parts[2]);

                            if (!statFilter[hash]) {
                                statFilter[hash] = {};
                            }

                            statFilter[hash][op] = parts[2];
                        });

                        data = _.filter(data, function(item) {
                            for (var hash in statFilter) {
                                if (!item._stats[hash]) {
                                    return false;
                                }
                            }

                            return true;
                        });

                        data = _.filter(data, function(item) {
                            for (var hash in statFilter) {
                                for (var op in statFilter[hash]) {
                                    var value = statFilter[hash][op];

                                    if (op == 'gt' && item._stats[hash].max <= value) {
                                        return false;
                                    }

                                    if (op == 'gte' && item._stats[hash].max < value) {
                                        return false;
                                    }

                                    if (op == 'e' && (item._stats[hash].max != value && item._stats[hash].min != value)) {
                                        return false;
                                    }

                                    if (op == 'lt' && item._stats[hash].min > value) {
                                        return false;
                                    }

                                    if (op == 'lte' && item._stats[hash].min >= value) {
                                        return false;
                                    }
                                }
                            }

                            return true;
                        });

                        self.filteredData = data;
                        self.filters.stats = statFilter;

                        return self.filteredData;
                    }
                },
                class: {
                    key: 'c',
                    filter: function(value) {
                        var data = [];

                        _.each(self.filteredData, function(i) {
                            if (parseInt(i.class) === parseInt(value)) {
                                data.push(i);
                            }
                        });

                        self.filteredData = data;
                        self.filters.class = value;

                        return self.filteredData;
                    }
                },
                source: {
                    key: 'x',
                    filter: function(value) {
                        var data = [];

                        _.each(self.filteredData, function(i) {
                            if (!i.sources) {
                                return;
                            }

                            var source = _.find(i.sources, function(s) {
                                return s.hash.toString() == value.toString();
                            });

                            source && data.push(i);
                        });

                        self.filteredData = data;
                        self.filters.source = value;

                        return self.filteredData;
                    }
                }
            };

            /**
             * Resets all clientside filters
             */
            this.resetFilters = function() {
                self.page = 0;
                $location.search('p', null);

                self.sortColumn = 'name';
                self.sortDirection = 'asc';
                $location.search('s', null);

                _.each(csFiltersActive, function(filter, type) {
                    $location.search(csFilters[type].key, null);

                    if (typeof self.filters[type] == 'object') {
                        self.filters[type] = [];
                    } else {
                        self.filters[type] = null;
                    }

                    delete csFiltersActive[type];
                });

                self.filterData();
            };

            /**
             * Removes a clientside filter by type
             * @param {string} type
             */
            this.removeFilter = function(type) {
                self.page = 0;
                $location.search('p', null);

                if (csFiltersActive[type]) {
                    $location.search(csFilters[type].key, null);

                    if (typeof self.filters[type] == 'object') {
                        self.filters[type] = [];
                    } else {
                        self.filters[type] = null;
                    }

                    delete csFiltersActive[type];

                    self.filterData();
                }
            };

            /**
             * Sets a supported clientside filter. Only to be used with setting a basic string value.
             * @param {string} type
             * @param {string} value
             */
            this.filterBy = function(type, value) {
                if (!csFilters[type]) {
                    return;
                }

                self.page = 0;
                $location.search('p', null);

                if (!value) {
                    self.filters[type] = null;
                    $location.search(csFilters[type].key, null);
                    delete csFiltersActive[type];
                } else {
                    $location.search(csFilters[type].key, value);
                    csFiltersActive[type] = csFilters[type].filter;
                }

                self.filterData();
            };

            /**
             * Filters the set of items by tier (quality)
             * @param {string} value
             */
            this.filterByTier = function(value) {
                self.page = 0;
                $location.search('p', null);

                var tiers = $location.search()[csFilters.tiers.key];
                if (tiers) {
                    tiers = tiers.split(':');
                } else {
                    tiers = [];
                }

                var position = tiers.indexOf(value.toString());
                if (position > -1) {
                    tiers.splice(position, 1);
                } else {
                    tiers.push(value);
                }

                if (tiers.length === 0) {
                    self.filters.tiers = [];
                    $location.search(csFilters.tiers.key, null);
                    delete csFiltersActive.tiers;
                } else {
                    $location.search(csFilters.tiers.key, tiers.join(':'));
                    csFiltersActive.tiers = csFilters.tiers.filter;
                }

                self.filterData();
            };

            /**
             * Filters the set of items by stats
             * @param {object} obj
             */
            this.filterByStat = function(obj) {
                self.page = 0;
                $location.search('p', null);

                if (Object.keys(obj).length == 0) {
                    self.filters.stats = {};
                    $location.search(csFilters.stats.key, null);
                    delete csFiltersActive.stats;
                } else {
                    var statStrs = [];
                    _.each(obj, function(ops, hash) {
                        _.each(ops, function(value, op) {
                            statStrs.push([hash, op, value].join(':'));
                        });
                    });

                    $location.search(csFilters.stats.key, statStrs.join(';'));
                    csFiltersActive.stats = csFilters.stats.filter;
                }

                self.filterData();
            };

            /**
             * Set the primary (top level) item type
             * @param {string} value
             */
            this.setPrimaryType = function(value) {
                types.primary = consts.getItemCategoryBySlug(value);
                if (!types.primary) {
                    this.errors.push('PRIMARY_NOT_FOUND');
                    this.notifyObservers();
                    return;
                }

                this.seoTitle = types.primary.label + ' List - Items - Guardian.gg';
                this.categories.push(types.primary.category);
                this.listType = types.primary.list_type;
                this.typeLists.secondary = types.primary.children;
                this.filters.type.primary = value;
            };

            /**
             * Set the secondary (child of primary) item type
             * @param {string} value
             */
            this.setSecondaryType = function(value) {
                if (!value) {
                    return;
                }

                types.secondary = consts.getItemCategoryBySlug(value, types.primary.children);
                if (!types.secondary) {
                    this.errors.push('SECONDARY_NOT_FOUND');
                    this.notifyObservers();
                    return;
                }

                this.seoTitle = types.secondary.label + ' List - Items - Guardian.gg';
                this.categories.push(types.secondary.category);
                this.listType = types.secondary.list_type;
                this.typeLists.tertiary = types.secondary.children;
                this.filters.type.secondary = value;
            };

            /**
             * Set the tertiary (child of child of primary) item type
             * @param {string} value
             */
            this.setTertiaryType = function(value) {
                if (!value) {
                    return;
                }

                types.tertiary = consts.getItemCategoryBySlug(value, types.secondary.children);
                if (!types.tertiary) {
                    this.errors.push('TERTIARY_NOT_FOUND');
                    this.notifyObservers();
                    return;
                }

                this.seoTitle = types.tertiary.label + ' List - Items - Guardian.gg';
                this.categories.push(types.tertiary.category);
                this.listType = types.tertiary.list_type;
                this.filters.type.tertiary = value;
            };

            /**
             * Pagination handling
             * @param {integer} p
             */
            this.setPage = function(p) {
                self.page = p;

                if (p > 0) {
                    $location.search('p', p);
                } else {
                    $location.search('p', null);
                }

                self.filterData();
            };

            /**
             * Sorts the set of data based on the column. Accepts a string notation of the object, for example
             * { _stats: { 12345: { max: 50 } } } would be '_stats.12345.max'
             * @param col
             */
            this.sortBy = function(col) {
                self.page = 0;
                $location.search('p', null);

                if (col == this.sortColumn) {
                    this.sortDirection = this.sortDirection == 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortColumn = col;
                    this.sortDirection = col == 'name' ? 'asc' : 'desc';
                }

                if (col !== 'name') {
                    $location.search(csFilters.sort.key, this.sortColumn + ':' + this.sortDirection);
                } else {
                    $location.search(csFilters.sort.key, null);
                }

                self.filterData();
            };

            /**
             * Iterates all active filters and sorts the data, this should be run each time a filter or set of filters
             * has been applied. Observer callbacks are fired once the data is ready.
             */
            this.filterData = function() {
                self.filteredData = self.rawData;

                _.each(csFiltersActive, function(filter, type) {
                    var value = $location.search()[csFilters[type].key];
                    value && filter(value);
                });

                var sortParts = this.sortColumn.split('.');
                self.filteredData = _(self.filteredData).chain()
                    .sortBy('name')
                    .sortBy(function(obj) {
                        var value = obj;

                        for (var i = 0; i < sortParts.length; i++) {
                            value = value[sortParts[i].toString()];
                            if (typeof value === 'undefined') {
                                return 0;
                            }
                        }

                        // Sort numeric columns
                        if (!value || util.isNumeric(value)) {
                            return self.sortDirection == 'asc' ? value : -value;

                        // Sort alpha/date columns
                        } else {
                            if (moment(value, 'YYYY-MM-DD H:mm:ss', true).isValid()) {
                                var time = new Date(value).getTime();
                                return self.sortDirection == 'asc' ? time : -time;
                            } else {
                                return self.sortDirection == 'asc' ? value.charCodeAt() : value.charCodeAt() * -1;
                            }
                        }
                    })
                    .value();

                var offset = self.page * self.perPage;
                var limit = offset + self.perPage;

                self.filteredDataTotal = self.filteredData.length;
                self.filteredData = self.filteredData.slice(offset, limit);

                self.notifyObservers();
            };

            /**
             * Returns a list of params to send when making an API call
             * @returns {{category: (string|*)}}
             */
            this.getApiParams = function() {
                return {
                    category: this.categories.join(',')
                };
            };

            /**
             * Call the API
             */
            this.load = function() {
                gamedata
                    .getPage('items', this.page, this.getApiParams())
                    .then(function(data) {
                        self.rawData = data.data;
                        var statColumns = consts.item_list_types[self.listType].stat_columns;

                        // Re-map the stats so the object key is the stat hash, this makes it easier to display the
                        // appropriate stat under the stat column, which is not in the same order as the item stat array
                        _.each(self.rawData, function(item) {
                            item._stats = {};

                            if (!item.name) {
                                item.name = gettextCatalog.getString('[Unnamed Item]');
                            }

                            _.each(item.stats, function(stat) {
                                stat.hash = stat.hash.toString();

                                var exists = _.find(self.statColumns, function(e) {
                                    return e.hash == stat.hash;
                                });

                                // If the stat exists in the list view template, add the column
                                if (!exists && _.contains(statColumns, stat.hash)) {
                                    self.statColumns.push(stat);
                                }

                                item._stats[stat.hash.toString()] = stat;
                            });
                        });

                        // Give the client some guidance on the intended order of the stat columns
                        _.each(statColumns, function(col, idx) {
                            var exists = _.find(self.statColumns, function(e) {
                                return e.hash == col;
                            });

                            if (exists) {
                                exists.index = idx;
                            }
                        });

                        self.page = 0;

                        // Set defaults from query string
                        _.each($location.search(), function (value, key) {
                            if (key == 'p') {
                                self.page = parseInt(value);
                            }

                            _.each(csFilters, function(f, type) {
                                if (f.key == key) {
                                    csFiltersActive[type] = f.filter;
                                }
                            });
                        });

                        self.statColumns = _.sortBy(self.statColumns, 'index');
                        self.filterData();
                    });
            }
        };
    }
]);
