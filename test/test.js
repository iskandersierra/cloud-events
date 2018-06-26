'use strict';

const should = require("should");
const except = require("except");

const { 
    isCloudEvent, 
    parseEventHelper
} = require("..");

const sample = {
    "cloudEventsVersion" : "0.1",
    "eventType" : "com.example.someevent",
    "eventTypeVersion" : "1.0",
    "source" : "/mycontext",
    "eventID" : "A234-1234-1234",
    "eventTime" : "2018-04-05T17:31:00Z",
    "schemaURL" : "/someevent-schema",
    "extensions" : {
        "comExampleExtension" : "value"
    },
    "contentType" : "text/xml",
    "data" : "<much wow=\"xml\"/>"
};

const sampleWith = (key, value) => Object.assign({}, sample, { [key]: value });

const sampleWithout = (key) => except(sample, key);

describe('isCloudEvent', () => {
    it('An empty object should not be valid', () => 
        isCloudEvent({}).should.be.false());
    
    it('Sample Cloud Event should be valid', () => 
        isCloudEvent(sample).should.be.true());

    describe('eventType constraints', () => {
        it('Type: String', () => isCloudEvent(
            sampleWith("eventType", ["com.example.someevent"]))
            .should.be.false());
        
        it('REQUIRED', () => isCloudEvent(
            sampleWithout("eventType"))
            .should.be.false());

        it('MUST be a non-empty string', () => isCloudEvent(
            sampleWith("eventType", ""))
            .should.be.false());
    });

    describe('eventTypeVersion constraints', () => {
        it('Type: String', () => isCloudEvent(
            sampleWith("eventTypeVersion", ["1.0"]))
            .should.be.false());
        
        it('OPTIONAL', () => isCloudEvent(
            sampleWithout("eventTypeVersion"))
            .should.be.true());

        it('If present, MUST be a non-empty string', () => isCloudEvent(
            sampleWith("eventTypeVersion", ""))
            .should.be.false());
    });

    describe('source constraints', () => {
        it('Type: URI', () => isCloudEvent(
            sampleWith("source", ["/mycontext"]))
            .should.be.false());
        
        it('REQUIRED', () => isCloudEvent(
            sampleWithout("source"))
            .should.be.false());
    });

    describe('eventID constraints', () => {
        it('Type: URI', () => isCloudEvent(
            sampleWith("eventID", ["A234-1234-1234"]))
            .should.be.false());
        
        it('REQUIRED', () => isCloudEvent(
            sampleWithout("eventID"))
            .should.be.false());
        
        it('MUST be a non-empty string', () => isCloudEvent(
            sampleWith("eventID", ""))
            .should.be.false());
    });

    describe('eventTime constraints', () => {
        it('Type: Timestamp', () => isCloudEvent(
            sampleWith("eventTime", ["2018-04-05T17:31:00Z"]))
            .should.be.false());
        
        it('OPTIONAL', () => isCloudEvent(
            sampleWithout("eventTime"))
            .should.be.true());
        
        it('If present, MUST adhere to the format specified in RFC 3339', () => isCloudEvent(
            sampleWith("eventTime", "Today"))
            .should.be.false());
    });

    describe('schemaURL constraints', () => {
        it('Type: URI', () => isCloudEvent(
            sampleWith("schemaURL", ["/someevent-schema"]))
            .should.be.false());
        
        it('OPTIONAL', () => isCloudEvent(
            sampleWithout("schemaURL"))
            .should.be.true());
    });

    describe('contentType constraints', () => {
        it('Type: String per RFC 2046', () => isCloudEvent(
            sampleWith("contentType", ["text/xml"]))
            .should.be.false());
        
        it('OPTIONAL', () => isCloudEvent(
            sampleWithout("contentType"))
            .should.be.true());
    });

    describe('extensions constraints', () => {
        it('Type: Map', () => isCloudEvent(
            sampleWith("extensions", ["Hello"]))
            .should.be.false());
        
        it('OPTIONAL', () => isCloudEvent(
            sampleWithout("extensions"))
            .should.be.true());

        it('If present, MUST contain at least one entry', () => isCloudEvent(
            sampleWith("extensions", {}))
            .should.be.false());
    });

    describe('data constraints', () => {
        it('Type: Object (string)', () => isCloudEvent(
            sampleWith("data", "Hello"))
            .should.be.true());
        
        it('Type: Object (binary)', () => isCloudEvent(
            sampleWith("data", new ArrayBuffer(16)))
            .should.be.true());
        
        it('Type: Object (Map)', () => isCloudEvent(
            sampleWith("data", {name: "John", surname: "Doe"}))
            .should.be.true());
        
        it('OPTIONAL', () => isCloudEvent(
            sampleWithout("data"))
            .should.be.true());
    });

});
