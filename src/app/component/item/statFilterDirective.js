var app = angular.module('app');

app.directive('statFilter', [
    '$timeout',

    function($timeout) {
        return {
            restrict: 'E',
            scope: {
                stats: '=',
                callback: '=',
                filter: '='
            },

            link: function(scope, element) {
                var stats = [];
                var filters = {};

                var addSelect = function(defaultHash, defaultOp, defaultValue) {
                    var childSpawned = false;
                    var selectedHash = defaultHash;
                    var selectedOp = defaultOp;

                    var wrapper = angular.element('<div class="stat-filter"></div>');

                    var select = angular.element('<select class="form-control stat-type"></select>');
                    var operator = angular.element(
                        '<select class="form-control stat-operator">' +
                            '<option value="gt">></option>' +
                            '<option value="gte">>=</option>' +
                            '<option value="e">=</option>' +
                            '<option value="lte"><=</option>' +
                            '<option value="lt"><</option>' +
                        '</select>'
                    );
                    var value = angular.element('<input class="form-control stat-value" type="number" />');
                    var reset = angular.element('<span class="reset hidden-xs"><i class="fa fa-close"></i></span>');

                    select.append(angular.element('<option value=""></option>'));

                    _.each(stats, function(stat) {
                        select.append(angular.element('<option value="' + stat.hash + '">' + stat.name + '</option>'));
                    });

                    var destroy = function() {
                        if (filters[selectedHash] && typeof filters[selectedHash][selectedOp] !== 'undefined') {
                            delete filters[selectedHash][selectedOp];
                        }

                        if (filters[selectedHash] && Object.keys(filters[selectedHash]).length == 0) {
                            delete filters[selectedHash];
                        }

                        select.remove();
                        operator.remove();
                        value.remove();
                        reset.remove();
                        wrapper.remove();

                        selectedHash = false;
                        selectedOp = false;

                        scope.callback(filters);
                    };

                    select.bind('change', function(e) {
                        value.val('');
                        operator.val('gt');

                        if (filters[selectedHash] && filters[selectedHash][selectedOp]) {
                            delete filters[selectedHash][selectedOp];
                        }

                        if (filters[selectedHash] && Object.keys(filters[selectedHash]).length == 0) {
                            delete filters[selectedHash];
                        }

                        if ($(this).val().length > 0) {
                            selectedHash = $(this).val();
                            selectedOp = operator.val();

                            operator.show();
                            value.show();
                            reset.show();

                            if (!childSpawned) {
                                addSelect();
                                childSpawned = true;
                            }

                        } else {
                            destroy();
                        }
                    });

                    operator.bind('change', function(e) {
                        if (filters[selectedHash] && filters[selectedHash][selectedOp]) {
                            delete filters[selectedHash][selectedOp];
                        }

                        if (!filters[selectedHash]) {
                            filters[selectedHash] = {};
                        }

                        selectedOp = $(this).val();
                        filters[selectedHash][selectedOp] = value.val();

                        scope.callback(filters);
                    });

                    var debounce;
                    value.bind('keyup input', function(e) {
                        var t = $(this);

                        debounce && $timeout.cancel(debounce);
                        debounce = $timeout(function() {
                            var value = t.val();
                            var op = operator.val();
                            var hash = select.val();

                            if (filters[hash] && filters[hash][op] && !value) {
                                delete filters[hash][op];
                            }

                            if (!filters[hash] && value) {
                                filters[hash] = {};
                            }

                            if (value) {
                                filters[hash][op] = value;
                            }

                            if (Object.keys(filters[hash]).length == 0) {
                                delete filters[hash];
                            }

                            scope.callback(filters);
                        }, 500);
                    });

                    if (defaultHash && defaultOp) {
                        filters[defaultHash] = {};
                        filters[defaultHash][defaultOp] = defaultValue;
                        select.val(defaultHash);
                        operator.val(defaultOp);
                        value.val(parseInt(defaultValue));

                        scope.callback(filters);
                    }

                    reset.bind('click', destroy);

                    !defaultOp && operator.hide();
                    !defaultValue && value.hide();
                    !defaultValue && reset.hide();

                    wrapper.append(select);
                    wrapper.append(operator);
                    wrapper.append(value);
                    wrapper.append(reset);

                    element.append(wrapper);
                };

                var init = function() {
                    stats = angular.copy(scope.stats);
                    stats = _.sortBy(stats, 'name');
                    filters = {};
                    element.html('');

                    if (Object.keys(scope.filter).length > 0) {
                        _.each(scope.filter, function(ops, hash) {
                            _.each(ops, function(value, op) {
                                addSelect(hash, op, value);
                            });
                        });
                    }

                    addSelect();
                };

                scope.$watch('stats', function(stats) {
                    stats && init();
                });

                scope.$watch('filter', function(newValue, oldValue) {
                    if (Object.keys(newValue).length == 0 && Object.keys(oldValue).length > 0) {
                        init();
                    }
                });
            }
        };
    }
]);
