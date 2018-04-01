const {Markup} = require('telegraf');
const {button, action} = require('./string');

module.exports = {
    keyboard: {
        start: [
            Markup.button(button.owghat),
            Markup.button(button.settings.start)
        ],
        get_location: [
            Markup.locationRequestButton(button.send_location),
            // Markup.button(button.choose_city),
            Markup.button(button.go_home)
        ],
        make_default_owghat: [
            Markup.button(button.make_default),
            Markup.button(button.go_home)
        ],
        owghat_recieved: [
            Markup.button(button.another_city),
            Markup.button(button.go_home)
        ]
    },
    inline_keyboard: {
        settings: {
            start: [
                [
                    Markup.callbackButton(button.settings.ghaza, action.settings.ghaza),
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
        return: [Markup.callbackButton(button.return, action.return)]

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
    }
};