require("dotenv").config();

export const jwtsecret = process.env.JWT_SECRET;
export const logLevel = process.env.LOG_LEVEL || "info";
export const fileLogLever = process.env.FILE_LOG_LEVEL || "info";
export const destinationLogFile = "./logs/" + (process.env.DESTINATION_LOG_FILE || "app") + `-${new Date(Date.now()).toISOString()}` + ".log";