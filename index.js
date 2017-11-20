'use strict';

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.CHANENDLER_BONG_BOT;
const myChatId = process.env.PERSONAL_CHAT;
const magnetShortenerIP = process.env.CITADEL_IP;
const bot = new TelegramBot(token, { polling: true });
const stoicapi = require('stoic-api');
const currency = require('./currency');
const request = require('superagent');

bot.onText(/\/stoic/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, stoicapi.random());
});

bot.onText(/magnet:\?.+/, (msg, match) => {
    const chatId = msg.chat.id;
    request(
        `http://${magnetShortenerIP}:3738/api/shorten?url=${escape(match[0])}`
    )
        .set('Accept', 'application/json')
        .end((err, body) => {
            bot.sendMessage(
                chatId,
                `http://${magnetShortenerIP}:3738/api/get?hash=${body.text}`
            );
        });
});

bot.onText(/episode (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    request(
        `http://${magnetShortenerIP}:3739/api/get?url=https://thepiratebay.org/search/${escape(match[0].replace('episode ', ''))}`
    )
        .set('Accept', 'application/json')
        .end((err, body) => {
            request(
                `http://${magnetShortenerIP}:3738/api/shorten?url=${escape(body.text)}`
            )
                .set('Accept', 'application/json')
                .end((err, body) => {
                    bot.sendMessage(
                        chatId,
                        `http://${magnetShortenerIP}:3738/api/get?hash=${body.text}`
                    );
                });
        });
});

bot.onText(/\/sign (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
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

bot.onText(/\/conv (\d+) (\w{3}) (\w{3})/, (msg, match) => {
    const chatId = msg.chat.id;
    currency(match[1], match[2], match[3]).then(response => {
        bot.sendMessage(chatId, response);
    });
});

bot.sendMessage(myChatId, 'Time to get schwifty!');
