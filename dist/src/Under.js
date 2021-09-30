"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const path_1 = require("path");
const config_json_1 = __importDefault(require("../config.json"));
const Utils_1 = __importDefault(require("./structures/Utils"));
const client_1 = require("@prisma/client");
class Under extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.config = config_json_1.default;
        this.utils = new Utils_1.default();
        this.db = new client_1.PrismaClient();
        this.loadCommands();
        this.loadEvents();
    }
    registryCommands() {
        var _a;
        const guildCommands = toApplicationCommand(this.commands);
        (_a = this.guilds.cache.get('840070720275873812')) === null || _a === void 0 ? void 0 : _a.commands.set(guildCommands);
    }
    loadCommands(path = 'dist/src/commands') {
        const categories = (0, fs_1.readdirSync)((0, path_1.join)(process.cwd(), path));
        for (const category of categories) {
            const commands = (0, fs_1.readdirSync)(`${path}/${category}`).filter((file) => file.endsWith('.js'));
            for (const command of commands) {
                const commandClass = require((0, path_1.join)(process.cwd(), `${path}/${category}/${command}`)).default;
                const handler = new commandClass(this);
                this.commands.set(handler.name, handler);
            }
        }
    }
    loadEvents(path = 'dist/src/events') {
        const events = (0, fs_1.readdirSync)(path).filter((file) => file.endsWith('.js'));
        for (const event of events) {
            const eventClass = require((0, path_1.join)(process.cwd(), `${path}/${event}`)).default;
            const handler = new eventClass(this);
            this.events.set(handler.name, handler);
            this.on(handler.name, handler.run);
        }
    }
    init(token) {
        super.login(this.config.token || token);
        return this;
    }
}
exports.default = Under;
function toApplicationCommand(collection) {
    return collection.map(s => { return { name: s.name, description: s.description, options: s.options }; });
}
