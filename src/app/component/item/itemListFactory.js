var app = angular.module('app');

app.factory('itemListFactory', [
    '$state',
    '$location',
    'gamedata',
    'util',
    'consts',

    function ($state, $location, gamedata, util, consts) {
        return function () {
            var self = this,
                observerCallbacks = [],
                types = {
                    primary: null,
                    secondary: null,
                    tertiary: null
                };

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
                name: null
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

                var href = $state.href('app.itemList', options);
                $location.url(href);
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
                tier: {
                    key: 't',
                    filter: function(value) {
                        var tiers = value.split(':');
                        var data = [];

                        _.each(self.filteredData, function(i) {
                            if (i.tier.indexOf(value.toLowerCase()) > -1) {
                                data.push(i);
                            }
                        });

                        self.filteredData = data;
                        self.filters.name = value;

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
                            if (i.rewardSources && (i.rewardSources.indexOf(parseInt(value)) > -1 || i.rewardSources.indexOf(value) > -1)) {
                                data.push(i);
                            }
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

                _.each(csFiltersActive, function(filter, type) {
                    $location.search(csFilters[type].key, null);
                    self.filters[type] = null;
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
                    self.filters[type] = null;
                    delete csFiltersActive[type];

                    self.filterData();
                }
            };

            /**
             * Filters the set of items by the 'name' column, always use debounce of at least 500 when accepting
             * text inputs that call this function on ng-change.
             * @param {string} value
             */
            this.filterByName = function(value) {
                self.page = 0;
                $location.search('p', null);

                if (!value) {
                    $location.search(csFilters.name.key, null);
                    delete csFiltersActive.name;
                } else {
                    $location.search(csFilters.name.key, value);
                    csFiltersActive.name = csFilters.name.filter;
                }

                self.filterData();
            };

            /**
             * Filters the set of items by a source type, expects the reward source hash
             * @param {string} value
             */
            this.filterBySource = function(value) {
                self.page = 0;
                $location.search('p', null);

                if (!value) {
                    $location.search(csFilters.source.key, null);
                    delete csFiltersActive.source;
                } else {
                    $location.search(csFilters.source.key, value);
                    csFiltersActive.source = csFilters.source.filter;
                }

                self.filterData();
            };

            /**
             * Filters the set of items by the class id
             * @param {string} value
             */
            this.filterByClass = function(value) {
                self.page = 0;
                $location.search('p', null);

                if (!value) {
                    $location.search(csFilters.class.key, null);
                    delete csFiltersActive.class;
                } else {
                    $location.search(csFilters.class.key, value);
                    csFiltersActive.class = csFilters.class.filter;
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

                        // Sort alpha columns
                        } else {
                            return self.sortDirection == 'asc' ? value.charCodeAt() : value.charCodeAt() * -1;
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
                            item._sources = [];

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

                            // Remove reward sources that don't exist
                            _.each(item.rewardSources, function(source, i) {
                                var source = gamedata.getRewardSourceByHash(source);
                                if (source) {
                                    item._sources.push(source);
                                }
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

                        self.filterData();
                        self.statColumns = _.sortBy(self.statColumns, 'index');
                        self.notifyObservers();
                    });
            }
        };
    }
]);
