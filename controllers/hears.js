const {keyboard, inline_keyboard, create_keyboard} = require('../keyboard');
const {messages} = require('../string');
const {Markup} = require('telegraf');
const {PrayTimes} = require('../praytimes');

exports.start = ctx => {
    ctx.reply(messages.start(ctx.from.first_name), Markup.keyboard(keyboard.start).resize().extra());
};

exports.go_home = ctx => {
    ctx.reply(messages.home, create_keyboard(keyboard.start, {resize_keyboard: true}));
};

exports.get_owghat = ctx => {
    let def = ctx.session.default;
    if (!def.city)
        ctx.reply(messages.specify_city, create_keyboard(keyboard.get_location, {resize_keyboard: true}));
    else {
        let times = new PrayTimes(def.method).getTimes(new Date(), def.coords);
        ctx.replyWithHTML(messages.pray_times(times, def.city),create_keyboard(keyboard.owghat_recieved, {resize_keyboard: true}));
    }
};

exports.make_default = ctx => {
    ctx.session.default = ctx.session.last_config;
    ctx.reply(messages.saved, create_keyboard(keyboard.owghat_recieved, {resize_keyboard: true}));
};

exports.another_city = ctx => {
    ctx.reply(messages.specify_city, create_keyboard(keyboard.get_location, {resize_keyboard: true}));
};