import z from "zod";

/* Schemas for creating a new movie */
export const MovieSchema = z.object({
	title: z.string().min(1, "Title is required").max(255),
	description: z.string().optional(),
	release_year: z.number().int().min(1888).max(new Date().getFullYear()),
	rental_rate: z.number().positive(),
	stock_total: z.number.int().nonnegative().default(1),
});

/* Schema for user registration */
export const RegisterSchema = z.object({
	email: z.email("Invalid email format"),
	passowrd: z.string().min(8, "Password must be at least 8 characters"),
	role: z.enum(['customer', 'admin']).default('customner'),
});

/* Schema for creating a Rental */
export const RentalSchema = z.object({
	user_id: znumber().int(),
	inventory_id: z.number().int(),
	due_date: z.datetime(), // Ensures valid ISO string
});


