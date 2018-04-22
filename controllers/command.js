const {state} = require('../state');
const {keyboard, inline_keyboard, create_keyboard} = require('../keyboard');
const {message} = require('../string');

exports.start = ctx => {
    console.log(state.start)
    ctx.reply(message.start(ctx.from.first_name),
        create_keyboard(keyboard.start, {resize_keyboard: true}));
    ctx.session.state = state.start;
    console.log(ctx.session)

};