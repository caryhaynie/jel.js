var events = require("events");
var fs = require("fs");
var path = require("path");
var stream = require("stream");
var util = require("util");

var parseFile = function(src, cb) {
    var jm = Object.create(JelMachine.prototype);
    JelMachine.apply(jm);
    cb(null, jm);
};

var parseStream = function(src, cb) {
    var jm = Object.create(JelMachine.prototype);
    JelMachine.apply(jm);
    cb(null, jm);
};

var parse = function(src, cb) {
    if (src instanceof stream.Stream) {
        parseStream(src, cb);
    } else {
        path.exists(src, function(exists) {
            if (exists) {
                parseFile(src, cb);
            } else {
                cb("invalid filename", null);
            }
        });
    }
};

function JelMachine() {};

JelMachine.prototype = Object.create(events.EventEmitter.prototype, { constructor: JelMachine });

exports.parse = module.exports.parse = parse;
exports.JelMachine = module.exports.JelMachine = JelMachine;
