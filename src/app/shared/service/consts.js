var app = angular.module('app');

app.service('consts', [
    'gettextCatalog',

    function (gettextCatalog) {
        return {
            getItemCategoryBySlug: function(slug, list) {
                if (!list) {
                    list = this.item_category_list;
                }

                return _.find(list, function(cat) {
                    return cat.slug == slug;
                });
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
                15: gettextCatalog.getString('Doubles'),
                28: gettextCatalog.getString('Zone Control'),
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
            item_category_list: [
                {
                    slug: 'weapon',
                    list_type: 'weapon',
                    group: 'equip_stat',
                    label: gettextCatalog.getString('Weapon'),
                    category: 1,
                    children: [
                        {
                            slug: 'primary',
                            list_type: 'weapon',
                            label: gettextCatalog.getString('Primary Weapon'),
                            category: 2,
                            children: [
                                {
                                    slug: 'auto-rifle',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Auto Rifle'),
                                    category: 5,
                                    children: []
                                },
                                {
                                    slug: 'fusion-rifle',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Fusion Rifle'),
                                    category: 9,
                                    children: []
                                },
                                {
                                    slug: 'hand-cannon',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Hand Cannon'),
                                    category: 6,
                                    children: []
                                },
                                {
                                    slug: 'pulse-rifle',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Pulse Rifle'),
                                    category: 7,
                                    children: []
                                },
                                {
                                    slug: 'scout-rifle',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Scout Rifle'),
                                    category: 8,
                                    children: []
                                },
                                {
                                    slug: 'shotgun',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Shotgun'),
                                    category: 11,
                                    children: []
                                },
                                {
                                    slug: 'sniper-rifle',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Sniper Rifle'),
                                    category: 10,
                                    children: []
                                }
                            ]
                        }, // primary
                        {
                            slug: 'special',
                            list_type: 'weapon',
                            label: gettextCatalog.getString('Special Weapon'),
                            category: 3,
                            children: [
                                {
                                    slug: 'fusion-rifle',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Fusion Rifle'),
                                    category: 9,
                                    children: []
                                },
                                {
                                    slug: 'shotgun',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Shotgun'),
                                    category: 11,
                                    children: []
                                },
                                {
                                    slug: 'sidearm',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Sidearm'),
                                    category: 14,
                                    children: []
                                },
                                {
                                    slug: 'sniper-rifle',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Sniper Rifle'),
                                    category: 10,
                                    children: []
                                }
                            ]
                        }, // special
                        {
                            slug: 'heavy',
                            list_type: 'weapon',
                            label: gettextCatalog.getString('Heavy Weapon'),
                            category: 4,
                            children: [
                                {
                                    slug: 'fusion-rifle',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Fusion Rifle'),
                                    category: 9,
                                    children: []
                                },
                                {
                                    slug: 'machine-gun',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Machine Gun'),
                                    category: 12,
                                    children: []
                                },
                                {
                                    slug: 'rocket-launcher',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Rocket Launcher'),
                                    category: 13,
                                    children: []
                                },
                                {
                                    slug: 'sword',
                                    list_type: 'weapon',
                                    label: gettextCatalog.getString('Sword'),
                                    category: 54,
                                    children: []
                                }
                            ]
                        } // heavy
                    ]
                }, // weapon
                {
                    slug: 'armor',
                    list_type: 'armor',
                    group: 'equip_stat',
                    label: gettextCatalog.getString('Armor'),
                    category: 20,
                    children: [
                        {
                            slug: 'helmet',
                            list_type: 'armor',
                            label: gettextCatalog.getString('Helmet'),
                            category: 45,
                            children: []
                        },
                        {
                            slug: 'arms',
                            list_type: 'armor',
                            label: gettextCatalog.getString('Arms'),
                            category: 46,
                            children: []
                        },
                        {
                            slug: 'chest',
                            list_type: 'armor',
                            label: gettextCatalog.getString('Chest'),
                            category: 47,
                            children: []
                        },
                        {
                            slug: 'legs',
                            list_type: 'armor',
                            label: gettextCatalog.getString('Legs'),
                            category: 48,
                            children: []
                        },
                        {
                            slug: 'class-item',
                            list_type: 'armor',
                            label: gettextCatalog.getString('Class Item'),
                            category: 49,
                            children: []
                        },
                        {
                            slug: 'artifact',
                            list_type: 'armor',
                            label: gettextCatalog.getString('Artifact'),
                            category: 38,
                            children: []
                        },
                        {
                            slug: 'ghost',
                            list_type: 'armor',
                            label: gettextCatalog.getString('Ghost'),
                            category: 39,
                            children: []
                        },
                    ]
                }, // armor
                {
                    slug: 'subclass',
                    list_type: 'standard',
                    group: 'equip_stat',
                    label: gettextCatalog.getString('Subclass'),
                    category: 50,
                    children: []
                },
                {
                    slug: 'emblem',
                    list_type: 'standard',
                    group: 'equip_passive',
                    label: gettextCatalog.getString('Emblem'),
                    category: 19,
                    children: []
                },
                {
                    slug: 'emote',
                    list_type: 'standard',
                    group: 'equip_passive',
                    label: gettextCatalog.getString('Emote'),
                    category: 44,
                    children: []
                },
                {
                    slug: 'shader',
                    list_type: 'standard',
                    group: 'equip_passive',
                    label: gettextCatalog.getString('Shader'),
                    category: 41,
                    children: []
                },
                {
                    slug: 'ship',
                    list_type: 'standard',
                    group: 'equip_passive',
                    label: gettextCatalog.getString('Ship'),
                    category: 42,
                    children: [
                        {
                            slug: 'schematic',
                            list_type: 'standard',
                            label: gettextCatalog.getString('Ship Schematic'),
                            category: 51,
                            children: []
                        },
                    ]
                },
                {
                    slug: 'sparrow',
                    list_type: 'sparrow',
                    group: 'equip_passive',
                    label: gettextCatalog.getString('Sparrow'),
                    category: 43,
                    children: []
                },
                {
                    slug: 'bounty',
                    list_type: 'standard',
                    group: 'inventory',
                    label: gettextCatalog.getString('Bounty'),
                    category: 26,
                    children: [
                        {
                            slug: 'vanguard',
                            list_type: 'standard',
                            label: gettextCatalog.getString('Vanguard'),
                            category: 27,
                            children: []
                        },
                        {
                            slug: 'crucible',
                            list_type: 'standard',
                            label: gettextCatalog.getString('Crucible'),
                            category: 28,
                            children: []
                        }
                    ]
                },
                {
                    slug: 'consumable',
                    list_type: 'standard',
                    group: 'inventory',
                    label: gettextCatalog.getString('Consumable'),
                    category: 35,
                    children: []
                },
                {
                    slug: 'currency',
                    list_type: 'standard',
                    group: 'inventory',
                    label: gettextCatalog.getString('Currency'),
                    category: 18,
                    children: []
                },
                {
                    slug: 'engram',
                    list_type: 'standard',
                    group: 'inventory',
                    label: gettextCatalog.getString('Engram'),
                    category: 34,
                    children: []
                },
                {
                    slug: 'material',
                    list_type: 'standard',
                    group: 'inventory',
                    label: gettextCatalog.getString('Material'),
                    category: 40,
                    children: []
                },
                {
                    slug: 'mission-key',
                    list_type: 'standard',
                    group: 'inventory',
                    label: gettextCatalog.getString('Mission Key Item'),
                    category: 37,
                    children: []
                },
                {
                    slug: 'mask',
                    list_type: 'standard',
                    group: 'event',
                    label: gettextCatalog.getString('Halloween Mask'),
                    category: 55,
                    children: []
                },
            ],
            item_list_types: {
                standard: {
                    stat_columns: []
                },
                weapon: {
                    stat_columns: [
                        "368428387", // Attack
                        //"2391494160", // Light
                        "3871231066", // Magazine
                        "925767036", // Energy
                        "4284893193", // Rate of fire
                        "2523465841", // Velocity
                        "2961396640", // Charge rate
                        "155624089", // Stability
                        "1240592695", // Range
                        "4043523819", // Impact
                        "3614673599", // Blast radius
                        "4188031367", // Reload speed
                        "3555269338", // Optics
                        "2762071195", // Efficiency
                        "1345609583", // Aim assist
                        "2715839340", // Recoil
                        "943549884", // Equip speed
                        "2837207746", // Speed
                    ]
                },
                armor: {
                    stat_columns: [
                        "3897883278", // Defense
                        //"2391494160", // Light
                        "144602215", // Intellect
                        "1735777505", // Discipline
                        "4244567218", // Strength
                    ]
                },
                sparrow: {
                    stat_columns: [
                        "1501155019", // Speed
                        "360359141", // Durability
                        "3017642079", // Boost
                    ]
                }
            }
        };
    }
]);
