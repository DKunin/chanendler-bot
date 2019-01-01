'use strict';

const TelegramBot = require('node-telegram-bot-api');
const torba = require('./utils/torba');
const request = require('./utils/request');
const logger = require('./utils/logger')();

const token = process.env.CHANENDLER_BONG_BOT;
const magnetShortenerIP = process.env.CITADEL_IP;
const bookmarksWebHook = process.env.BOOKMARK_WEBHOOK;

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

bot.onText(/\/parse (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    logger.info(`recieved request /parse, ${chatId}`);
    const url = match[1];

    if (url) {
        const result = await torba(url);
        // const opts = {
        //     parse_mode: 'HTML'
        // };
        const content = result.data.content; // .replace(/<body>|<\/body>/g, '');
        bot.sendMessage(chatId, content);
    } else {
        bot.sendMessage(chatId, 'nope');
    }
});

bot.on('inline_query', async function(msg) {
    const input = msg.query;
    const queryId = msg.id;

    const bkm = await request(
        `${bookmarksWebHook}/bookmarks?query=${input}&alfred=true`
    ).catch(err => logger.error(err));

    const response = JSON.parse(bkm.text).items.map((singleLink, index) => {
        return {
            id: index,
            type: 'article',
            parse_mode: 'markdown',
            title: singleLink.title,
            message_text: singleLink.arg
        };
    });

    if (input.length > 0) {
        bot.answerInlineQuery(queryId, response, {})
            .then(res => logger.info(res))
            .catch(err => logger.error(err));
    }
});

logger.info('Chanendler Bong initiated');
