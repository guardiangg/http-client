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
                    return Math.round(rating) >= league.from && Math.round(rating) <= league.to;
                });
            },

            customToBungieMode: function(mode) {
                if (mode == 523) {
                    mode = 23;
                }
                return mode;
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

            currentSeason: 3,

            seasons: {
                1: {
                    label: gettextCatalog.getString('Season 1 - The Taken King'),
                    subtext: gettextCatalog.getString('Season 1 took place between Sep 15th, 2015 and Apr 12th, 2016')
                },
                2: {
                    label: gettextCatalog.getString('Season 2 - The Taken King'),
                    subtext: gettextCatalog.getString('Season 2 took place between Apr 12th, 2015 and Sept 20th, 2016')
                }
            },

            currentSeasonSrl: 2,

            seasonsSrl: {
                1: {
                    label: gettextCatalog.getString('Season 1 (2015)'),
                    subtext: gettextCatalog.getString('Season 1 took place in December 2015')
                },
                2: {
                    label: gettextCatalog.getString('Season 2 (2016)'),
                    subtext: gettextCatalog.getString('Season 2 took place in December 2016')
                }
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
                // pvp
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
                31: gettextCatalog.getString('Supremacy'),
                34: gettextCatalog.getString('Supremacy'),

                // custom modes
                523: gettextCatalog.getString('Crimson Doubles'),
                531: gettextCatalog.getString('Rumble Supremacy'),

                // pve
                3: gettextCatalog.getString('Normal Strike'),
                4: gettextCatalog.getString('Raid'),
                16: gettextCatalog.getString('Nightfall'),
                17: gettextCatalog.getString('Heroic Strike'),
                20: gettextCatalog.getString('Prison of Elders'),
                2: gettextCatalog.getString('Story'),
                6: gettextCatalog.getString('Patrol'),

                // srl
                29: gettextCatalog.getString('SRL')
            },
            strikes: {
                exclusive: [
                    '1646288223', // Echo Chamber
                    '575376446' // Echo Chamber
                ],
                heroic: [
                    '3373044013', // Blighted Chalice
                    '2396741855', // Cerebrus Vae III
                    '4252752792', // Dust Palace
                    '1646288223', // Echo Chamber
                    '1501957761', // Fallen S.A.B.E.R.
                    '2268273279', // Sepiks Perfected
                    '342909762', // Shield Brothers
                    '1431469570', // The Abomination Heist
                    '2799122060', // The Nexus
                    '1816396489', // The Shadow Thief
                    '3842976518', // The Sunless Cell
                    '1016116686', // The Undying Mind
                    '3670968271', // The Will of Crota
                    '2178968385', // The Wretched Eye
                    '3676594097' // Winter's Run
                ],
                normal: [
                    '3343503784', // Blighted Chalice
                    '1740074530', // Cerebrus Vae III
                    '194283519', // Dust Palace
                    '575376446', // Echo Chamber
                    '1526798932', // Fallen S.A.B.E.R.
                    '482017096', // Sepiks Perfected
                    '1669262087', // Shield Brothers
                    '2678657479', // The Abomination Heist
                    '242777083', // The Nexus
                    '2275772174', // The Shadow Thief
                    '2546962221', // The Sunless Cell
                    '1918823817', // The Undying Mind
                    '4215168114', // The Will of Crota
                    '2664207554', // The Wretched Eye
                    '3896699662' // Winter's Run
                ],
                nightfall: [
                    '1169187265' // The Nexus
                ]
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
                31: 'ggg-supremacy',

                // custom modes
                523: 'ggg-elimination',
                531: 'ggg-supremacy',

                // pve
                3: 'ggg-strike',
                4: 'ggg-raid',
                16: 'ggg-nightfall',
                17: 'ggg-strike-heroic',
                20: 'ggg-prison',
                21: 'ggg-prison',
                22: 'ggg-prison',
                30: 'ggg-prison',
                2: 'ggg-story',
                6: 'ggg-patrol',

                // srl
                29: 'ggg-srl'
            },
            teams: {
                0: {
                    label: gettextCatalog.getString('Players'),
                    icon: null
                },
                16: {
                    label: gettextCatalog.getString('Alpha'),
                    icon: 'ggg-alpha'
                },
                17: {
                    label: gettextCatalog.getString('Bravo'),
                    icon: 'ggg-bravo'
                },
                99: {
                    label: gettextCatalog.getString('Deserters'),
                    icon: null
                }
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
                2243240710: gettextCatalog.getString('Infinite Descent'),
                2010056644: gettextCatalog.getString('Haakon Principle'),
                2828456290: gettextCatalog.getString('Shining Sands'),
            },
            item_tiers: {
                1: {
                    label: gettextCatalog.getString('Basic'),
                    color: '#C1BBB2'
                },
                2: {
                    label: gettextCatalog.getString('Common'),
                    color: '#C1BBB2'
                },
                3: {
                    label: gettextCatalog.getString('Uncommon'),
                    color: '#366F42'
                },
                4: {
                    label: gettextCatalog.getString('Rare'),
                    color: '#5076A3'
                },
                5: {
                    label: gettextCatalog.getString('Legendary'),
                    color: '#522F65'
                },
                6: {
                    label: gettextCatalog.getString('Exotic'),
                    color: '#C6A72F'
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
            },
            stats: {
                display: [
                    "4284893193", // Rate of fire
                    "2961396640", // Charge rate
                    "3614673599", // Blast radius
                    "2523465841", // Velocity
                    "2837207746", // Speed
                    "4043523819", // Impact
                    "1240592695", // Range
                    "155624089", // Stability
                    "4188031367", // Reload speed
                    "2762071195", // Efficiency
                    "209426660", // Defense
                    "925767036", // Energy
                    "360359141", // Durability
                    "3017642079", // Boost
                ],
                hidden: [
                    "3555269338", // Optics
                    "1345609583", // Aim assist
                    "2715839340", // Recoil
                    "943549884", // Equip speed
                ],
                armor: [
                    "144602215", // Intellect
                    "1735777505", // Discipline
                    "4244567218", // Strength
                ],
                intellect: "144602215",
                discipline: "1735777505",
                strength: "4244567218",
                magazine: "3871231066",
                attack: "368428387",
                defense: "3897883278"
            },
            reward_sources: [
                {
                    label: gettextCatalog.getString('Activities'),
                    sources: [
                        {
                            hash: "1882189853",
                            label: gettextCatalog.getString('Crucible')
                        },
                        {
                            hash: "478645002",
                            label: gettextCatalog.getString('Iron Banner')
                        },
                        {
                            hash: "36493462",
                            label: gettextCatalog.getString('Prison of Elders')
                        },
                        {
                            hash: "3739898362",
                            label: gettextCatalog.getString('Challenge of the Elders')
                        },
                        {
                            hash: "3107502809",
                            label: gettextCatalog.getString('Raid - Crota\'s End')
                        },
                        {
                            hash: "3551688287",
                            label: gettextCatalog.getString('Raid - King\'s Fall')
                        },
                        {
                            hash: "686593720",
                            label: gettextCatalog.getString('Raid - Vault of Glass')
                        },
                        {
                            hash: "3945957624",
                            label: gettextCatalog.getString('Sparrow Racing League')
                        },
                        {
                            hash: "4131549852",
                            label: gettextCatalog.getString('SRL Record Book')
                        },
                        {
                            hash: "3870113141",
                            label: gettextCatalog.getString('Strike')
                        },
                        {
                            hash: "3116705946",
                            label: gettextCatalog.getString('Strike - Heroic')
                        },
                        {
                            hash: "113998144",
                            label: gettextCatalog.getString('Strike - Nightfall')
                        },
                        {
                            hash: "3413298620",
                            label: gettextCatalog.getString('Trials of Osiris')
                        },
                    ]
                },
                {
                    label: gettextCatalog.getString('Expansion Pack'),
                    sources: [
                        {
                            hash: "460228854",
                            label: gettextCatalog.getString('The Taken King')
                        },
                    ]
                },
                {
                    label: gettextCatalog.getString('Outdoor Zone'),
                    sources: [
                        {
                            hash: "2644169369",
                            label: gettextCatalog.getString('Oryx\'s Dreadnaught')
                        },
                        {
                            hash: "2861499388",
                            label: gettextCatalog.getString('Meridian Bay')
                        },
                        {
                            hash: "3405266230",
                            label: gettextCatalog.getString('Patrol')
                        },
                        {
                            hash: "1391763834",
                            label: gettextCatalog.getString('Ocean of Storms')
                        },
                        {
                            hash: "1835600269",
                            label: gettextCatalog.getString('Old Russia')
                        },
                        {
                            hash: "1396812895",
                            label: gettextCatalog.getString('Ishtar Sink')
                        },
                    ]
                },
                {
                    label: gettextCatalog.getString('Reef Vendor'),
                    sources: [
                        {
                            hash: "3286066462",
                            label: gettextCatalog.getString('Queen\'s Wrath')
                        },
                        {
                            hash: "482203941",
                            label: gettextCatalog.getString('Disciple of Osiris')
                        },
                        {
                            hash: "3523074641",
                            label: gettextCatalog.getString('Variks')
                        },
                    ]
                },
                {
                    label: gettextCatalog.getString('Tower Vendor'),
                    sources: [
                        {
                            hash: "2859308742",
                            label: gettextCatalog.getString('Future War Cult')
                        },
                        {
                            hash: "3080587303",
                            label: gettextCatalog.getString('Dead Orbit')
                        },
                        {
                            hash: "1963381593",
                            label: gettextCatalog.getString('New Monarchy')
                        },
                        {
                            hash: "2770509343",
                            label: gettextCatalog.getString('Lord Saladin')
                        },
                        {
                            hash: "3496730577",
                            label: gettextCatalog.getString('Vanguard Quartermaster')
                        },
                        {
                            hash: "709638738",
                            label: gettextCatalog.getString('Titan Vanguard')
                        },
                        {
                            hash: "866383853",
                            label: gettextCatalog.getString('Hunter Vanguard')
                        },
                        {
                            hash: "4074277503",
                            label: gettextCatalog.getString('Warlock Vanguard')
                        },
                        {
                            hash: "2155337848",
                            label: gettextCatalog.getString('Eververse')
                        },
                        {
                            hash: "1662396737",
                            label: gettextCatalog.getString('Crota\'s Bane')
                        },
                        {
                            hash: "299200664",
                            label: gettextCatalog.getString('Gunsmith')
                        },
                        {
                            hash: "3498761033",
                            label: gettextCatalog.getString('The Speaker')
                        },
                        {
                            hash: "3660582080",
                            label: gettextCatalog.getString('Shipwright')
                        },
                        {
                            hash: "3672389432",
                            label: gettextCatalog.getString('Guardian Outfitter')
                        },
                        {
                            hash: "1257353826",
                            label: gettextCatalog.getString('Crucible Handler')
                        },
                        {
                            hash: "1587918730",
                            label: gettextCatalog.getString('Crucible Quartermaster')
                        },
                    ]
                },
                {
                    label: gettextCatalog.getString('Multi-Location Vendor'),
                    sources: [
                        {
                            hash: "2975148657",
                            label: gettextCatalog.getString('Bounty Tracker')
                        },
                        {
                            hash: "1141011754",
                            label: gettextCatalog.getString('Cryptarch')
                        },
                        {
                            hash: "941581325",
                            label: gettextCatalog.getString('Xûr, Agent of the Nine')
                        },
                    ]
                },
                {
                    label: gettextCatalog.getString('Miscellaneous'),
                    sources: [
                        {
                            hash: "831813627",
                            label: gettextCatalog.getString('Character Creation')
                        },
                        {
                            hash: "1011133026",
                            label: gettextCatalog.getString('Exotic Weapon Bounty')
                        },
                        {
                            hash: "846654930",
                            label: gettextCatalog.getString('Public Events')
                        },
                        {
                            hash: "541934873",
                            label: gettextCatalog.getString('Various Sources')
                        },
                        {
                            hash: "1391763834",
                            label: gettextCatalog.getString('Evolved From Another Item')
                        },
                        {
                            hash: "1920307024",
                            label: gettextCatalog.getString('Quest')
                        },
                    ]
                },
            ]
        };
    }
]);
