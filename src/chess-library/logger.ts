
import pino from "pino";

var levels = {
    crit: 60,
    error: 50,
    warn: 40,
    notice: 30,
    info: 20,
    debug: 10,
};



const logger = pino({
    customLevels: levels,
    level: "debug", // Minimum level to be displayed when logging
    transport: {
        target: "pino-pretty"
    }
})

export { logger };
