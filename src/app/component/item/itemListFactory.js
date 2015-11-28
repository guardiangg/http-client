var app = angular.module('app');

app.factory('itemListFactory', [
    '$state',
    '$location',
    'gamedata',
    'consts',

    function ($state, $location, gamedata, consts) {
        return function () {
            var self = this;

            this.errors = [];
            this.page = 0;
            this.perPage = 25;

            this.data = [];
            this.filteredData = [];
            this.columns = [];
            this.categories = [];
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
                }
            };

            var observerCallbacks = [];

            this.registerObserverCallback = function(callback) {
                observerCallbacks.push(callback);
            };

            this.notifyObservers = function() {
                _.each(observerCallbacks, function(callback) {
                    callback();
                })
            };

            var types = {
                primary: null,
                secondary: null,
                tertiary: null
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
                    options.secondary = value;
                    options.tertiary = null;
                } else {
                    options.tertiary = value;
                }

                var href = $state.href('app.itemList', options);
                $location.url(href);
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
                var offset = p * this.perPage;
                var limit = offset + this.perPage;
                this.filteredData = this.data.slice(offset, limit);
                notifyObservers();
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
                        self.data = data.data;
                        var statColumns = consts.item_list_types[self.listType];

                        // Re-map the stats so the object key is the stat hash, this makes it easier to display the
                        // appropriate stat under the stat column, which is not in the same order as the item stat array
                        _.each(self.data, function(item) {
                            item._stats = {};

                            _.each(item.stats, function(stat) {
                                var exists = _.find(self.columns, function(e) {
                                    return e.hash == stat.hash;
                                });

                                // If the stat exists in the list view template, add the column
                                if (!exists && _.contains(statColumns, stat.hash)) {
                                    self.columns.push(stat);
                                }

                                item._stats[stat.hash] = stat;
                            });
                        });

                        // Give the client some guidance on the intended order of the stat columns
                        _.each(statColumns, function(col, idx) {
                            var exists = _.find(self.columns, function(e) {
                                return e.hash == col;
                            });

                            if (exists) {
                                exists.index = idx;
                            }
                        });

                        self.page = 0;
                        self.filteredData = self.data.slice(0, self.perPage);
                        self.columns = _.sortBy(self.columns, 'index');
                        self.notifyObservers();
                    });
            }
        };
    }
]);
