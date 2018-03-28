const keyboard = require('../keyboard');
const {messages, actions} = require('../string');
const {Markup} = require('telegraf');

exports.start = ctx => {
    ctx.reply(messages.start(ctx), Markup.keyboard(keyboard.start).resize().extra());
};

exports.getOwghat = ctx => {
    ctx.reply(messages.specifyCity, Markup.keyboard(keyboard.setCity).resize().extra())
};

exports.return = ctx => {
    ctx.reply(messages.start(ctx), Markup.keyboard(keyboard.start).resize().extra());
};

exports.getLocation = ctx => {
    ctx.reply(messages.sendYourLocation, Markup.keyboard(keyboard.getLocation).resize().extra());
};