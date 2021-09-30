"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
const config_json_1 = __importDefault(require("../../config.json"));
class Under extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.commands = [];
        this.events = [];
        this.config = config_json_1.default;
        this.loadCommands();
        this.loadEvents();
    }
    registryCommands() {
        var _a;
        (_a = this.guilds.cache.get('840070720275873812')) === null || _a === void 0 ? void 0 : _a.commands.set(this.commands);
    }
    loadCommands(path = 'dist/src/commands') {
        const categories = (0, fs_1.readdirSync)((0, path_1.join)(process.cwd(), path));
        for (const category of categories) {
            const commands = (0, fs_1.readdirSync)(`${path}/${category}`).filter((file) => file.endsWith('.js'));
            for (const command of commands) {
                const commandClass = require((0, path_1.join)(process.cwd(), `${path}/${category}/${command}`)).default;
                const handler = new commandClass(this);
                this.commands.push(handler);
            }
        }
    }
    loadEvents(path = 'dist/src/events') {
        const events = (0, fs_1.readdirSync)(path).filter((file) => file.endsWith('.js'));
        for (const event of events) {
            const eventClass = require((0, path_1.join)(process.cwd(), `${path}/${event}`)).default;
            const handler = new eventClass(this);
            this.events.push(handler);
            this.on(handler.name, handler.run);
        }
    }
    init(token) {
        super.login(this.config.token || token);
        return this;
    }
}
exports.default = Under;
