'use strict';

import test from 'ava';
import torba from './torba';

// import currency from './utils/currency';

// test('simple conversation', async t => {
//     const conv = currency(10, 'usd', 'rub');
//     t.regex(await conv, /\d/);
// });

// test('decimal conversation', async t => {
//     const conv = currency(10.33, 'usd', 'rub');
//     t.regex(await conv, /\d/);
// });

// test('string conversation', async t => {
//     const conv = currency('10.33', 'usd', 'rub');
//     t.regex(await conv, /\d/);
// });

test('simple transition', async t => {
    const result = await torba('https://dkun.in/links/2018/12/24/whats-up-frontend.html');
    console.log(result);
    t.pass();
});
