import {Pool} from "pg";
import { configDotenv } from "dotenv";

configDotenv();

console.log("connecting to postgres: "+process.env.DB_URL);
const pool = new Pool({
	connectionString: process.env.DB_URL,
	connectionTimeoutMillis: 5000,
});

pool.on("connect", (client) => console.log("Successfull connected to postgres! \nInfo: "+client));

pool.on("error", (err) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
})

const query = (text, params) => {
	return pool.query(text,params);
}

const getClient = () => {
	return pool.connect();
}


export default { query, getClient };
