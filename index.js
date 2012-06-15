var events = require("events");
var fs = require("fs");
var util = require("util");


// JelModule represents a group of machines.
function JelModule(tree) {
    var self = this;

    Object.defineProperty(this, "_srcTree", { enumerable: false, value: tree });
    Object.defineProperty(this, "_machines", { enumerable: false, value: {} });

    Object.keys(this._srcTree.machines).forEach(function(elem, idx, arr) {
        self._machines[elem] = Object.create(JelMachine.prototype, {});
        JelMachine.prototype.constructor.apply(self._machines[elem], self._srcTree[elem]);
    }, null);
};

JelModule.prototype = Object.create(events.EventEmitter.prototype, { constructor: { value: JelModule } });

JelModule.prototype.getMachine = function(name) {
    return this._machines[name];
};

// JelMachine represents an expression tree.
function JelMachine(tree) {
    Object.defineProperty(this, "_srcTree", { enumerable: false, value: tree });
};

JelMachine.prototype = Object.create(events.EventEmitter.prototype, { constructor: { value: JelMachine } });

JelMachine.prototype.evaluate = function(state) {
};

// JelParser parses a JSON file to create a JelMachine object.
function JelParser() {};

JelParser.prototype = Object.create(events.EventEmitter.prototype, { constructor: { value: JelParser } });

JelParser.prototype.parseFile = function(src, cb) {
    fs.readFile(src, function(err, data) {
        if (err) {
            cb(err, null);
        } else {
            var jm = new JelModule(JSON.parse(data));
            cb(null, jm);
        }
    });
};

// JelState represents an "instance" of a JelMachine. JelMachines store no state
// internally, so multiple JelStates can share the same machine without conflicts.
// It also makes it easy to serialize the state without having to reserialize /
// parse the entire tree each time.
function JelState() {
    this.locals = {};
};

JelState.prototype = Object.create(events.EventEmitter.prototype, { constructor: { value: JelState } });

JelState.prototype.getLocal = function(name) { return this.locals[name]; };

JelState.prototype.setLocal = function(name, value) { this.locals[name] = value; };

var parse = function(src, cb) {
    var parser = Object.create(JelParser.prototype);
    JelParser.prototype.constructor.apply(parser);
    parser.parseFile(src, cb);
};


exports.parse = module.exports.parse = parse;
exports.JelMachine = module.exports.JelMachine = JelMachine;
exports.JelModule = module.exports.JelModule = JelModule;
exports.JelParser = module.exports.JelParser = JelParser;
exports.JelParser = module.exports.JelState = JelParser;

