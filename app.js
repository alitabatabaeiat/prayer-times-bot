require('dotenv').config();
const Telegraf = require('telegraf');
const {Extra, Markup} = Telegraf;
const {messages, actions} = require('./string');
const {PrayTimes} = require('./praytimes');
const getCoords = require('city-to-coords');
const nodeGeocoder = require('node-geocoder');
const actionCtrl = require('./controllers/action');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(actionCtrl.start);

bot.hears(messages.owghatButton, actionCtrl.getOwghat);
bot.hears(messages.returnButton, actionCtrl.return);

bot.hears(messages.basedOnLocationButton, actionCtrl.getLocation);

bot.on('location', ctx => {
    let method = 'Tehran';
    let date = new Date();
    let {latitude, longitude} = ctx.message.location;
    let coords = [latitude, longitude];
    let pt = new PrayTimes(method);
    let times = pt.getTimes(date, coords);


    let options = {
        provider: 'google',

        // Optional depending on the providers
        httpAdapter: 'https', // Default
        apiKey: process.env.GOOGLE_GEOCODER, // for Mapquest, OpenCage, Google Premier
        formatter: null         // 'gpx', 'string', ...
    };

    let geocoder = nodeGeocoder(options);
    geocoder.reverse({lat:latitude, lon:longitude}, function(err, res) {
        let city = res[0].city;
        ctx.replyWithHTML(messages.prayTimes(times, city), Markup.keyboard([Markup.button(messages.owghatButton)]).resize().extra());
    });

});

bot.startPolling();