const {keyboard, inline_keyboard, create_keyboard} = require('../keyboard');
const {message} = require('../string');
const {PrayTimes} = require('../praytimes');

exports.start = ctx => {
    ctx.reply(message.start(ctx.from.first_name), create_keyboard(keyboard.start, {resize_keyboard: true}));
};

exports.go_home = ctx => {
    ctx.reply(message.home, create_keyboard(keyboard.start, {resize_keyboard: true}));
};

exports.get_owghat = ctx => {
    let {city, method, coords, raw_offset, dst_offset} = ctx.session.default;
    if (!city)
        ctx.reply(message.specify_city, create_keyboard(keyboard.get_location, {resize_keyboard: true}));
    else {
        let times = new PrayTimes(method).getTimes(new Date(), coords, raw_offset, dst_offset);
        ctx.replyWithHTML(message.pray_times(times, city),create_keyboard(keyboard.owghat_recieved, {resize_keyboard: true}));
    }
};

exports.settings = ctx => {
    ctx.reply(message.settings.start, create_keyboard(inline_keyboard.settings.start, {inline_keyboard: true}));
};

exports.make_default = ctx => {
    ctx.session.default = ctx.session.last_config;
    ctx.reply(message.saved, create_keyboard(keyboard.owghat_recieved, {resize_keyboard: true}));
};

exports.another_city = ctx => {
    ctx.reply(message.specify_city, create_keyboard(keyboard.get_location, {resize_keyboard: true}));
};