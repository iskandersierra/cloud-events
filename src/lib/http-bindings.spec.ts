import { test } from 'ava';
import { parse } from './http-bindings';

test.cb('http-bindings - parse - No headers ([]) parsing should fail', t => {
  parse([], null)
    .then(event => {
      t.is(event, undefined);
      t.end('Unexpected event result');
    })
    .catch(() => t.end());
});

test.cb('http-bindings - parse - No headers ({}) parsing should fail', t => {
  parse({}, null)
    .then(event => {
      t.is(event, undefined);
      t.end('Unexpected event result');
    })
    .catch(() => t.end());
});

const sample = {
  'CE-CloudEventsVersion': '0.1',
  'Content-Type': 'text/xml',
  'CE-EventID': 'A234-1234-1234',
  'CE-EventTime': '2018-04-05T17:31:00.000Z',
  'CE-EventType': 'com.example.someevent',
  'ce-EventTypeVersion': '1.0',
  'CE-SchemaURL': '/someevent-schema',
  'CE-Source': '/mycontext'
};

test.cb(
  'http-bindings - parse - Parsing standard headers should succeed',
  t => {
    parse(
      {
        ...sample,
        'CE-x-CorrelationId': '123456',
        'CE-Reserved': 'ABC',
        'Accept-Language': 'es'
      },
      null
    )
      .then(event => {
        t.truthy(event);
        t.is(event.cloudEventsVersion, '0.1');
        t.is(event.eventID, 'A234-1234-1234');
        t.is(event.eventTime, '2018-04-05T17:31:00.000Z');
        t.is(event.eventType, 'com.example.someevent');
        t.is(event.eventTypeVersion, '1.0');
        t.is(event.schemaURL, '/someevent-schema');
        t.is(event.source, '/mycontext');
        t.is(event.contentType, 'text/xml');
        t.is(event.reserved, 'ABC');
        t.truthy(event.extensions);
        t.falsy(event.acceptLanguage);
        if (event.extensions) {
          t.is(event.extensions.correlationId, '123456');
        }
        t.end();
      })
      .catch(t.end);
  }
);

test.cb(
  'http-bindings - parse - Empty body should leave empty data attribute',
  t => {
    parse(sample, null)
      .then(event => {
        t.truthy(event);
        t.is(event.data, undefined);
        t.end();
      })
      .catch(t.end);
  }
);

test.cb(
  'http-bindings - parse - Value body should set same value in data attribute',
  t => {
    parse(sample, 'Message Content')
      .then(event => {
        t.truthy(event);
        t.is(event.data, 'Message Content');
        t.end();
      })
      .catch(t.end);
  }
);

test.cb(
  'http-bindings - parse - Promise body should set same value in data attribute',
  t => {
    parse(sample, Promise.resolve('Message Content'))
      .then(event => {
        t.truthy(event);
        t.is(event.data, 'Message Content');
        t.end();
      })
      .catch(t.end);
  }
);

test.cb(
  'http-bindings - parse - Computed value body should set same value in data attribute',
  t => {
    parse(sample, () => 'Message Content')
      .then(event => {
        t.truthy(event);
        t.is(event.data, 'Message Content');
        t.end();
      })
      .catch(t.end);
  }
);

test.cb(
  'http-bindings - parse - Computed Promise body should set same value in data attribute',
  t => {
    parse(sample, () => Promise.resolve('Message Content'))
      .then(event => {
        t.truthy(event);
        t.is(event.data, 'Message Content');
        t.end();
      })
      .catch(t.end);
  }
);
