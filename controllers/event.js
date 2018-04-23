const {state} = require('../state');
const {keyboard, inline_keyboard, create_keyboard, remove_keyboard} = require('../keyboard');
const {message} = require('../string');
const {PrayTimes} = require('../praytimes');
const nodeGeocoder = require('node-geocoder');
const timezone = require('node-google-timezone');
const hearsCtrl = require('./hears');

const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GOOGLE_GEOCODER,
    formatter: null,
    language: 'fa'
};
const geocoder = nodeGeocoder(options);

// state
exports.on_location = ctx => {
    let method = 'Tehran',
        {latitude, longitude} = ctx.message.location,
        coords = [latitude, longitude];


    geocoder.reverse({lat: latitude, lon: longitude}, function (err, res) {
        if (err) {
            ctx.reply(message.error, create_keyboard(inline_keyboard.start, {inline_keyboard: true}));
            return;
        }

        let city = res[0].city;
        timezone.data(coords[0], coords[1], new Date().getTime() / 1000, (err, tz) => {
            if (err) {
                ctx.reply(message.error, create_keyboard(inline_keyboard.start, {inline_keyboard: true}));
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
                case state.start:
                    ctx.reply(message.home,
                        create_keyboard(keyboard.home, {resize_keyboard: true}));
                    ctx.session.state = state.send_location;
                    break;
                case state.change_city:
                    hearsCtrl.get_owghat(ctx);
                    break;
            }
        });
    });
};