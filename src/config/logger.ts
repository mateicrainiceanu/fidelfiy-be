import pino from 'pino';
import {enableFileLogging, fileLogLevel, logLevel} from './global';
import { destinationLogFile } from './global';
import fs from 'fs';
import path from 'path';

const logDirectory = path.dirname(destinationLogFile);
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

if (!fs.existsSync(destinationLogFile)) {
    fs.writeFileSync(destinationLogFile, '', { flag: 'w' });
}

const targets: any[] = [ {
    level: logLevel,
    target: 'pino-pretty',
    options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
    },
}];

if (enableFileLogging) {
    targets.push({
        level: fileLogLevel,
        target: 'pino/file',
        options: { destination: destinationLogFile }
    });
}

const logger = pino({
    level: logLevel,
    transport: {
        targets: targets
    }
});

export default logger;