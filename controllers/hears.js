const {state} = require('../state');
const {keyboard, inline_keyboard, create_keyboard} = require('../keyboard');
const {message, button, equals} = require('../string');
const {PrayTimes} = require('../praytimes');
const commandCtrl = require('./command');
const {Markup} = require('telegraf');
const nodeGeocoder = require('node-geocoder');
const timezone = require('node-google-timezone');
const util = require('../util');

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
            switch (ctx.session.state) {
                case state.start:
                    ctx.session.state = state.select_province;
                    break;
                case state.change_city:
                case state.change_city_select_city:
                    ctx.session.state = state.change_city_select_province;
                    break;
            }
        },
        select_city: (ctx, next) => {
            if (ctx.session.state === state.select_city ||
                ctx.session.state === state.change_city_select_city)
                next();
            else {
                ctx.reply(message.select_city,
                    create_keyboard(keyboard.select_city(ctx.message.text), {resize_keyboard: true}));
                switch (ctx.session.state) {
                    case state.select_province:
                        ctx.session.state = state.select_city;
                        break;
                    case state.change_city_select_province:
                        ctx.session.state = state.change_city_select_city;
                        break;
                }
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
                    switch (ctx.session.state) {
                        case state.select_city:
                            module.home(ctx);
                            break;
                        case state.change_city_select_city:
                            module.get_owghat(ctx);
                            break;
                    }
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
        let new_keyboard = keyboard.location.slice(0);
        new_keyboard.push(Markup.button(button.return));
        ctx.reply(message.change_city,
            create_keyboard(new_keyboard, {resize_keyboard: true}));
        ctx.session.state = state.change_city;
    };

    module.azan_notif = {
        start: ctx => {
            ctx.reply(message.azan_notif.start,
                create_keyboard(keyboard.azan_notif.start(ctx.session.azan_notif), {resize_keyboard: true}));
            ctx.session.state = state.azan_notif;
        },
        sobh: ctx => {
            util.hears_azan_notif(bot, ctx, 'sobh');
        },
        zohr: ctx => {
            util.hears_azan_notif(bot, ctx, 'zohr');
        },
        maghreb: ctx => {
            util.hears_azan_notif(bot, ctx, 'maghreb');
        },
    };

    module.return = ctx => {
        switch (ctx.session.state) {
            case state.select_province:
                commandCtrl.start(ctx);
                break;
            case state.select_city:
                module.start.select_province(ctx);
                break;
            case state.get_owghat:
            case state.azan_notif:
                module.home(ctx);
                break;
            case state.change_city:
                module.get_owghat(ctx);
                break;
            case state.change_city_select_province:
                module.change_city(ctx);
                break;
            case state.change_city_select_city:
                module.start.select_province(ctx);
                break;
        }
    };

    return module;
};