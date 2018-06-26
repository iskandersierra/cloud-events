/**!
 * cloud-events - lib/index.js
 * Copyright(c) 2018
 * MIT Licensed
 * 
 * Authors:
 *      iskandersierra <iskander.sierra@gmail.com> (https://github.com/iskandersierra)
 * 
 * Implementation of:
 * HTTP Transport Binding for CloudEvents - Version 0.1
 * https://github.com/cloudevents/spec/blob/master/http-transport-binding.md#http-transport-binding-for-cloudevents---version-01
 */

'use strict';

/**
 * Dependencies
 */
const joi = require("joi");

/* https://github.com/cloudevents/spec/blob/master/spec.md#type-system */
const ceString = joi.string();
const ceBinary = joi.binary();
const ceMap = joi.object().unknown();
const ceObject = joi.alternatives(ceString, ceBinary, ceMap);
const ceUri = joi.string();
const ceTimestamp = joi.string().isoDate();

/* https://github.com/cloudevents/spec/blob/master/spec.md#context-attributes */
const ceEventType = ceString.min(1).required();
const ceEventTypeVersion = ceString.min(1).optional();
const ceCloudEventsVersion = ceString.min(1).required(); // "0.1" ?
const ceSource = ceUri.required();
const ceEventID = ceString.min(1).required();
const ceEventTime = ceTimestamp.optional();
const ceSchemaURL = ceUri.optional();
const ceContentType = ceString.optional();
const ceExtensions = ceMap.optional().min(1);
const ceData = ceObject.optional();

const ceCloudEvent = joi
    .object()
    .keys({
        cloudEventsVersion: ceCloudEventsVersion,
        eventType: ceEventType,
        eventTypeVersion: ceEventTypeVersion,
        source: ceSource,
        schemaURL: ceSchemaURL,
        eventID: ceEventID,
        eventTime: ceEventTime,
        extensions: ceExtensions,
        contentType: ceContentType,
        data: ceData,
    })
    .unknown(false);

const isCloudEvent = (event) => {
    return !joi.validate(event, ceCloudEvent).error;
};

const CloudEventHeaderPrefix = 'CE-';
const CloudEventExtensionHeaderPrefix = 'CE-X-';

const camelCase = (/** @type {string} */str) => 
    str.replace(
        /(?:^\w|[A-Z]|\b\w)/g, 
        (letter, index) => index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    );

const parseEventHelper = (ctx) => {
    // const data = ctx.request.body; // could be missing and it's ok
    const event = {};

    let extensions = undefined;

    Object.keys(ctx.request.headers).forEach(key => {
        const upperKey = key.toUpperCase();
        if (upperKey.startsWith(CloudEventExtensionHeaderPrefix)) {
            if (!extensions) { extensions = {}; }
            const extensionName = camelCase(
                key.substring(CloudEventExtensionHeaderPrefix.length));
            extensions[extensionName] = ctx.request.headers[key];
        } else if (upperKey.startsWith(CloudEventHeaderPrefix)) {
            const propertyName = camelCase(
                key.substring(CloudEventHeaderPrefix.length));
            event[propertyName] = ctx.request.headers[key];
        } else if (upperKey === "CONTENT-TYPE") {
            event["contentType"] = ctx.request.headers[key];
        }
    });

    if (extensions) {
        event.extensions = extensions;
    }

    if (ctx.request.body !== undefined) {
        event.data = ctx.request.body;
    }

};

module.exports.isCloudEvent = isCloudEvent;
module.exports.parseEventHelper = parseEventHelper;
