var app = angular.module('app');

app.factory('auditFactory', [
    function () {
        var auditFactory = function(scope) {
            var self = this;
            this.scope = scope;
            this.character = false;
            this.definitions = false;
            this.loadout = false;
            this.result = {
                BAD: 0,
                NEUTRAL: 1,
                GOOD: 2
            };

            this.setCharacter = function(character) {
                this.character = character;
                this.loadout = {};
                this.audit();
                return this;
            };

            this.setDefinitions = function(definitions) {
                this.definitions = definitions;
                this.audit();
                return this;
            };

            this.setLoadout = function(loadout) {
                this.loadout = loadout;
                this.audit();
                return this;
            };

            this.audit = function() {
                if (!this.character || !this.definitions || !this.loadout) {
                    return;
                }

                this.scope.audit = {};

                auditSubclass();
                return this;
            };

            var auditSubclass = function() {
                var subclass = _.find(self.loadout, function(item) {
                    return item.bucketHash == 3284755031;
                });

                if (!subclass) {
                    return;
                }

                var subclassAudit = {
                    3847058278: { // bladedancer
                        synergy: function(nodes) {

                        },
                        nodes: {
                            1: {
                                0: {

                                },
                                1: {
                                    result: self.result.BAD
                                },
                                2: {

                                }
                            }
                        }
                    }
                };



                console.log(subclass);
                console.log(self.character);
                console.log(self.loadout);
                console.log(self.definitions);
            };
        };

        return auditFactory;
    }
]);
