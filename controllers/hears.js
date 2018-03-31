const {keyboard, inline_keyboard} = require('../keyboard');
const {messages} = require('../string');
const {Markup} = require('telegraf');
const {PrayTimes} = require('../praytimes');

exports.start = ctx => {
    ctx.reply(messages.start(ctx.from.first_name), Markup.keyboard(keyboard.start).resize().extra());
};

exports.go_home = ctx => {
    ctx.reply(messages.home, Markup.keyboard(keyboard.start).resize().extra());
};

exports.get_owghat = ctx => {
    let def = ctx.session.default;
    if (!def.city)
        ctx.reply(messages.specify_city, Markup.keyboard(keyboard.get_location).resize().extra());
    else {
        let times = new PrayTimes(def.method).getTimes(new Date(), def.coords);
        ctx.replyWithHTML(messages.pray_times(times, def.city), Markup.keyboard(keyboard.owghat_recieved).resize().extra());
    }
};


exports.make_default = ctx => {
    ctx.session.default = ctx.session.last_config;
    ctx.reply(messages.saved, Markup.keyboard(keyboard.owghat_recieved).resize().extra());
};

exports.another_city = ctx => {
    ctx.reply(messages.specify_city, Markup.keyboard(keyboard.get_location).resize().extra());
}