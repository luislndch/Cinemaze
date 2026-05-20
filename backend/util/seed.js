import db from "../db/index.js";
import bcrypt from "bcrypt";

const seedDatabase = async () => {
	// getClient() returns a Promise, so we must await it

		const client = await db.getClient();

	try {
		await client.query("BEGIN");

		console.log("Creating tables...");

		// 1. Create Tables in correct order (referenced tables first)
		await client.query(`
			CREATE TABLE IF NOT EXISTS users (
				user_id SERIAL PRIMARY KEY,
				email VARCHAR(255) UNIQUE NOT NULL,
				password_hash TEXT NOT NULL,
				role VARCHAR(20) DEFAULT 'customer'
			)
		`);

		await client.query(`
			CREATE TABLE IF NOT EXISTS movies (
				movie_id SERIAL PRIMARY KEY,
				title VARCHAR(255) NOT NULL,
				description TEXT,
				release_year INTEGER,
				rental_rate DECIMAL(4,2) NOT NULL,
				stock_total INTEGER DEFAULT 1
			)
		`);

		await client.query(`
			CREATE TABLE IF NOT EXISTS inventory (
				inventory_id SERIAL PRIMARY KEY,
				movie_id INTEGER REFERENCES movies(movie_id) ON DELETE CASCADE,
				status VARCHAR(20) DEFAULT 'available'
			)
		`);

		await client.query(`
			CREATE TABLE IF NOT EXISTS rentals (
				rental_id SERIAL PRIMARY KEY,
				user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
				inventory_id INTEGER REFERENCES inventory(inventory_id) ON DELETE CASCADE,
				rental_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
				return_date TIMESTAMP WITH TIME ZONE,
				due_date TIMESTAMP WITH TIME ZONE NOT NULL
			)
		`);

		// 2. Clear existing data (Order matters because of Foreign Keys!)
		console.log("Clearing existing data...");
		await client.query('TRUNCATE rentals, inventory, movies, users RESTART IDENTITY CASCADE');

		// 3. Seed Users
		console.log("Seeding users...");
		const saltRounds = 10;
		const adminPass = await bcrypt.hash('admin123', saltRounds);
		const userPass = await bcrypt.hash('user123', saltRounds);

		await client.query(
			`INSERT INTO users (email, password_hash, role) VALUES 
			('admin@dvdrentals.com', $1, 'admin'),
			('customer@gmail.com', $2, 'customer')`,
			[adminPass, userPass]
		);

		// 4. Seed Movies
		console.log("Seeding movies...");
		const movieRes = await client.query(
			`INSERT INTO movies (title, description, release_year, rental_rate, stock_total) VALUES 
			('Inception', 'A thief who steals corporate secrets through use of dream-sharing.', 2010, 4.99, 2),
			('The Matrix', 'A computer hacker learns about the true nature of his reality.', 1999, 3.99, 1),
			('Interstellar', 'A team of explorers travel through a wormhole in space.', 2014, 4.99, 1)
			RETURNING movie_id, title, stock_total`
		);

		// 5. Seed Inventory (Creating physical copies based on stock_total)
		console.log("Seeding inventory...");
		for (const movie of movieRes.rows) {
			for (let i = 0; i < movie.stock_total; i++) {
				await client.query('INSERT INTO inventory (movie_id, status) VALUES ($1, $2)', [movie.movie_id, 'available']);
			}
		}

		await client.query("COMMIT");
		console.log("Supabase seeded successfully! 🌱");
	} catch (err) {
		await client.query("ROLLBACK");
		console.error("Error during seeding:", err);
		throw err;
	} finally {
		client.release();
		process.exit();
	}
};

seedDatabase();
