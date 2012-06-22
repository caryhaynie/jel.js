var expect = require("expect.js");
var fs = require("fs");
var util = require("util");

var jel = require("../");

describe("jel", function() {
    describe("#parse()", function() {
        it("should take a filename for a local jel file", function(done) {
            jel.parse("test/test_machine.jel", function(err, jm) {
                expect(err).to.not.be.ok();
                expect(jm).to.be.ok();
                done();
            });
        });
        it("should return a JelModule object on success", function(done) {
            jel.parse("test/test_machine.jel", function(err, jm) {
                expect(err).to.not.be.ok();
                expect(jm).to.be.ok();
                expect(jm).to.be.a(jel.JelModule);
                done();
            });
        });
        it("should return an error if the supplied filename can't be found", function(done) {
            jel.parse("test/not_found.jel", function(err, jm) {
                expect(err).to.be.an(Error);
                expect(jm).to.not.be.ok();
                done();
            });
        });
    });
    describe("JelModule", function() {
        var module = null;
        before(function(done) {
            jel.parse("test/test_machine.jel", function(err, jm) {
                module = jm;
                done();
            });
        });
        describe("#getMachine()", function() {
            it("should return a valid JelMachine for an existing name", function() {
                var m = module.getMachine("machine1");
                expect(m).to.be.a(jel.JelMachine);
            });
            it("should return undefined for an non-existing name", function() {
                var m = module.getMachine("not-found");
                expect(m).to.be(undefined);
            });
        });
    });
    describe("JelMachine", function() {
        var machine = null;
        var true_machine = null;
        var if_machine = null;
        var and_machine = null;
        var or_machine = null;
        before(function(done) {
            jel.parse("test/test_machine.jel", function(err, jm) {
                machine = jm.getMachine("machine1");
                true_machine = jm.getMachine("true_machine");
                if_machine = jm.getMachine("if_test");
                and_machine = jm.getMachine("and_test");
                or_machine = jm.getMachine("or_test");
                expect(machine).to.be.ok();
                expect(true_machine).to.be.ok();
                expect(if_machine).to.be.ok();
                expect(and_machine).to.be.ok();
                expect(or_machine).to.be.ok()
                done();
            });
        });
        describe("#evaluate()", function() {
            it("should require a JelState parameter", function() {
                expect((function() { true_machine.evaluate(null); })).to.throwError();
                var state = new jel.JelState();
                expect((function() { true_machine.evaluate(state); })).to.not.throwError();
            });
            it("should correctly evaluate the expression tree, and return the result", function() {
                var state = new jel.JelState();
                var result = machine.evaluate(state);
                var result2 = if_machine.evaluate(state);
                var result3 = and_machine.evaluate(state);
                var result4 = or_machine.evaluate(state);
                expect(result).to.eql(true);
                expect(result2).to.be(undefined);
                expect(result3).to.be(false);
                expect(result4).to.be(undefined);
            });
        });
    });
});
