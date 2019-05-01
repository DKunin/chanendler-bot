'use strict';

const TelegramBot = require('node-telegram-bot-api');
const request = require('./utils/request');
const logger = require('./utils/logger')();
var Airtable = require('airtable');
const { AIRTABLE_API_KEY } = process.env;

var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base('appKdcKBHrCKfhkev');

const token = process.env.CHANENDLER_BONG_BOT;
const magnetShortenerIP = process.env.CITADEL_IP;

const bot = new TelegramBot(token, { polling: true });
const magShoUrl = `http://${magnetShortenerIP}:3738/api`;

function getLatestEntries() {
    let body = {};
    return new Promise((resolve, reject) => {
        base('BloodPressure')
            .select({
                // Selecting the first 3 records in Grid view:
                maxRecords: 10,
                view: 'Grid view',
                sort: [{ field: 'date', direction: 'desc' }]
            })
            .eachPage(
                function page(records, fetchNextPage) {
                    body.low = records.map(function(record) {
                        return record.get('low');
                    }).join(',');
                    body.high = records.map(function(record) {
                        return record.get('high');
                    }).join(',');
                    body.pulse = records.map(function(record) {
                        return record.get('pulse');
                    }).join(',');

                    fetchNextPage();
                },
                function done(err) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(body);
                }
            );
    });
}

bot.onText(/magnet:\?.+/, async (msg, match) => {
    const chatId = msg.chat.id;
    logger.info(`recieved request /magnet, ${chatId}`);
    const query = escape(match[0]);
    const { text: hash } = await request(
        `${magShoUrl}/shorten?url=${query}`
    ).catch(err => logger.error(err));
    bot.sendMessage(chatId, `${magShoUrl}/get?hash=${hash}`);
});

bot.onText(/B:(.+)?/, function(msg, match) {
    const chatId = msg.chat.id;
    const query = match[0].split(':')[1].split('/');

    base('BloodPressure').create(
        {
            date: new Date(),
            high: parseInt(query[0]),
            low: parseInt(query[1]),
            pulse: parseInt(query[2])
        },
        function(err, record) {
            if (err) {
                bot.sendMessage(chatId, err);
                return;
            }
            const latestEntries = await getLatestEntries();
            getLatestEntries().then(body => {
                bot.sendMessage(chatId, `https://image-charts.com/chart?cht=ls&chs=500x200&chd=t:${body.high}|${body.low}|${body.pulse}&chds=0,220`);
            });
        }
    );
});



logger.info('Chanendler Bong initiated');
