"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (str) {
    var hash = 0,
        i,
        chr,
        len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

; // NON-SECURE DERPY HASH FUNCTION
// THIS IS NOT FOR CRYPTO. JUST HERE TO MAKE IT SLIGHTLY HARDER TO CHEAT