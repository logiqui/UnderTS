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
const moment_1 = __importDefault(require("moment"));
const chalk_1 = __importDefault(require("chalk"));
class Utils {
    quickError(interaction, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield interaction.reply({ content: `${message}`, ephemeral: true });
            }
            catch (e) {
                yield interaction.followUp({ content: `${message}`, ephemeral: true }).catch(() => { });
            }
        });
    }
    quickSuccess(interaction, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield interaction.reply({ content: `${message}` });
            }
            catch (e) {
                yield interaction.followUp({ content: `${message}` }).catch(() => { });
            }
        });
    }
    log(types, message) {
        if (types === 'SUCESS') {
            console.log(`${chalk_1.default.gray(`[` + (0, moment_1.default)().format('HH:mm:ss') + `]`)} ${chalk_1.default.green(types)}: ${message}`);
        }
        if (types === 'ERROR') {
            console.log(`${chalk_1.default.gray(`[` + (0, moment_1.default)().format('HH:mm:ss') + `]`)} ${chalk_1.default.red(types)}: ${message}`);
        }
        if (types === 'WARNING') {
            console.log(`${chalk_1.default.gray(`[` + (0, moment_1.default)().format('HH:mm:ss') + `]`)} ${chalk_1.default.yellow(types)}: ${message}`);
        }
        if (types === 'INFO') {
            console.log(`${chalk_1.default.gray(`[` + (0, moment_1.default)().format('HH:mm:ss') + `]`)} ${chalk_1.default.blue(types)}: ${message}`);
        }
    }
    missingPermissions(member, perms) {
        return __awaiter(this, void 0, void 0, function* () {
            const missingPerms = member.permissions.missing(perms)
                .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``);
            return missingPerms.length > 1 ?
                `${missingPerms.slice(0, -1).join(',  ')} and ${missingPerms.slice(-1)[0]}` :
                missingPerms[0];
        });
    }
}
exports.default = Utils;
