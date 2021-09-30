"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Under_1 = __importDefault(require("./src/Under"));
const client = new Under_1.default({
    intents: Object.values(discord_js_1.Intents.FLAGS),
    restTimeOffset: 0,
    allowedMentions: { parse: ['users'] }
});
client.init();
