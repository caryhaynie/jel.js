var expect = require("expect.js");
var fs = require("fs");

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
        before(function(done) {
            jel.parse("test/test_machine.jel", function(err, jm) {
                machine = jm.getMachine("machine1");
                done();
            });
        });
        describe("#evaluate()", function() {
            it("it should require a JelState parameter", function() {
                expect((function() { machine.evaluate(null); })).to.throwError();
                var state = new jel.JelState();
                expect((function() { machine.evaluate(state); })).to.not.throwError();
            });
        });
    });
});
