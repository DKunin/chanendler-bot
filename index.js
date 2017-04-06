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

bot.on('inline_query', response => {
    bot.answerInlineQuery(response.id, [
        {
            id: '1',
            type: 'article',
            title: 'Волшебный ларец винки-дого-мулозайцев',
            input_message_content: {
                message_text: 'Волшебный ларец винки-дого-мулозайцев'
            }
        },
        {
            id: '2',
            type: 'article',
            title: 'Шишкибаб',
            input_message_content: { message_text: 'Шишкибаб' }
        }
    ]);
});
