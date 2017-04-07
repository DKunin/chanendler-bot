'use strict';
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.CHANENDLER_BONG_BOT;
const bot = new TelegramBot(token, { polling: true });
const stoicapi = require('stoic-api');
const currency = require('./currency');
const PirateBay = require('thepiratebay');


bot.onText(/\/stoic/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, stoicapi.random());
});

// http://mgnet.me/api/create/?m=magnet:?xt=urn:btih:99944890e765e3163f51a53926c12298c2c07de4&dn=Archer.2009.S08E01.HDTV.x264-SVA&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969&format=xml
// tg://bot_command?command=smth

bot.on('inline_query', response => {
    PirateBay.search(response.query)
        .then(results => {
            const newResults = results.map(({ id, name, seeders, leechers, magnetLink }) => {
                return {
                    id,
                    type: 'article',
                    title: `${name} ${seeders} ${leechers}`,
                    input_message_content: {
                        message_text: magnetLink
                    }
                };
            });
            bot.answerInlineQuery(response.id, newResults);
        })
        .catch(err => console.log(err));
});

bot.onText(/\/conv (\d+) (\w{3}) (\w{3})/, (msg, match) => {
    const chatId = msg.chat.id;
    currency(match[1], match[2], match[3]).then(response => {
        bot.sendMessage(chatId, response);
    });
});

// bot.on('message', msg => {
//     const chatId = msg.chat.id;
// });
