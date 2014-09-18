"use strict";
var fs = require("fs");
var path = require('path');


var dir = path.resolve(__dirname,"../lib/tests");
fs.readdir(dir, function (err, resp) {
  if (err) {
    process.exit(1);
  }
  var outfile = fs.createWriteStream(path.resolve(__dirname, "../lib/testFiles.js"));
  
  resp.forEach(function (file) {
    if (path.extname(file) !== ".js") {
      return;
    }
    outfile.write("require(\"./");
    outfile.write(path.join("tests", path.basename(file, ".js")));
    outfile.write("\");\n");
  });
  outfile.end(function (err) {
    if (err) {
      process.exit(2);
    }
    process.exit(0);
  });
});