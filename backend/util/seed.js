import {bcrypt} from "bcrypt"; 
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {rejectionUnauthorized: false}
});

async function seedSupabase(){
	const client = await pool.connect();
	try{
		console.log("Connection to Supabase...");
		await client.query("BEGIN"); //Use a transaction for safety

		//Re-run your tables and mock data here...
		await client.query(
			"TRUNCATE rentals, inventory, movies, "+
			"movies, users RESTART IDENTIFY CASCADE"
		);

		await client.query("COMMIT");
		console.log("Supabase Seeded! (RocketEmoji)")
	}catch(error){
		conosle.error(error);
		await client.query("ROLLBACK");
	}finally{
		client.release();
	}
}

const seedDatabase = async () => {
	try {
		// 1. Clear existing data (Order matters because of Foreign Keys!)
		await db.query('TRUNCATE rentals, inventory, movies, users RESTART IDENTITY CASCADE');

		// 2. Seed Users (1 Admin, 1 Customer)
		const saltRounds = 10;
		const adminPass = await bcrypt.hash('admin123', saltRounds);
		const userPass = await bcrypt.hash('user123', saltRounds);

		await db.query(
			`INSERT INTO users (email, password_hash, role) VALUES 
('admin@dvdrentals.com', $1, 'admin'),
('customer@gmail.com', $2, 'customer')`,
			[adminPass, userPass]
		);

		// 3. Seed Movies
		const movieRes = await db.query(
			`INSERT INTO movies (title, description, release_year, rental_rate, stock_total) VALUES 
('Inception', 'A thief who steals corporate secrets through use of dream-sharing.', 2010, 4.99, 2),
('The Matrix', 'A computer hacker learns about the true nature of his reality.', 1999, 3.99, 1),
('Interstellar', 'A team of explorers travel through a wormhole in space.', 2014, 4.99, 1)
RETURNING movie_id, title`
		);

		// 4. Seed Inventory (Creating physical copies based on stock_total)
		console.log(typeof movieRes);
		for (const movie of movieRes.rows) {
			// Find how many copies we need for this movie
			const count = movie.title === 'Inception' ? 2 : 1;
			for (let i = 0; i < count; i++) {
				await db.query('INSERT INTO inventory (movie_id, status) VALUES ($1, $2)', [movie.movie_id, 'available']);
			}
		}
		console.log("Database seeded successfully! 🌱");
		process.exit();
	} catch (err) {
		console.error("Seeding failed:", err);
		process.exit(1);
	}
};

seedDatabase();
