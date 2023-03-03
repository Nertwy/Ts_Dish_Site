import { NextFunction, Request, Response } from "express";
import { Client, Pool } from "pg";
import { Dish } from '../../interfaces/Ingridient'
import { User } from "../../interfaces/user";



const postgreString = 'postgresql://postgres:123@localhost:5432/postgres'
const pool = new Pool({
    connectionString: postgreString,
});



async function insertDish(dish: Dish): Promise<void> {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryText = 'INSERT INTO dishes (name, id, cuisine, slug, url, ingredients, recipes) VALUES ($1, $2, $3, $4, $5, $6, $7)';
        const values = [dish.name, dish.id, dish.cuisine, dish.slug, dish.url, JSON.stringify(dish.ingredients), JSON.stringify(dish.recipes)];

        await client.query(queryText, values);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function createDishTable(): Promise<void> {
    const query = `
      CREATE TABLE IF NOT EXISTS dishes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cuisine VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        ingredients JSONB NOT NULL,
        recipes JSONB NOT NULL
      );
    `;

    try {
        const client = await pool.connect();
        await client.query(query);
        console.log('Dish table created successfully');
        client.release();
    } catch (error) {
        console.error('Error creating dish table: ', error);
    }
}

export async function checkEmailExists(email: string=""): Promise<boolean> {
    const client = await pool.connect();

    try {
        const query = {
            text: 'SELECT * FROM users WHERE email = $1',
            values: [email],
        };

        const result = await client.query(query);

        return result.rows.length > 0;
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    } finally {
        // await pool.end(); // release the connection
    }
}

async function getUserByEmail(email: string): Promise<User | null> {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (result.rows.length > 0) {
            const row = result.rows[0];
            const user: User = {
                id: row.id,
                name: row.name,
                email: row.email,
                password: row.password,
                confirmed: false,
                // role: Role.Admin
            };
            return user;
        } else {
            return null;
        }
    } catch (err: unknown) {
        if (typeof err === "string")
            console.error("Error:", err)
        else if (err instanceof Error)
            console.error("Error:", err.stack)
        else
            console.error("Unknown Error:", err);
        return null;
    } finally {
        client.release();
    }
}
async function storeTokens(userId: number, tokens: string): Promise<void> {
    const token = tokens;
    const tokenQuery = 'INSERT INTO tokens (user_id, access_token, refresh_token) VALUES ($1, $2, $3)';
    const tokenValues = [userId, token];

    try {
        await pool.query(tokenQuery, tokenValues);
    } catch (error) {
        console.error('Error storing tokens:', error);
        throw error;
    }
}
async function updateAccessToken(userId: number, token: string): Promise<void> {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const queryText = `
        UPDATE users
        SET access_token = $1
        WHERE user_id = $2
      `;
        const values = [token, userId];
        await client.query(queryText, values);

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Error updating access token: ${err}`);
        throw err;
    } finally {
        client.release();
    }
}
export async function insertUser(user: User): Promise<void> {
    const client = await pool.connect();
    const query = `
      INSERT INTO users (name, password, email, confirmed, role)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [user.name, user.password, user.email, user.confirmed, user.role];
    await client.query(query, values);
    client.release()
}
