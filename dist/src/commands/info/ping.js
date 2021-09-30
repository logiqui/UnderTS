"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../structures/Command"));
class Ping extends Command_1.default {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'ping server ms v2',
            perms: ['SEND_MESSAGES', 'EMBED_LINKS']
        });
        this.run = (interaction) => __awaiter(this, void 0, void 0, function* () {
            interaction.reply({
                content: `O ping do bot é \`${this.client.ws.ping}\`ms.`,
                ephemeral: true
            });
        });
    }
}
exports.default = Ping;
