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
            bot.sendMessage(chatId, record.getId());
        }
    );
});

logger.info('Chanendler Bong initiated');
