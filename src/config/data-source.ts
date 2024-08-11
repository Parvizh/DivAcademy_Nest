import { DataSource } from "typeorm";
import * as env from "dotenv"
env.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: true,
    synchronize: false,
    migrations: ['src/migrations/*{.js,.ts}'],
    entities: ['src/**/*.entity{.js,.ts}']
})