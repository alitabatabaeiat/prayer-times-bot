const {keyboard, create_keyboard} = require('../keyboard');
const {message} = require('../string');
const {PrayTimes} = require('../praytimes');
const nodeGeocoder = require('node-geocoder');
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
        coords = [latitude, longitude],
        times = new PrayTimes(method).getTimes(new Date(), coords);

    geocoder.reverse({lat: latitude, lon: longitude}, function (err, res) {
        if (err) {
            ctx.reply('error on server');
        }
        let city = res[0].city;
        ctx.session.last_config = {
            method,
            city,
            coords
        };
        ctx.replyWithHTML(message.pray_times(times, city), create_keyboard(keyboard.make_default_owghat, {resize_keyboard: true}));
    });
};