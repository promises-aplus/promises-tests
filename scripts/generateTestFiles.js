"use strict";
let fs = require("fs");
let path = require("path");

let testsDir = path.resolve(__dirname, "../lib/tests");
let testDirFiles = fs.readdirSync(testsDir);

let outFile = fs.createWriteStream(path.resolve(__dirname, "../lib/testFiles.js"), { encoding: "utf-8" });

outFile.write("\"use strict\";\n");

testDirFiles.forEach(function (file) {
    if (path.extname(file) !== ".js") {
        return;
    }

    outFile.write("require(\"./");
    outFile.write("tests/" + path.basename(file, ".js"));
    outFile.write("\");\n");
});

outFile.end(function (err) {
    if (err) {
        throw err;
    }
});
