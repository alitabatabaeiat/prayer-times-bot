const {Markup} = require('telegraf');
const {button, action} = require('./string');
const {province, cities} = require('./iran');

module.exports = {
    keyboard: {
        location: [
            Markup.button(button.select_city),
            Markup.locationRequestButton(button.send_location)
        ],
        home: [
            Markup.button(button.get_owghat),
            Markup.button(button.azan_notif.start),
            // Markup.button(button.settings.start)
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
        ],
        azan_notif: {
            start: azan_notif => {
                return [
                    [
                        Markup.button(button.azan_notif.maghreb(azan_notif.maghreb)),
                        Markup.button(button.azan_notif.zohr(azan_notif.zohr)),
                        Markup.button(button.azan_notif.sobh(azan_notif.sobh))
                    ],
                    [Markup.button(button.return)]
                ]
            }
        }
    },
    inline_keyboard: {},
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