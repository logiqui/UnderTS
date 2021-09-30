"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../structures/Event"));
const box_console_1 = __importDefault(require("box-console"));
const chalk_1 = __importDefault(require("chalk"));
class InteractionCreate extends Event_1.default {
    constructor(client) {
        super(client, {
            name: 'ready'
        });
        this.run = (client, ...args) => {
            var _a, _b;
            (0, box_console_1.default)([
                `Eu sou ${chalk_1.default.yellow((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.tag)} e fui iniciado com o ID: ${chalk_1.default.yellow((_b = this.client.user) === null || _b === void 0 ? void 0 : _b.id)}`,
                `O Bot foi iniciado com ${chalk_1.default.yellow(this.client.users.cache.size)} usuarios em ${chalk_1.default.yellow(this.client.guilds.cache.size)} servidores`,
                `Foram carregados um total de ${chalk_1.default.yellow(this.client.commands.size)} comandos.`,
            ]);
            this.client.registryCommands();
        };
    }
}
exports.default = InteractionCreate;
