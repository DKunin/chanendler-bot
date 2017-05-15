'use strict';

import test from 'ava';
import currency from './currency';

test('simple conversation', async t => {
    const conv = currency(10, 'usd', 'rub');
    t.regex(await conv, /\d/);
});

test('decimal conversation', async t => {
    const conv = currency(10.33, 'usd', 'rub');
    t.regex(await conv, /\d/);
});

test('string conversation', async t => {
    const conv = currency('10.33', 'usd', 'rub');
    t.regex(await conv, /\d/);
});
