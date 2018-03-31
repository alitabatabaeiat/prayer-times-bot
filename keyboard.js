const {Markup} = require('telegraf');
const {buttons} = require('./string');

module.exports = {
    keyboard: {
        start: [
            Markup.button(buttons.owghat),
        ],
        get_location: [
            Markup.locationRequestButton(buttons.send_location),
            // Markup.button(buttons.choose_city),
            Markup.button(buttons.go_home)
        ],
        make_default_owghat: [
            Markup.button(buttons.make_default),
            Markup.button(buttons.go_home)
        ],
        owghat_recieved: [
            Markup.button(buttons.another_city),
            Markup.button(buttons.go_home)
        ]
    },
    inline_keyboard: {}
};