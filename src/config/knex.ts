import knex from "knex";
// @ts-ignore
import knexConfig from "../../knexfile.cjs";

const environment = process.env.NODE_ENV || "development";
const config = knexConfig[environment];

const db = knex(config);

export default db; 