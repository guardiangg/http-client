app.filter('medals', function() {
    return function(obj) {
        var medals = [];
        _.each(obj, function(o, k) {
            if (k.substr(0, 6) !== 'medals') {
                return;
            }

            o.medal = k;
            medals.push(o);
        });

        medals.sort(function(a, b) {
            if (a.weighted.value < b.weighted.value) return 1;
            if (a.weighted.value > b.weighted.value) return -1;
            return 0;
        });

        return medals;
    };
});

app.filter('noMedals', function() {
    return function(obj) {
        var medals = [];
        _.each(obj, function(o, k) {
            if (k.substr(0, 6) !== 'medals') {
                return;
            }

            o.medal = k;
            medals.push(o);
        });

        return medals.length == 0;
    };
});
