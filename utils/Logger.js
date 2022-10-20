const { createLogger, transports, format } = require('winston');

const customFormat = format.combine(format.timestamp(), format.printf(info => {
    return `${info.timestamp} - [ ${info.level.toUpperCase()} ] - ${info.message}`;
}))

const logger = createLogger({
    level: 'debug',
    format: customFormat,
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.Console({ level: "silly" }),
        new transports.File({ filename: "app.log" }),
    ]
});

module.exports = logger;