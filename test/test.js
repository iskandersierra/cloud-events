'use strict';

const should = require("should");

const { 
    isCloudEvent, 
    parseEventHelper
} = require("..");

describe('isCloudEvent', () => {
    it('An empty object should not be valid', () => 
        isCloudEvent({}).should.be.false());
    
    it('Sample Cloud Event should be valid', () => isCloudEvent({
        "cloudEventsVersion" : "0.1",
        "eventType" : "com.example.someevent",
        "eventTypeVersion" : "1.0",
        "source" : "/mycontext",
        "eventID" : "A234-1234-1234",
        "eventTime" : "2018-04-05T17:31:00Z",
        "extensions" : {
            "comExampleExtension" : "value"
        },
        "contentType" : "text/xml",
        "data" : "<much wow=\"xml\"/>"
    }).should.be.true());

    describe('eventType constraints', () => {
        it('Type: String', () => isCloudEvent({
            "cloudEventsVersion" : "0.1",
            "eventType" : ["com.example.someevent"],
            "eventTypeVersion" : "1.0",
            "source" : "/mycontext",
            "eventID" : "A234-1234-1234",
            "eventTime" : "2018-04-05T17:31:00Z",
            "extensions" : {
                "comExampleExtension" : "value"
            },
            "contentType" : "text/xml",
            "data" : "<much wow=\"xml\"/>"
        }).should.be.false());
        
        it('REQUIRED', () => isCloudEvent({
            "cloudEventsVersion" : "0.1",
            // "eventType" : "com.example.someevent",
            "eventTypeVersion" : "1.0",
            "source" : "/mycontext",
            "eventID" : "A234-1234-1234",
            "eventTime" : "2018-04-05T17:31:00Z",
            "extensions" : {
                "comExampleExtension" : "value"
            },
            "contentType" : "text/xml",
            "data" : "<much wow=\"xml\"/>"
        }).should.be.false());

        it('MUST be a non-empty string', () => isCloudEvent({
            "cloudEventsVersion" : "0.1",
            "eventType" : "",
            "eventTypeVersion" : "1.0",
            "source" : "/mycontext",
            "eventID" : "A234-1234-1234",
            "eventTime" : "2018-04-05T17:31:00Z",
            "extensions" : {
                "comExampleExtension" : "value"
            },
            "contentType" : "text/xml",
            "data" : "<much wow=\"xml\"/>"
        }).should.be.false());
    });

    describe('eventTypeVersion constraints', () => {
        it('Type: String', () => isCloudEvent({
            "cloudEventsVersion" : "0.1",
            "eventType" : "com.example.someevent",
            "eventTypeVersion" : ["1.0"],
            "source" : "/mycontext",
            "eventID" : "A234-1234-1234",
            "eventTime" : "2018-04-05T17:31:00Z",
            "extensions" : {
                "comExampleExtension" : "value"
            },
            "contentType" : "text/xml",
            "data" : "<much wow=\"xml\"/>"
        }).should.be.false());
        
        it('OPTIONAL', () => isCloudEvent({
            "cloudEventsVersion" : "0.1",
            "eventType" : "com.example.someevent",
            // "eventTypeVersion" : "1.0",
            "source" : "/mycontext",
            "eventID" : "A234-1234-1234",
            "eventTime" : "2018-04-05T17:31:00Z",
            "extensions" : {
                "comExampleExtension" : "value"
            },
            "contentType" : "text/xml",
            "data" : "<much wow=\"xml\"/>"
        }).should.be.true());

        it('If present, MUST be a non-empty string', () => isCloudEvent({
            "cloudEventsVersion" : "0.1",
            "eventType" : "com.example.someevent",
            "eventTypeVersion" : "",
            "source" : "/mycontext",
            "eventID" : "A234-1234-1234",
            "eventTime" : "2018-04-05T17:31:00Z",
            "extensions" : {
                "comExampleExtension" : "value"
            },
            "contentType" : "text/xml",
            "data" : "<much wow=\"xml\"/>"
        }).should.be.false());
    });

    describe('source constraints', () => {
        it('Type: URI', () => isCloudEvent({
            "cloudEventsVersion" : "0.1",
            "eventType" : "com.example.someevent",
            "eventTypeVersion" : "1.0",
            "source" : ["/mycontext"],
            "eventID" : "A234-1234-1234",
            "eventTime" : "2018-04-05T17:31:00Z",
            "extensions" : {
                "comExampleExtension" : "value"
            },
            "contentType" : "text/xml",
            "data" : "<much wow=\"xml\"/>"
        }).should.be.false());
        
        it('REQUIRED', () => isCloudEvent({
            "cloudEventsVersion" : "0.1",
            "eventType" : "com.example.someevent",
            "eventTypeVersion" : "1.0",
            // "source" : "/mycontext",
            "eventID" : "A234-1234-1234",
            "eventTime" : "2018-04-05T17:31:00Z",
            "extensions" : {
                "comExampleExtension" : "value"
            },
            "contentType" : "text/xml",
            "data" : "<much wow=\"xml\"/>"
        }).should.be.false());
    });

});
