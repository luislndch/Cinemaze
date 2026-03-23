import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers['authorization'];

	const token = authHeader && authHeader.split(' ')[1];

	if(!token) return res.sendStatus(401).json({message: "Access Denied"});

	/* verify user */
	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
		if(err) return res.sendStatus(403);
		req.user = user;
		next();
	})
}
