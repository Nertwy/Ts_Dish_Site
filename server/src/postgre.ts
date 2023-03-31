import { NextFunction, Request, Response } from "express";
import { Client, Pool, QueryResult } from "pg";
import { ClientDish, Comment, Dish } from "../../interfaces/Ingridient";
import { User } from "../../interfaces/user";
import ApiErrors from "./errors";
import food from "./Database_of_things/FoodDB copy.json";
import { DishLikes, Prisma, PrismaClient } from "@prisma/client";
interface CustomRequest extends Request {
  data?: any; // Define the 'data' property as optional and of type 'any'
}

const postgreString = "postgresql://postgres:123@localhost:5432/postgres";
//Refactore code to use Prisma fully without pg
const prisma = new PrismaClient();

const pool = new Pool({
  connectionString: postgreString,
});

async function createPostTable() {
  const client = await pool.connect();
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`;
  try {
    await client.query(createTableQuery);
    console.log("Table Posts created!");
  } catch (error) {
    console.error('Error creating table "Posts":', error);
  }
}
async function createCommentsTable() {
  const client = await pool.connect();
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    user_id INTEGER REFERENCES users(id)
  );`;
  try {
    await client.query(createTableQuery);
    console.log("Table Comments created!");
  } catch (error) {
    console.error('Error creating table "comments":', error);
  }
}
export async function createUserTable(): Promise<void> {
  const client = await pool.connect();

  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "users" (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        confirmed BOOLEAN DEFAULT FALSE,
        tokens JSONB,
        role TEXT
      );
    `;

  try {
    await client.query(createTableQuery);
    console.log('Table "users" created successfully.');
  } catch (err) {
    console.error('Error creating table "users":', err);
  } finally {
    client.release();
  }
}

export async function insertDish(dish: ClientDish, url: string): Promise<void> {
  await prisma.dishes.create({
    data: {
      cuisine: dish.cuisine,
      ingredients: JSON.stringify(dish.ingredients),
      name: dish.name,
      recipes: JSON.stringify(dish.recipes),
      slug: dish.slug,
      url: url,
    },
  });
  return
}
async function TriggerForPosts() {
  const client = await pool.connect();
  try {
    await client.query(`
    CREATE OR REPLACE FUNCTION create_post_for_dish()
  RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO posts (title, body)
  VALUES ('New Dish Added', CONCAT('A new dish has been added: ', NEW.name));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_post_for_dish_trigger
AFTER INSERT ON dishes
FOR EACH ROW
EXECUTE FUNCTION create_post_for_dish();
  `);
  } catch (error) {
    console.log(error);
  }
}
async function push100Dishes() {
  food.forEach(async (elem: any, index) => {
    let data: ClientDish = {
      cuisine: elem.cuisine,
      ingredients: elem.Ingridiences,
      name: elem.name,
      recipes: elem.recipes!,
      slug: elem.slug,
      like: false,
    };
    await insertDish(data, elem.url);
  });
  console.log("dishes created");
}
async function TriggerForLikes() {
  const client = await pool.connect();
  try {
    await client.query(`
    CREATE OR REPLACE FUNCTION update_dish_likes()
    RETURNS TRIGGER AS $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            UPDATE dishes SET likes = likes - 1 WHERE id = OLD.dish_id;
        ELSE
            UPDATE dishes SET likes = likes + 1 WHERE id = NEW.dish_id;
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER update_dish_likes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON "DishLikes"
    FOR EACH ROW
    EXECUTE FUNCTION update_dish_likes();
  `);
  } catch (error) {
    console.log(error);
  }
}
async function createDishTable(): Promise<void> {
  const checkQuery = `
      SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'dishes';
    `;

  const createQuery = `
      CREATE TABLE IF NOT EXISTS dishes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        cuisine VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        url VARCHAR(255) NOT NULL,
        ingredients JSONB NOT NULL,
        recipes JSONB NOT NULL,
        likes INTEGER NOT NULL DEFAULT 0
      );
    `;

  try {
    const client = await pool.connect();
    const { rows } = await client.query(checkQuery);
    if (rows[0].count === "0") {
      await client.query(createQuery);
    } else {
      await push100Dishes()
    }
    client.release();
  } catch (error) {
    console.error("Error creating dish table: ", error);
  }
}

export async function checkEmailExists(email: string = ""): Promise<boolean> {
  const client = await pool.connect();

  try {
    const query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    const result = await client.query(query);

    return result.rows.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  } finally {
    // await pool.end(); // release the connection
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const client = await pool.connect();
  try {
    const result = await client.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
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
    if (typeof err === "string") console.error("Error:", err);
    else if (err instanceof Error) console.error("Error:", err.stack);
    else console.error("Unknown Error:", err);
    return null;
  } finally {
    client.release();
  }
}

export async function checkIfLoginCorrect(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  let user: User = req.body;
  // let pass = hashUserPass(user.password);
  const query = `SELECT * FROM users 
    WHERE email = $1 AND  password = $2;`;
  const tokenValues = [user.email, user.password];
  try {
    const result = await pool.query(query, tokenValues);

    if (result.rows.length <= 0) next(ApiErrors.AlreadyExists("No user found"));
    req.body = result.rows[0];
    next();
  } catch (error) {
    console.error("Error couldnt check the login!");
    throw error;
  }
}
export async function createRefreshTokenTable(): Promise<void> {
  const client = await pool.connect();
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "RefreshToken" (
        id SERIAL PRIMARY KEY,
        Name TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;

  try {
    await client.query(createTableQuery);
    console.log('Table "RefreshToken" created successfully.');
  } catch (err) {
    console.error('Error creating table "RefreshToken":', err);
  } finally {
    client.release();
  }
}
export async function storeRefreshToken(
  user: User,
  token: string
): Promise<void> {
  const tokenValues = [token, user.id];
  // console.log("USER ID = ", user.id);

  const tokenQuery = `INSERT INTO "RefreshToken" ("name",user_id) VALUES ($1, $2)`;
  try {
    await pool.query(tokenQuery, tokenValues);
  } catch (error) {
    console.error("Error storing tokens:", error);
    throw error;
  }
}
export async function deleteRefreshToken(token: string): Promise<void> {
  try {
    const result = await prisma.refreshToken.findFirst({
      where: {
        name: token,
      },
    });

    if (result) {
      await prisma.refreshToken.delete({
        where: {
          id: result.id,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
}
async function createLikesTable() {
  const client = await pool.connect();
  const createTableQuery = `CREATE TABLE IF NOT EXISTS "DishLikes"(
        id SERIAL PRIMARY KEY,
        dish_id INTEGER NOT NULL REFERENCES "dishes"(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;
  try {
    await client.query(createTableQuery);
    console.log("Table DishLikes Created");
  } catch (err) {
    console.error("Error creating table 'DishLikes' ", err);
  } finally {
    client.release();
  }
}
export async function getDishLikes(index: number) {
  const dish = await prisma.dishes.findMany({});
}
export async function checkRefreshToken(token: string) {}
export async function getUserLikes(id: number) {
  const client = await pool.connect();
  const value = [id.toString()];
  const query = `SELECT * FROM "DishLikes" WHERE user_id=$1`;
  try {
    const result: QueryResult<DishLikes> = await pool.query(query, value);
    return result.rows;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function insertLike(
  dish_id: number,
  user_id: number
): Promise<void> {
  const client = await pool.connect();

  try {
    const insertQuery = `
      INSERT INTO "DishLikes" (dish_id, user_id)
      VALUES ($1, $2)
    `;
    const values = [dish_id, user_id];
    await client.query(insertQuery, values);
    // console.log('New like inserted successfully');
  } catch (err) {
    console.error("Error inserting like:", err);
  } finally {
    client.release();
  }
}
export async function deleteLike(
  dish_id: number,
  user_id: number
): Promise<void> {
  const client = await pool.connect();

  try {
    const deleteQuery = `
      DELETE FROM "DishLikes"
      WHERE dish_id = $1 AND user_id = $2
    `;
    const values = [dish_id, user_id];
    await client.query(deleteQuery, values);
    // console.log('Like deleted successfully');
  } catch (err) {
    console.error("Error deleting like:", err);
  } finally {
    client.release();
  }
}
export async function toggleLike(
  dishId: number,
  userId: number
): Promise<void> {
  const client = await pool.connect();

  try {
    const checkQuery = `
      SELECT * FROM "DishLikes"
      WHERE dish_id = $1 AND user_id = $2
    `;
    const checkValues = [dishId, userId];
    const checkResult = await client.query(checkQuery, checkValues);

    if (checkResult.rows.length > 0) {
      // If record exists, delete it
      const deleteQuery = `
        DELETE FROM "DishLikes"
        WHERE dish_id = $1 AND user_id = $2
      `;
      const deleteValues = [dishId, userId];
      await client.query(deleteQuery, deleteValues);
      // console.log('Like deleted successfully');
    } else {
      // If record doesn't exist, insert it
      const insertQuery = `
        INSERT INTO "DishLikes" (dish_id, user_id)
        VALUES ($1, $2)
      `;
      const insertValues = [dishId, userId];
      await client.query(insertQuery, insertValues);
      // console.log('New like inserted successfully');
    }
  } catch (err) {
    console.error("Error toggling like:", err);
  } finally {
    client.release();
  }
}
export async function createAccessTokenTable(): Promise<void> {
  const client = await pool.connect();

  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "AccessToken" (
        id SERIAL PRIMARY KEY,
        Name TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;

  try {
    await client.query(createTableQuery);
    console.log('Table "AccessToken" created successfully.');
  } catch (err) {
    console.error('Error creating table "AccessToken":', err);
  } finally {
    client.release();
  }
}
async function storeAccessToken(user: User, token: string) {
  const tokenValues = [token, user.id];
  const tokenQuery = `INSERT INTO "AccessToken" ("Name",user_id) VALUES ($1, $2)`;
  try {
    await pool.query(tokenQuery, tokenValues);
  } catch (error) {
    console.error("Error storing tokens:", error);
    throw error;
  }
}
async function updateAccessToken(userId: number, token: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const queryText = `
        UPDATE "AccessToken"
        SET Name = $1
        WHERE user_id = $2
      `;
    const values = [token, userId];
    await client.query(queryText, values);

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
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
  const values = [
    user.name,
    user.password,
    user.email,
    user.confirmed,
    user.role,
  ];
  await client.query(query, values);
  client.release();
}
//DEBUG
export async function getDishByIndex(index: number) {
  const dish = await prisma.dishes.findFirst({
    skip: index,
    take: 1,
  });

  const res: Dish = {
    id: dish?.id,
    cuisine: dish?.cuisine!,
    ingredients: JSON.parse(dish?.ingredients?.toString()!),
    recipes: JSON.parse(dish?.recipes?.toString()!),
    name: dish?.name!,
    slug: dish?.slug!,
    url: dish?.url,
    likes: Number(dish?.likes),
  };
  return res;
}

export async function getDishById(id: number): Promise<Dish> {
  const client = await pool.connect();
  const query = `SELECT * FROM dishes WHERE id=$1`;
  const values = [id];
  let dish = await client.query<Dish>(query, values);
  client.release();
  return dish.rows[0];
}
export async function getAllCommentsFromPost(postId: number) {
  try {
    const res = await prisma.comments.findMany({
      where: {
        post_id: postId,
      },
    });
    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function addComment(comment: Comment, user_id: number) {
  try {
    const res = await prisma.comments.create({
      data: {
        body: comment.text,
        post_id: comment.postId,
        user_id: user_id,
      },
    });
  } catch (error) {
    console.error(error);
  }
}
// push100Dishes()
// createDishTable();
// createUserTable();
// createRefreshTokenTable();
// createAccessTokenTable();
// createLikesTable();
// createPostTable();
// TriggerForPosts()
// createCommentsTable();
// TriggerForLikes();
