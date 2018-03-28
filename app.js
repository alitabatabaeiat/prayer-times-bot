require('dotenv').config();
const Telegraf = require('telegraf');
const {Extra, Markup} = Telegraf;
const {messages, actions} = require('./string');
const {PrayTimes} = require('./praytimes');
const getCoords = require('city-to-coords');

const bot = new Telegraf(process.env.BOT_TOKEN);

const defaultKeyboard = Extra.HTML().markup((m =>
        m.inlineKeyboard([
            m.callbackButton('اوقات شرعی امروز', actions.today)
        ])
));

const returnKeyboard = Extra.HTML().markup((m =>
        m.inlineKeyboard([
            m.callbackButton('بازگشت', actions.return)
        ])
));

bot.start(ctx => ctx.reply(messages.start(ctx), defaultKeyboard));

bot.action(actions.today, ctx => {

    let method = 'Tehran';
    let date = new Date();
    let city = 'Tehran';
    getCoords(city)
        .then(result => {
            let coords = [result.lat, result.lng];
            let pt = new PrayTimes(method);
            let times = pt.getTimes(date, coords);
            console.log(messages.prayTimes(times))
            ctx.editMessageText(messages.prayTimes(times), returnKeyboard);
        });

});

bot.action(actions.return, ctx => {
    ctx.editMessageText(messages.start(ctx), defaultKeyboard);
});

bot.startPolling();