'use strict';
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.CHANENDLER_BONG_BOT;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.onText(/привет/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'И вам не болеть');
});

// bot.on('message', msg => {
//     const chatId = msg.chat.id;
// });

bot.on('inline_query', (id, from, location, query) => {
    const chatId = from.id;
    // bot.sendMessage(chatId, 'id, from, location, query');
});
