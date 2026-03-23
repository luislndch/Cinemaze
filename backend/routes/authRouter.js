import { Router } from "express";
import db from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req, res) => {
	const {email, password} = req.body;

	const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

	if(user.rowCount > 0){
		const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);

		if(validPassword){

			const {email, role, user_id} = user.rows;

			jwt.sign(
				{
					userId: user_id,
					role: role
				},
				process.env.JWT_SECRET,
				{expiresIn: '2h'}
			);
			res.json({
				token,
				user: {email, role}
			})
		}
	}
})
