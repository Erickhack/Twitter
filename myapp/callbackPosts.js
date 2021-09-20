import { execute, mapRows } from "./database.js";
import mysqlx from "@mysql/xdevapi";

const url = "mysqlx://app:pass@localhost:33060/social";
const client = mysqlx.getClient(url);

export const callBackGet = async (req, res) => {
  try {
    const posts = await execute(client, async (session) => {
      const table = await session.getDefaultSchema().getTable("posts");
      const result = await table
        .select([
          "id",
          "UserName",
          "media",
          "paragraph",
          "bookMark",
          "removed",
          "created",
        ])
        .where("removed != true")
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

export const callBackGetById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || !Number.isFinite(id)) {
      res.sendStatus(400);
      return;
    }

    const [post] = await execute(client, async (session) => {
      const table = await session.getDefaultSchema().getTable("posts");
      const result = await table
        .select([
          "id",
          "UserName",
          "media",
          "paragraph",
          "bookMark",
          "removed",
          "created",
        ])
        .where("id = :id AND removed != true")
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
    res.sendStatus(500);
  }
};

export const callBackPost = async (req, res) => {
  try {
    const { UserName, media, paragraph } = req.body;

    const [post] = await execute(client, async (session) => {
      const table = await session.getDefaultSchema().getTable("posts");
      const insert = await table
        .insert("UserName", "media", "paragraph")
        .values(UserName, media, paragraph)
        .execute();
      const id = insert.getAutoIncrementValue();

      const result = await table
        .select([
          "id",
          "UserName",
          "media",
          "paragraph",
          "bookMark",
          "removed",
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
    res.sendStatus(500);
  }
};

export const callbackPut = async (req, res) => {
  try {
    const { id, media, paragraph } = req.body;

    const posts = await execute(client, async (session) => {
      const table = await session.getDefaultSchema().getTable("posts");
      await table
        .update()
        .set("media", media)
        .set("paragraph", paragraph)
        .where("id = :id AND removed != true")
        .bind("id", id)
        .execute();
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};

export const callbackDelete = async (req, res) => {
  try {
    const { id } = req.body;

    const posts = await execute(client, async (session) => {
      const table = await session.getDefaultSchema().getTable("posts");
      await table
        .update()
        .set("removed", 1)
        .where("id = :id AND removed != true")
        .bind("id", id)
        .execute();
    });
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
};
