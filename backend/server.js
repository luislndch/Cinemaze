import db from "./db/index.js";
import express from "express";
import { configDotenv } from "dotenv";
import api from "./routes/api.js";

configDotenv();
db.getClient();

const app = express();
app.use(express.json());
app.use("/auth",authRouter);
app.use("/api",api);
app.use((err, req, res, next) => {
	res.json(
		{error: "Internal Server Error"}
	);
})

app.listen(process.env.PORT, process.env.HOST,() => {
	console.log(`listening to ${process.env.PORT}`);
})





