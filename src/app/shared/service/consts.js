var app = angular.module('app');

app.service('consts', [
    'gettextCatalog',

    function (gettextCatalog) {
        return {
            subclassToId: function(name) {
                var result = null;

                _.find(this.subclasses, function(subclass, id) {
                    if (subclass.name.toLowerCase().trim() == name.toLowerCase().trim()) {
                        result = id;
                        return true;
                    }}
                );

                return result;
            },

            subclassIdToLabel: function(id) {
                return this.subclasses[id] ? this.subclasses[id].label : null;
            },

            subclassIdToColor: function(id) {
                return this.subclasses[id] ? this.subclasses[id].color : null;
            },

            ratingToLeague: function(rating) {
                return _.find(this.leagues, function(league, idx) {
                    return rating >= league.from && rating <= league.to;
                });
            },

            languages: {
                de: 'Deutsch',
                en: 'English',
                es: 'Español',
                fr: 'Français',
                it: 'Italiano',
                'pt-br': 'Português (Brasil)',
                ja: '日本語',
                pl: 'Polski'
            },

            leagues: {
                bronze: {
                    label: gettextCatalog.getString('Bronze'),
                    from: 0,
                    to: 1099,
                    colors: {
                        background: 'rgb(179, 148, 113)',
                        line: 'rgba(162, 124, 78, 0.5)',
                        band: 'rgba(162, 124, 78, 0.2)',
                        label: 'rgba(162, 124, 78, 0.6)'
                    }
                },
                silver: {
                    label: gettextCatalog.getString('Silver'),
                    from: 1100,
                    to: 1299,
                    colors: {
                        background: 'rgb(179, 179, 179)',
                        line: 'rgba(204, 214, 209, 0.5)',
                        band: 'rgba(204, 214, 209, 0.2)',
                        label: 'rgba(204, 214, 209, 0.6)'
                    }
                },
                gold: {
                    label: gettextCatalog.getString('Gold'),
                    from: 1300,
                    to: 1499,
                    colors: {
                        background: 'rgb(177, 154, 92)',
                        line: 'rgba(231, 194, 68, 0.5)',
                        band: 'rgba(231, 194, 68, 0.2)',
                        label: 'rgba(231, 194, 68, 0.6)'
                    }
                },
                platinum: {
                    label: gettextCatalog.getString('Platinum'),
                    from: 1500,
                    to: 1699,
                    colors: {
                        background: 'rgb(98, 130, 123)',
                        line: 'rgba(77, 158, 130, 0.5)',
                        band: 'rgba(77, 158, 130, 0.2)',
                        label: 'rgba(77, 158, 130, 0.6)'
                    }
                },
                diamond: {
                    label: gettextCatalog.getString('Diamond'),
                    from: 1700,
                    to: 9999,
                    colors: {
                        background: 'rgb(113, 152, 183)',
                        line: 'rgba(75, 139, 189, 0.5)',
                        band: 'rgba(75, 139, 189, 0.2)',
                        label: 'rgba(75, 139, 189, 0.6)'
                    }
                }
            },
            platforms: {
                1: gettextCatalog.getString('Xbox'),
                2: gettextCatalog.getString('PlayStation')
            },
            modes: {
                9: gettextCatalog.getString('Skirmish'),
                10: gettextCatalog.getString('Control'),
                11: gettextCatalog.getString('Salvage'),
                12: gettextCatalog.getString('Clash'),
                24: gettextCatalog.getString('Rift'),
                13: gettextCatalog.getString('Rumble'),
                23: gettextCatalog.getString('Elimination'),
                15: gettextCatalog.getString('Doubles'),
                28: gettextCatalog.getString('Zone Control'),
                19: gettextCatalog.getString('Iron Banner'),
                14: gettextCatalog.getString('Trials of Osiris'),
                29: gettextCatalog.getString('SRL')
            },
            modeIcons: {
                9: 'ggg-skirmish',
                10: 'ggg-control',
                11: 'ggg-salvage',
                12: 'ggg-clash',
                13: 'ggg-rumble',
                14: 'ggg-osiris',
                15: 'ggg-doubles',
                19: 'ggg-iron-banner',
                23: 'ggg-elimination',
                24: 'ggg-rift',
                26: 'ggg-clash',
                27: 'ggg-rumble',
                28: 'ggg-control',
                29: 'ggg-srl'
            },
            classes: {
                2271682572: gettextCatalog.getString('Warlock'),
                671679327: gettextCatalog.getString('Hunter'),
                3655393761: gettextCatalog.getString('Titan')
            },
            subclasses: {
                21395672: {
                    name: 'sunbreaker',
                    label: gettextCatalog.getString('Sunbreaker'),
                    color: '#FF9741'
                },
                2007186000: {
                    name: 'defender',
                    label: gettextCatalog.getString('Defender'),
                    color: '#7B31A2'
                },
                2455559914: {
                    name: 'striker',
                    label: gettextCatalog.getString('Striker'),
                    color: '#3698CE'
                },
                3658182170: {
                    name: 'sunsinger',
                    label: gettextCatalog.getString('Sunsinger'),
                    color: '#FFA55A'
                },
                3828867689: {
                    name: 'voidwalker',
                    label: gettextCatalog.getString('Voidwalker'),
                    color: '#9A41FF'
                },
                1256644900: {
                    name: 'stormcaller',
                    label: gettextCatalog.getString('Stormcaller'),
                    color: '#85D4FF'
                },
                1716862031: {
                    name: 'gunslinger',
                    label: gettextCatalog.getString('Gunslinger'),
                    color: '#FF9D4C'
                },
                4143670657: {
                    name: 'nightstalker',
                    label: gettextCatalog.getString('Nightstalker'),
                    color: '#BD47FD'
                },
                2962927168: {
                    name: 'bladedancer',
                    label: gettextCatalog.getString('Bladedancer'),
                    color: '#3EB9FD'
                }
            },
            buckets: {
                'subclass': 3284755031,
                'primary': 1498876634,
                'special': 2465295065,
                'heavy': 953998645,
                'head': 3448274439,
                'arm': 3551918588,
                'chest': 14239492,
                'leg': 20886954,
                'ghost': 4023194814,
                'class': 1585787867,
                'artifact': 434908299,
                'ship': 284967655,
                'vehicle': 2025709351,
                'consumable': 1469714392,
                'material': 3865314626,
                'shader': 2973005342,
                'emblem': 4274335291,
                'emote': 3054419239
            },
            srl_maps: {
                1478347980: gettextCatalog.getString('Campus Martius'),
                2243240710: gettextCatalog.getString('Infinite Descent')
            }
        };
    }
]);
