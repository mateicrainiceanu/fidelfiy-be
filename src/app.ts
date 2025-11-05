import express from 'express';

import registerRoute from './routes/auth/registerRoute';
import bodyParser from 'body-parser';
import loginRoute from './routes/auth/loginRoute';
import {connectDb} from './config/db';
import cors from 'cors';
import logger from './config/logger';
import handleErrors from "./utils/errorHandler";
import userRoute from "./routes/auth/userRoute";
import businessRoute from "./routes/auth/businessRoute";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());


app.use("/api/v1/", registerRoute, loginRoute, userRoute);
app.use("/api/v1/", businessRoute);

app.use(handleErrors);

app.listen(port, async () => {

    // logger.fatal("Fatal message");
    // logger.error("Error message");
    // logger.warn("Warn message");
    // logger.info("Info message");
    // logger.debug("Debug message");
    // logger.trace("Trace message");

    await connectDb();
    logger.info("Db is connected");

    logger.info(`Express is listening at http://localhost:${port}`);
});
