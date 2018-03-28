const {Markup} = require('telegraf');
const {messages, actions} = require('./string');

module.exports = {
    start: [Markup.button(messages.owghatButton)],
    setCity: [
        Markup.button(messages.basedOnLocationButton),
        Markup.button(messages.returnButton)
    ],
    getLocation: [
        Markup.locationRequestButton(messages.sendLocationButton),
        Markup.button(messages.returnButton)
    ]
};