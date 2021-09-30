"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    async log(types, message) {
        if (types === 'SUCESS') {
            console.log(`[${types}] ${message}`);
        }
        if (types === 'ERROR') {
            console.log(`[${types}] ${message}`);
        }
        if (types === 'WARNING') {
            console.log(`[${types}] ${message}`);
        }
        if (types === 'INFO') {
            console.log(`[${types}] ${message}`);
        }
    }
}
exports.default = Logger;
