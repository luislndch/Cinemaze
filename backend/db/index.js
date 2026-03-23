import {Pool} from "pg";

const pool = new Pool({
	user: 'gg',
	host: process.env.PG_HOST,
	database: 'cinemaze',
	password: process.env.PG_PASS,
	port: process.env.PG_PORT,

})

pool.on("connect", (client) => console.log("Successfull connected to postgres! \nInfo: "+client));

const query = (text, params) => {
	return pool.query(text,params);
}

const getClient = () => {
	return pool.connect();
}


export default { query, getClient };
