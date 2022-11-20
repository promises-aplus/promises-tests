"use strict";

module.exports = function getMochaOpts(args) {
    let rawOpts = args;
    let opts = {};

    rawOpts.join(" ").split("--").forEach(function (opt) {
        let optSplit = opt.split(" ");

        let key = optSplit[0];
        let value = optSplit[1] || true;

        if (key) {
            opts[key] = value;
        }
    });

    return opts;
};
