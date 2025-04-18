import { Sequelize } from "sequelize"
import logger from "./logger";

require("dotenv").config();

const connectionUrl = process.env.POSTGRES_DB
const db = new Sequelize(connectionUrl, { dialect: 'postgres', logging: false });

testSequelize();

async function testSequelize() {
    try {
        await db.authenticate();
        logger.info('Connection has been established successfully.');
    } catch (error) {
        logger.fatal('Unable to connect to the database:', error);
    }

}

export { testSequelize };
export default db;