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
const Event_1 = __importDefault(require("../structures/Event"));
class InteractionCreate extends Event_1.default {
    constructor(client) {
        super(client, {
            name: 'interactionCreate'
        });
        this.run = (interaction) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (interaction.isCommand()) {
                const command = this.client.commands.get(interaction.commandName);
                const member = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(interaction.user.id));
                if ((command === null || command === void 0 ? void 0 : command.perms) && !(member === null || member === void 0 ? void 0 : member.permissions.has(command.perms, true))) {
                    return yield this.client.utils.quickError(interaction, `Você precisa das seguintes permissões: ${yield this.client.utils.missingPermissions(member, command.perms)}.`);
                }
                if ((command === null || command === void 0 ? void 0 : command.dev) && this.client.config.devs) {
                    this.client.utils.log('SUCESS', `${interaction.user.id}`);
                    const devId = this.client.config.devs.includes(interaction.user.id);
                    if (!devId)
                        return yield this.client.utils.quickError(interaction, `Este comando foi feito para pessoas especiais.`);
                }
                if (command)
                    yield command.run(interaction);
            }
        });
    }
}
exports.default = InteractionCreate;
