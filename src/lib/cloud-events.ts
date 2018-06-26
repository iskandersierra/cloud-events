import * as joi from 'joi';

export interface CloudEvent {
  readonly eventType: string;
  readonly eventTypeVersion?: string;
  readonly cloudEventsVersion: string;
  readonly source: string;
  readonly eventID: string;
  readonly eventTime?: string;
  readonly schemaURL?: string;
  readonly contentType?: string;
  readonly extensions?: { readonly [key: string]: string };
  readonly data?: any;
}

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

export const cloudEventSchema = joi
  .object()
  .keys({
    cloudEventsVersion: ceCloudEventsVersion,
    contentType: ceContentType,
    data: ceData,
    eventID: ceEventID,
    eventTime: ceEventTime,
    eventType: ceEventType,
    eventTypeVersion: ceEventTypeVersion,
    extensions: ceExtensions,
    schemaURL: ceSchemaURL,
    source: ceSource
  })
  .unknown(false);

export const isCloudEvent = (event: CloudEvent) => {
  return !joi.validate(event, cloudEventSchema).error;
};

export const explainCloudEvent = (event: CloudEvent) => {
  const error = joi.validate(event, cloudEventSchema).error;
  return error ? error.annotate() : false;
};

export const validateCloudEvent = (event: CloudEvent) => {
  return new Promise<CloudEvent>((resolve, reject) => {
    joi
      .validate(event, cloudEventSchema)
      .then(resolve)
      .catch(reject);
  });
};
