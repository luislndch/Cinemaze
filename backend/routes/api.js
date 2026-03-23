import { Router } from "express";
import db from "../db/index.js";
import { validate } from "../middlewares/validator.js";
import { MovieSchema } from "../validation/schemas.js";

const router = Router();

router.get("/", (req, res) => {
	return res.status(200).json({
		messsage: "welcome to the api endpoint!"
	});
});

router.get("/movies", validate(MovieSchema) ,async (req, res, next) => {
	try {
		const queryRes = await db.query("SELECT * FROM movies");
		res.status(200);
		return res.json(queryRes.rows);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

export default router;
