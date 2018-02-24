'use strict';

const TelegramBot = require('node-telegram-bot-api');
const stoicapi = require('stoic-api');
const currency = require('./utils/currency');
const request = require('./utils/request');
const logger = require('./utils/logger')();
const token = process.env.CHANENDLER_BONG_BOT;
const magnetShortenerIP = process.env.CITADEL_IP;
const bookmarksWebHook = process.env.BOOKMARK_WEBHOOK;
const bot = new TelegramBot(token, { polling: true });
const pirateGrabber = `http://${magnetShortenerIP}:3739/api/get`;
const magShoUrl = `http://${magnetShortenerIP}:3738/api`;

bot.onText(/\/stoic/, message => {
    const chatId = message.chat.id;
    logger.info(`recieved request /stoic, ${chatId}`);
    bot.sendMessage(chatId, stoicapi.random());
});

bot.onText(/magnet:\?.+/, async (msg, match) => {
    const chatId = msg.chat.id;
    logger.info(`recieved request /magnet, ${chatId}`);
    const query = escape(match[0]);
    const { text: hash } = await request(
        `${magShoUrl}/shorten?url=${query}`
    ).catch(err => logger.error(err));
    bot.sendMessage(chatId, `${magShoUrl}/get?hash=${hash}`);
});

bot.onText(/episode (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    logger.info(`recieved request /episode, ${chatId}`);
    const query = escape(match[0].replace('episode ', ''));
    const firstRequest = `${pirateGrabber}?url=https://thepiratebay.org/search/${query}`;
    const { text: magnetUrl } = await request(firstRequest).catch(err =>
        logger.error(err)
    );
    const { text: shortenedUrl } = await request(
        `${magShoUrl}/shorten?url=${escape(magnetUrl)}`
    ).catch(err => logger.error(err));
    bot.sendMessage(chatId, `${magShoUrl}/get?hash=${shortenedUrl}`);
});

bot.onText(/\/sign (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    logger.info(`recieved request /sign, ${chatId}`);
    const word = match[1];
    if (word) {
        bot.sendMessage(chatId, '© 1996-2017 Jolanta Lapiak:');
        bot.sendMessage(
            chatId,
            `https://www.handspeak.com/word/${word[0]}/${word}.mp4`
        );
    } else {
        bot.sendMessage(chatId, 'nope');
    }
});

bot.onText(/\/conv (\d+) (\w{3}) (\w{3})/, async (msg, match) => {
    const chatId = msg.chat.id;
    logger.info(`recieved request /conv, ${chatId}`);
    const response = await currency(match[1], match[2], match[3]);
    bot.sendMessage(chatId, response);
});

bot.onText(/\/start/, msg => {
    bot.sendMessage(msg.chat.id, '...', {
        reply_markup: {
            resize_keyboard: true,
            keyboard: [['/stoic', '/episode'], ['/conv', 'test'], ['edit']]
        }
    });
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
        bot
            .answerInlineQuery(queryId, response, {})
            .then(res => logger.info(res))
            .catch(err => logger.error(err));
    }
});

logger.info('Chanendler Bong initiated');
