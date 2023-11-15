"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var pino_1 = require("pino");
var levels = {
    crit: 60,
    error: 50,
    warn: 40,
    notice: 30,
    info: 20,
    debug: 10,
};
exports.logger = (0, pino_1.default)({
    customLevels: levels,
    level: "debug", // Minimum level to be displayed when logging
});
