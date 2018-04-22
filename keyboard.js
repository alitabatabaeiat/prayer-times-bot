const {Markup} = require('telegraf');
const {button, action} = require('./string');
const {province, cities} = require('./iran');

module.exports = {
    keyboard: {
        start: [
            Markup.button(button.select_city),
            Markup.locationRequestButton(button.send_location)
        ],
        home: [
            Markup.button(button.get_owghat),
            Markup.button(button.settings.start)
        ],
        select_province: () => {
            let keyboard = [[Markup.button(button.return)]];
            let row = [];
            let p = button.provinces;

            for (let i = 0; i < button.provinces.length; i++) {
                row.push(Markup.button(button.provinces[i]));
                if (i % 3 === 2) {
                    keyboard.push(row);
                    row = [];
                }
            }
            return keyboard;
        },
        select_city: selected_province => {
            const index = province.indexOf(selected_province);
            const cities_of_province = cities(index);
            let cities_array = [];
            for (let c in cities_of_province)
                if (cities_of_province.hasOwnProperty(c))
                    cities_array.push(cities_of_province[c]);
            let keyboard = [[Markup.button(button.return)]];
            let row = [];

            for (let i = 0; i < cities_array.length; i++) {
                row.push(Markup.button(cities_array[i]));
                if (i % 3 === 2) {
                    keyboard.push(row);
                    row = [];
                }
            }
            return keyboard;
        },
        owghat_recieved: [
            Markup.button(button.change_city),
            Markup.button(button.return)
        ]
    },
    inline_keyboard: {
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