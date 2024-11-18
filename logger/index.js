const pino = require("pino");
const pretty = require("pino-pretty");

const stream = pretty({
  translateTime: true,
  ignore: "pid,hostname",
});

const logger = pino({ level: "info" }, stream);

module.exports = logger;
