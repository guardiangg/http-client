let loc: any = window.location as any;
let match;

if (loc.search.match(/[?&]/)) {
    window.location.href = loc.pathname + loc.search.replace(/[?&]+/g, ';');
}

if (loc.protocol == 'http:' && document.cookie.match(/authenticated=1/)) {
    window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

import "core-js";
import "zone.js/dist/zone";
