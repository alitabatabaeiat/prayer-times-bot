const {state} = require('../state');
const schedule = require('node-schedule');
const {keyboard, inline_keyboard, create_keyboard} = require('../keyboard');
const {message, action} = require('../string');
const {PrayTimes} = require('../praytimes');
const commandCtrl = require('./command');
const {Markup} = require('telegraf');
const nodeGeocoder = require('node-geocoder');
const timezone = require('node-google-timezone');

const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GOOGLE_GEOCODER,
    formatter: null,
    language: 'fa'
};
const geocoder = nodeGeocoder(options);

module.exports = function (bot) {
    let module = {};

    module.start = {
        select_province: ctx => {
                ctx.reply(message.select_province,
                    create_keyboard(keyboard.select_province(), {resize_keyboard: true}));
                ctx.session.state = state.select_province;
        },
        select_city: (ctx, next) => {
            if (ctx.session.state === state.select_city)
                next();
            else {
                ctx.reply(message.select_city,
                    create_keyboard(keyboard.select_city(ctx.message.text), {resize_keyboard: true}));
                ctx.session.state = state.select_city;
            }
        },
        city_selected: ctx => {
            let method = 'Tehran',
                city = ctx.message.text;
            geocoder.geocode(city, (err, res) => {
                if (err) {
                    ctx.reply(message.error, create_keyboard(keyboard.start, {resize_keyboard: true}));
                    return;
                }
                let coords = [res[0].latitude, res[0].longitude];
                timezone.data(coords[0], coords[1], new Date().getTime() / 1000, (err, tz) => {
                    if (err) {
                        ctx.reply(message.error, create_keyboard(keyboard.start, {resize_keyboard: true}));
                        return;
                    }
                    let {dstOffset, rawOffset} = tz.raw_response;
                    rawOffset /= 3600;
                    dstOffset /= 3600;
                    ctx.session.default_config = {
                        method,
                        city,
                        coords,
                        raw_offset: rawOffset,
                        dst_offset: dstOffset
                    };
                    module.home(ctx);
                });
            });

        }
    };

    module.home = ctx => {
        ctx.reply(message.home,
            create_keyboard(keyboard.home, {resize_keyboard: true}));
        ctx.session.state = state.home;
    };

    module.get_owghat = ctx => {
        let {city, method, coords, raw_offset, dst_offset} = ctx.session.default_config;
        let times = new PrayTimes(method).getTimes(new Date(), coords, raw_offset, dst_offset);

        ctx.replyWithHTML(message.pray_times(times, city),
            create_keyboard(keyboard.owghat_recieved, {resize_keyboard: true}));

        ctx.session.state = state.get_owghat;
    };

    module.change_city = ctx => {

    };

    module.return = ctx => {
        console.log(ctx.session.state);
        switch (ctx.session.state) {
            case state.select_province:
                commandCtrl.start(ctx);
                break;
            case state.select_city:
                module.start.select_province(ctx);
                break;
            case state.get_owghat:
                module.home(ctx);
                break;
        }
    };

    return module;
};