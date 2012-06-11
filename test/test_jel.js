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
        it("should take a stream object and read the jel data from the stream", function(done) {
            jel.parse(fs.createReadStream("test/test_machine.jel"), function(err, jm) {
                expect(err).to.not.be.ok();
                expect(jm).to.be.ok();
                done();
            });
        });
        it("should return a JelMachine object on success", function(done) {
            jel.parse("test/test_machine.jel", function(err, jm) {
                expect(err).to.not.be.ok();
                expect(jm).to.be.ok();
                expect(jm).to.be.a(jel.JelMachine);
                done();
            });
        });
        it("should return an error if the supplied filename can't be found", function(done) {
            jel.parse("test/not_found.jel", function(err, jm) {
                expect(err).to.be.ok();
                expect(jm).to.not.be.ok();
                expect(err).to.eql("invalid filename");
                done();
            });
        });
    });
});
