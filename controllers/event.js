const {keyboard, create_keyboard} = require('../keyboard');
const {message} = require('../string');
const {PrayTimes} = require('../praytimes');
const nodeGeocoder = require('node-geocoder');
const timezone = require('node-google-timezone');

const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GOOGLE_GEOCODER,
    formatter: null
};
const geocoder = nodeGeocoder(options);

// state
exports.on_location = ctx => {
    let method = 'Tehran',
        {latitude, longitude} = ctx.message.location,
        coords = [latitude, longitude];


    geocoder.reverse({lat: latitude, lon: longitude}, function (err, res) {
        if (err)
            ctx.reply('error on server');

        let city = res[0].city;
        timezone.data(coords[0], coords[1], new Date().getTime() / 1000, (err, tz) => {
            let {dstOffset, rawOffset} = tz.raw_response;
            rawOffset /= 3600;
            dstOffset /= 3600;
            ctx.session.last_config = {
                method,
                city,
                coords,
                raw_offset: rawOffset,
                dst_offset: dstOffset
            };

            let times = new PrayTimes(method).getTimes(new Date(), coords, rawOffset, dstOffset);
            ctx.replyWithHTML(message.pray_times(times, city), create_keyboard(keyboard.make_default_owghat, {resize_keyboard: true}));
        });
    });
};