#!/usr/bin/env node

'use strict';

const https = require('https');
const filenamify = require('filenamify');
const { MERCURY_KEY } = process.env;
const { simpleRequest } = require('./utils/simple-request');
const translit = require('translit')({
    А: 'A',
    а: 'a',
    Б: 'B',
    б: 'b',
    В: 'V',
    в: 'v',
    Г: 'G',
    г: 'g',
    Д: 'D',
    д: 'd',
    Е: 'E',
    е: 'e',
    Ё: 'E',
    ё: 'e',
    Ж: 'Zh',
    ж: 'zh',
    З: 'Z',
    з: 'z',
    И: 'I',
    и: 'i',
    Й: 'Y',
    й: 'y',
    К: 'K',
    к: 'k',
    Л: 'L',
    л: 'l',
    М: 'M',
    м: 'm',
    Н: 'N',
    н: 'n',
    О: 'O',
    о: 'o',
    П: 'P',
    п: 'p',
    Р: 'R',
    р: 'r',
    С: 'S',
    с: 's',
    Т: 'T',
    т: 't',
    У: 'U',
    у: 'u',
    Ф: 'F',
    ф: 'f',
    Х: 'Kh',
    х: 'kh',
    Ц: 'Ts',
    ц: 'ts',
    Ч: 'Ch',
    ч: 'ch',
    Ш: 'Sh',
    ш: 'sh',
    Щ: 'Sch',
    щ: 'sch',
    ь: '',
    Ы: 'Y',
    ы: 'y',
    ъ: '',
    Э: 'E',
    э: 'e',
    Ю: 'Yu',
    ю: 'yu',
    Я: 'Ya',
    я: 'ya'
});

module.exports = function(url) {
    return new Promise(resolve => {
        simpleRequest(https, {
            host: 'mercury.postlight.com',
            path: `/parser?url=${url}`,
            headers: {
                'x-api-key': MERCURY_KEY
            }
        })
            .then(data => {
                const fileName = filenamify(translit(data.title)) + '.html';
                resolve({ filename: fileName, data });
            })
            .catch(error => {
                console.log(error);
                throw new Error(error);
            });
    });
};
