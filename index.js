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
        JelMachine.prototype.constructor.call(self._machines[elem], self._srcTree.machines[elem]);
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

JelMachine.prototype.getRootExpression = function() { return this._srcTree; };

JelMachine.prototype.evaluate = function(state) {
    if (!(Object.getPrototypeOf(state) == JelState.prototype)) { throw Error("parameter must be a JelState"); }
    return this.evalExpression(state, this.getRootExpression());
};

JelMachine.prototype.evalExpression = function(state, exprObj) {
    switch (exprObj.type) {
        case "js":
            return eval(exprObj.script);
            break;
        case "if":
            if (this.evalExpression(state, exprObj.test)) {
                if (exprObj.block != undefined) {
                    return this.evalExpression(state, exprObj.block);
                }
            }
            break;
        case "and":
            if (this.evalExpression(state, exprObj.lhs) && this.evalExpression(state, exprObj.rhs)) {
                if (exprObj.block != undefined) {
                    return this.evalExpression(state, exprObj.block);
                }
            } else {
                return false;
            }
        case "or":
            if (this.evalExpression(state, exprObj.lhs) || this.evalExpression(state, exprObj.lhs)) {
                if (exprObj.block != undefined) {
                    return this.evalExpression(state, exprObj.block);
                }
            } else {
                return false;
            }
        case "true":
            return true;
        case "false":
            return false;
        case "get":
            return state.getLocal(exprObj.name);
        case "set":
            var value = this.evalExpression(state, exprObj.block);
            state.setLocal(exprObj.name) = value;
            return undefined;
        case "emit":
            state.emit(exprObj.name, exprObj.block);
            return undefined;
        case "stmt_list":
            exprObj.list.forEach(function(expr, idx, arr) {
                this.evalExpression(state, expr);
            }, null);
            return undefined;
        default:
            throw Error("unknown expression type");
            break;
    }
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
exports.JelState = module.exports.JelState = JelState;

