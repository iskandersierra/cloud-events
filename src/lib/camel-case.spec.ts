import { test } from 'ava';
import { toCamelCase } from './camel-case';

test('toCamelCase - An empty string should stay the same', t =>
  t.is(toCamelCase(''), ''));

test('toCamelCase - A camel-cased phrase should stay the same', t =>
  t.is(toCamelCase('helloWorld'), 'helloWorld'));

test('toCamelCase - A pascal-cased phrase should be converted properly', t =>
  t.is(toCamelCase('ThisIsAPascalCasePhrase'), 'thisIsAPascalCasePhrase'));

test('toCamelCase - A Titled statement should be converted properly', t =>
  t.is(toCamelCase('This is a statement'), 'thisIsAStatement'));

test('toCamelCase - A space-separated phrase should be converted properly', t =>
  t.is(toCamelCase('This is\r\na\tstatement'), 'thisIsAStatement'));

test('toCamelCase - A dash-separated phrase should be converted properly', t =>
  t.is(toCamelCase('This-is-a-statement'), 'thisIsAStatement'));

test('toCamelCase - A underscore-separated phrase should be converted properly', t =>
  t.is(toCamelCase('This_is_a_statement'), 'this_is_a_statement'));
