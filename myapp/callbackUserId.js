import { execute, mapRows } from "./database.js";
import mysqlx from "@mysql/xdevapi";

const url = "mysqlx://app:pass@localhost:33060/social";
const client = mysqlx.getClient(url);


export const callbackGetUserId = async (req, res) => {
  try {
    const posts = await execute(client, async (session) => {
      const table = await session.getDefaultSchema().getTable("regsignin");
      const result = await table
        .select([
          "id",
          "email_address",
          "first_name",
          "last_name",
          "password_user",
          "created",
        ])
        .orderBy("id DESC")
        .execute();

      return mapRows(result);
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

export const callBackGetByIdUserId = async (req, res) => {
  try {
    const {email, pass} = req.params;

    const [post] = await execute(client, async (session) => {
      const table = await session.getDefaultSchema().getTable("regsignin");
      const result = await table
        .select([
          "id",
          "email_address",
          "first_name",
          "last_name",
          "password_user",
          "created",
        ])
        .where("email_address = :email AND password_user = :pass")
        .bind('email', email)
        .bind('pass', pass)
        .execute();

      return mapRows(result);
    });
    if (post === undefined) {
      return res.sendStatus(404)
    }

    res.json(post);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

export const callBackPostUserId = async (req, res,) => {
  try {
    const { email, fName, lName, pass } = req.body;

    const [post] = await execute(client, async (session) => {
      const table = await session.getDefaultSchema().getTable("regsignin");
      const insert = await table
        .insert("email_address", "first_name", "last_name", "password_user")
        .values(email, fName, lName, pass)
        .execute();

      const id = insert.getAutoIncrementValue();

      const result = await table
        .select([
          "id",
          "email_address",
          "first_name",
          "last_name",
          "password_user",
          "created",
        ])
        .where("id = :id")
        .bind("id", id)
        .execute();

      return mapRows(result);
    });

    if (post === undefined) {
      res.sendStatus(404);
      return;
    }

    res.json(post);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
};