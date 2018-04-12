const {Markup} = require('telegraf');
const {button, action} = require('./string');
const {province, cities} = require('./iran');


module.exports = {
    keyboard: {
        send_location: [Markup.locationRequestButton(button.send_location)],
    },
    inline_keyboard: {
        start: [
            Markup.callbackButton(button.send_location, action.start.send_location),
            Markup.callbackButton(button.choose_city, action.start.choose_city),
        ],
        home: [
            Markup.callbackButton(button.settings.start, action.settings.start),
            Markup.callbackButton(button.owghat, action.get_owghat)
        ],
        owghat_recieved: [
            Markup.callbackButton(button.return, action.return),
            Markup.callbackButton(button.change_city, action.change_city)
        ],
        settings: {
            start: [
                [
                    Markup.callbackButton(button.settings.ghaza.start, action.settings.ghaza.start),
                    Markup.callbackButton(button.settings.azan.start, action.settings.azan.start)
                ],
                [Markup.callbackButton(button.return, action.return)]
            ],
            azan: active => {
                return [
                    [
                        Markup.callbackButton(button.settings.azan.maghreb(active[2]), action.settings.azan.maghreb),
                        Markup.callbackButton(button.settings.azan.zohr(active[1]), action.settings.azan.zohr),
                        Markup.callbackButton(button.settings.azan.sobh(active[0]), action.settings.azan.sobh)
                    ],
                    [Markup.callbackButton(button.settings.azan.all(active[3]), action.settings.azan.all)],
                    [Markup.callbackButton(button.return, action.return)]
                ]
            }
        },
        return: [Markup.callbackButton(button.return, action.return)],
        select_province: () => {
            let keyboard = [];
            let row = [];
            let p = action.start.province();

            for (let i = 0; i < province.length; i++) {
                row.push(Markup.callbackButton(province[i], p[i]));
                if (i % 3 === 2) {
                    keyboard.push(row);
                    row = [];
                }
            }
            return keyboard;
        },
        select_city: (province) => {
            let keyboard = [];
            let row = [];
            let counter = 0;
            let city = cities(parseInt(province.split("_")[1]));

            for (let c in city) {
                row.push(Markup.callbackButton(city[c], c));
                counter++;
                if (counter === 3) {
                    keyboard.push(row);
                    row = [];
                    counter = 0;
                }
            }
            return keyboard;
        }

    },
    create_keyboard: (keyboard, options = {}) => {
        if (!options.extra)
            options = Object.assign(options, {extra: {}});
        if (options.inline_keyboard)
            return Markup.inlineKeyboard(keyboard).extra(options.extra);
        mKeybord = Markup.keyboard(keyboard);
        mKeybord = options.one_time_keyboard ? mKeybord.oneTime() : mKeybord;
        mKeybord = options.resize_keyboard ? mKeybord.resize() : mKeybord;
        return mKeybord.extra(options.extra);
    },
    remove_keyboard: () => {
        return Markup.removeKeyboard().extra()
    }
};