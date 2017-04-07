'use strict';
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.CHANENDLER_BONG_BOT;
const myChatId = process.env.PERSONAL_CHAT;
const bot = new TelegramBot(token, { polling: true });
const stoicapi = require('stoic-api');
const currency = require('./currency');
const PirateBay = require('thepiratebay');
const request = require('superagent');


bot.onText(/\/stoic/, msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, stoicapi.random());
});

bot.onText(/\/shortenmagnet (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    request(`http://mgnet.me/api/create/?m=${match[1]}&format=json`)
        .set('Accept', 'application/json')
        .end((err, body) => {
            const response = JSON.parse(body.text);
            const { shorturl } = response;
            bot.sendMessage(chatId, shorturl);
        });
});

bot.on('inline_query', response => {
    PirateBay.search(response.query)
        .then(results => {
            const newResults = results.map(({ id, name, seeders, leechers, magnetLink }) => {
                return {
                    id,
                    type: 'article',
                    title: `${name} ${seeders} ${leechers}`,
                    input_message_content: {
                        // tg://bot_command?command=
                        message_text: `/shortenmagnet ${magnetLink}`
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

bot.sendMessage(myChatId, 'Time to get schwifty!');

// bot.on('message', msg => {
//     const chatId = msg.chat.id;
// });
