import { NextFunction, Request, Response } from "express";
import { Client, Pool, QueryResult } from "pg";
import {
  ClientDish,
  Comment,
  Dish,
  DishLikes,
} from "../../interfaces/Ingridient";
import { User } from "../../interfaces/user";
import ApiErrors from "./errors";
import food from "./Database_of_things/FoodDB copy.json";
import { Dishes, PrismaClient, Users } from "@prisma/client";
import { env } from "process";
interface CustomRequest extends Request {
  data?: any; // Define the 'data' property as optional and of type 'any'
}

const postgreString = process.env.DATABASESTRING;
//Refactore code to use Prisma fully without pg
const prisma = new PrismaClient();

const pool = new Pool({
  connectionString: postgreString,
});

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
  return;
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
AFTER INSERT ON "Dishes"
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
            UPDATE "Dishes" SET likes = likes - 1 WHERE id = OLD.dish_id;
        ELSE
            UPDATE "Dishes" SET likes = likes + 1 WHERE id = NEW.dish_id;
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

export async function checkEmailExists(email: string = ""): Promise<boolean> {
  const result = (await prisma.users.findFirst({
    where: {
      email,
    },
  }))
    ? true
    : false;
  return result;
}

export async function getUserByEmail(email: string): Promise<Users | null> {
  const result = await prisma.users.findFirst({
    where: {
      email,
    },
  });
  if (!result) return null;

  return result;
}

export async function checkIfLoginCorrect(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  let user: User = req.body;
  const result = await prisma.users.findFirst({
    where: {
      email: user.email,
      password: user.password,
    },
  });
  if (!result) next(ApiErrors.AlreadyExists("No user found"));
  req.body = result;
  next();
}
export async function storeRefreshToken(
  user: Users,
  token: string
): Promise<void> {
  // const tokenValues = [token, user.id];
  await prisma.refreshToken.create({
    data: {
      name: user.name,
      user_id: user.id,
    },
  });
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

export async function getDishLikes(index: number) {
  const dish = await prisma.dishes.findMany({});
}
export async function checkRefreshToken(token: string) {}
export async function getUserLikes(id: number): Promise<DishLikes[]> {
  const result = await prisma.dishLikes.findMany({
    where: {
      user_id: id,
    },
  });

  return result;
}
export async function insertLike(
  dish_id: number,
  user_id: number
): Promise<void> {
  await prisma.dishLikes.create({
    data: {
      dish_id,
      user_id,
    },
  });
}
export async function deleteLike(
  dish_id: number,
  user_id: number
): Promise<void> {
  await prisma.dishLikes.deleteMany({
    where: {
      dish_id,
      user_id,
    },
  });
}
export async function toggleLike(
  dish_id: number,
  user_id: number
): Promise<void> {
  const result = await prisma.dishLikes.findFirst({
    where: {
      dish_id,
      user_id,
    },
  });
  if (result) {
    await prisma.dishLikes.deleteMany({
      where: {
        dish_id,
        user_id,
      },
    });
  } else {
    await prisma.dishLikes.create({
      data: {
        dish_id,
        user_id,
      },
    });
  }
}

async function storeAccessToken(user: User, token: string) {
  await prisma.accessToken.create({
    data: {
      name: user.name,
      user_id: user.id,
    },
  });
}
async function updateAccessToken(
  user_id: number,
  token: string
): Promise<void> {
  await prisma.accessToken.updateMany({
    where: {
      user_id,
    },
    data: {
      name: token,
    },
  });
}
export async function insertUser(user: User): Promise<void> {
  await prisma.users.create({
    data: {
      name: user.name,
      password: user.password,
      email: user.email,
    },
  });
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

export async function getDishById(id: number): Promise<Dishes | null> {
  const result = await prisma.dishes.findFirst({
    where: {
      id,
    },
  });
  return result
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
// TriggerForLikes();
// TriggerForPosts();
