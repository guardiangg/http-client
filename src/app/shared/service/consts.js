var app = angular.module('app');

app.service('consts', [
    'gettextCatalog',

    function (gettextCatalog) {
        return {
            itemSubTypeToId: function(name) {
                var result;

                _.find(this.item_sub_types, function(type, id) {
                    if (type.name.toLowerCase().trim() == name.toLowerCase().trim()) {
                        result = parseInt(id);
                        return true;
                    }
                });

                return result;
            },

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
                19: gettextCatalog.getString('Iron Banner'),
                14: gettextCatalog.getString('Trials of Osiris')
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
                28: 'ggg-control'
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
            item_types: {
                weapon: {
                    label: 'Weapon',
                    types: {
                        primary: {
                            list_type: 'weapon',
                            bucket: 1498876634,
                            label: gettextCatalog.getString('Primary Weapon'),
                            sub_types: [0, 6, 7, 9, 11, 12, 13, 14]
                        },
                        special: {
                            list_type: 'weapon',
                            bucket: 2465295065,
                            label: gettextCatalog.getString('Special Weapon'),
                            sub_types: [0, 7, 11, 12, 17]
                        },
                        heavy: {
                            list_type: 'weapon',
                            bucket: 953998645,
                            label: gettextCatalog.getString('Heavy Weapon'),
                            sub_types: [0, 11, 8, 10, 18]
                        }
                    }
                },
                armor: {
                    label: 'Armor',
                    types: {
                        head: {
                            list_type: 'armor',
                            bucket: 3448274439,
                            label: gettextCatalog.getString('Helmets'),
                            sub_types: [0, 19]
                        },
                        arm: {
                            list_type: 'armor',
                            bucket: 3551918588,
                            label: gettextCatalog.getString('Arms'),
                            sub_types: [0]
                        },
                        chest: {
                            list_type: 'armor',
                            bucket: 14239492,
                            label: gettextCatalog.getString('Chest'),
                            sub_types: [0]
                        },
                        leg: {
                            list_type: 'armor',
                            bucket: 20886954,
                            label: gettextCatalog.getString('Legs'),
                            sub_types: [0]
                        },
                        class: {
                            list_type: 'armor',
                            bucket: 1585787867,
                            label: gettextCatalog.getString('Class Items'),
                            sub_types: [0]
                        },
                        ghost: {
                            list_type: 'armor',
                            bucket: 4023194814,
                            label: gettextCatalog.getString('Ghost'),
                            sub_types: [0]
                        },
                        artifact: {
                            list_type: 'armor',
                            bucket: 434908299,
                            label: gettextCatalog.getString('Artifact'),
                            sub_types: [0]
                        }
                    }
                },
                other_equippable: {
                    label: 'Other Equippable',
                    types: {
                        subclass: {
                            list_type: 'standard',
                            bucket: 3284755031,
                            label: gettextCatalog.getString('Subclass'),
                            sub_types: [0]
                        },
                        emblem: {
                            list_type: 'standard',
                            bucket: 4274335291,
                            label: gettextCatalog.getString('Emblem'),
                            sub_types: [0]
                        },
                        shader: {
                            list_type: 'standard',
                            bucket: 2973005342,
                            label: gettextCatalog.getString('Shader'),
                            sub_types: [0]
                        },
                        ship: {
                            list_type: 'standard',
                            bucket: 284967655,
                            label: gettextCatalog.getString('Ship'),
                            sub_types: [0]
                        },
                        sparrow: {
                            list_type: 'vehicle',
                            bucket: 2025709351,
                            label: gettextCatalog.getString('Sparrow'),
                            sub_types: [0]
                        },
                        emote: {
                            list_type: 'standard',
                            bucket: 3054419239,
                            label: gettextCatalog.getString('Emote'),
                            sub_types: [0]
                        }
                    }
                },
                inventory: {
                    label: 'Inventory',
                    types: {
                        //temporary: {
                        //    bucket: 2197472680,
                        //    label: gettextCatalog.getString('Temporary'),
                        //    sub_types: []
                        //},
                        //bounty: {
                        //    bucket: 2197472680,
                        //    label: gettextCatalog.getString('Bounty'),
                        //    sub_types: [1, 2, 3, 4, 5]
                        //},
                        //quest: {
                        //    bucket: 1801258597,
                        //    label: gettextCatalog.getString('Quest'),
                        //    sub_types: []
                        //},
                        //mission: {
                        //    bucket: 375726501,
                        //    label: gettextCatalog.getString('Mission Key Item'),
                        //    sub_types: []
                        //},
                        consumable: {
                            list_type: 'standard',
                            bucket: 1469714392,
                            label: gettextCatalog.getString('Consumable'),
                            sub_types: [0]
                        },
                        material: {
                            list_type: 'standard',
                            bucket: 3865314626,
                            label: gettextCatalog.getString('Material'),
                            sub_types: [0]
                        }
                    }
                }
            },
            item_sub_types: {
                0: {
                    name: 'all',
                    label: gettextCatalog.getString('All')
                },
                1: {
                    name: 'crucible',
                    label: gettextCatalog.getString('Crucible')
                },
                2: {
                    name: 'vanguard',
                    label: gettextCatalog.getString('Vanguard')
                },
                3: {
                    name: 'iron-banner',
                    label: gettextCatalog.getString('Iron Banner')
                },
                4: {
                    name: 'reef',
                    label: gettextCatalog.getString('Reef')
                },
                5: {
                    name: 'exotic',
                    label: gettextCatalog.getString('Exotic')
                },
                6: {
                    name: 'auto-rifle',
                    label: gettextCatalog.getString('Auto Rifle')
                },
                7: {
                    name: 'shotgun',
                    label: gettextCatalog.getString('Shotgun')
                },
                8: {
                    name: 'machine-gun',
                    label: gettextCatalog.getString('Machine Gun')
                },
                9: {
                    name: 'hand-cannon',
                    label: gettextCatalog.getString('Hand Cannon')
                },
                10: {
                    name: 'rocket-launcher',
                    label: gettextCatalog.getString('Rocket Launcher')
                },
                11: {
                    name: 'fusion-rifle',
                    label: gettextCatalog.getString('Fusion Rifle')
                },
                12: {
                    name: 'sniper-rifle',
                    label: gettextCatalog.getString('Sniper Rifle')
                },
                13: {
                    name: 'pulse-rifle',
                    label: gettextCatalog.getString('Pulse Rifle')
                },
                14: {
                    name: 'scout-rifle',
                    label: gettextCatalog.getString('Scout Rifle')
                },
                15: {
                    name: 'camera',
                    label: gettextCatalog.getString('Camera')
                },
                16: {
                    name: 'crm',
                    label: gettextCatalog.getString('Special Orders')
                },
                17: {
                    name: 'sidearm',
                    label: gettextCatalog.getString('Sidearm')
                },
                18: {
                    name: 'sword',
                    label: gettextCatalog.getString('Sword')
                },
                19: {
                    name: 'mask',
                    label: gettextCatalog.getString('Mask')
                }
            }
        };
    }
]);
