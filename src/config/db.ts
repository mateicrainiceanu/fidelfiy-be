import { Sequelize } from "sequelize"
import logger from "./logger";
import {connectionString} from "./global";

if (!connectionString) {
    throw new Error('No connection connection string for env attribute POSTGRES_DB provided');
}

const db = new Sequelize(connectionString, { dialect: 'postgres', logging: false });

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