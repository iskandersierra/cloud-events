import { test } from 'ava';
import except from 'except';
import {
  CloudEvent,
  explainCloudEvent,
  isCloudEvent,
  validateCloudEvent
} from './cloud-events';

const sample: CloudEvent = {
  cloudEventsVersion: '0.1',
  contentType: 'text/xml',
  data: '<much wow="xml"/>',
  eventID: 'A234-1234-1234',
  eventTime: '2018-04-05T17:31:00.000Z',
  eventType: 'com.example.someevent',
  eventTypeVersion: '1.0',
  extensions: {
    comExampleExtension: 'value'
  },
  schemaURL: '/someevent-schema',
  source: '/mycontext'
};

const sampleWith = (key: string, value: any) => ({ ...sample, [key]: value });

const sampleWithout = (key: string) => except(sample, key);

const constraintsDatasets: ReadonlyArray<any> = [
  {
    field: 'eventType',
    cases: [
      ['Type: String', sampleWith('eventType', [sample.eventType]), false],
      ['REQUIRED', sampleWithout('eventType'), false],
      ['MUST be a non-empty string', sampleWith('eventType', ''), false]
    ]
  },
  {
    field: 'eventTypeVersion',
    cases: [
      [
        'Type: String',
        sampleWith('eventTypeVersion', [sample.eventTypeVersion]),
        false
      ],
      ['OPTIONAL', sampleWithout('eventTypeVersion'), true],
      [
        'If present, MUST be a non-empty string',
        sampleWith('eventTypeVersion', ''),
        false
      ]
    ]
  },
  {
    field: 'source',
    cases: [
      ['Type: URI', sampleWith('source', [sample.source]), false],
      ['REQUIRED', sampleWithout('source'), false]
    ]
  },
  {
    field: 'eventID',
    cases: [
      ['Type: URI', sampleWith('eventID', [sample.eventID]), false],
      ['REQUIRED', sampleWithout('eventID'), false],
      ['MUST be a non-empty string', sampleWith('eventID', ''), false]
    ]
  },
  {
    field: 'eventTime',
    cases: [
      ['Type: Timestamp', sampleWith('eventTime', [sample.eventTime]), false],
      ['OPTIONAL', sampleWithout('eventTime'), true],
      [
        'If present, MUST adhere to the format specified in RFC 3339',
        sampleWith('eventTime', 'Today'),
        false
      ]
    ]
  },
  {
    field: 'schemaURL',
    cases: [
      ['Type: URI', sampleWith('schemaURL', [sample.schemaURL]), false],
      ['OPTIONAL', sampleWithout('schemaURL'), true]
    ]
  },
  {
    field: 'contentType',
    cases: [
      [
        'Type: String per RFC 2046',
        sampleWith('contentType', [sample.contentType]),
        false
      ],
      ['OPTIONAL', sampleWithout('contentType'), true]
    ]
  },
  {
    field: 'extensions',
    cases: [
      ['Type: Map', sampleWith('extensions', [sample.extensions]), false],
      ['OPTIONAL', sampleWithout('extensions'), true],
      [
        'If present, MUST contain at least one entry',
        sampleWith('extensions', {}),
        false
      ]
    ]
  },
  {
    field: 'data',
    cases: [
      ['Type: Object (string)', sampleWith('data', 'Hello'), true],
      ['Type: Object (binary)', sampleWith('data', new ArrayBuffer(16)), true],
      [
        'Type: Object (Map)',
        sampleWith('data', { name: 'John', surname: 'Doe' }),
        true
      ],
      ['OPTIONAL', sampleWithout('data'), true]
    ]
  }
];

test('isCloudEvent - An empty object should not be valid', t =>
  t.false(isCloudEvent({} as any)));

test('isCloudEvent - Sample Cloud Event should be valid', t =>
  t.true(isCloudEvent(sample)));

for (const group of constraintsDatasets) {
  for (const aCase of group.cases) {
    test(`isCloudEvent - ${group.field} - ${aCase[0]}`, t => {
      if (aCase[2]) {
        t.true(isCloudEvent(aCase[1]));
      } else {
        t.false(isCloudEvent(aCase[1]));
      }
    });
  }
}

for (const group of constraintsDatasets) {
  for (const aCase of group.cases) {
    test(`explainCloudEvent - ${group.field} - ${aCase[0]}`, t => {
      if (aCase[2]) {
        t.is(explainCloudEvent(aCase[1]), false);
      } else {
        t.is(typeof explainCloudEvent(aCase[1]), 'string');
      }
    });
  }
}

for (const group of constraintsDatasets) {
  for (const aCase of group.cases) {
    test(`validateCloudEvent - ${group.field} - ${aCase[0]}`, t => {
      if (aCase[2]) {
        return validateCloudEvent(aCase[1])
          .then(e => t.deepEqual(e, aCase[1]))
          .catch(() => t.fail('Should not fail'));
      } else {
        return validateCloudEvent(aCase[1])
          .then(() => t.fail('Should not succeed'))
          .catch(() => t.pass());
      }
    });
  }
}
