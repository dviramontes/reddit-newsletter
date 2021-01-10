import { Request, Response } from "express";
import { fetchPosts } from "./reddit";
import { pool } from "./db";
import { isEmpty } from "lodash";
import { upsertSubreddit } from "./controllers/subreddit";
import { upsertNewsletter } from "./controllers/newsletter";

export const pingHandler = (req: Request, res: Response) => {
  return res.send("pong");
};

export const getAllSubscriptionsHandler = async (
  req: Request,
  res: Response
) => {
  const client = await pool.connect();
  const allSubsResponse = await client.query(`
    SELECT * FROM newsletters as n INNER JOIN users AS u ON (u.id=n.user_id)
  `);

  res.status(200).json({ subs: allSubsResponse.rows || [] });

  await client.release();
};

export const getAllUsersHandler = async (req: Request, res: Response) => {
  const client = await pool.connect();
  const allUsersResponse = await client.query("SELECT * FROM users");

  res.status(200).json({ users: allUsersResponse.rows || [] });

  await client.release();
};

export const getUserHandler = async (req: Request, res: Response) => {
  const client = await pool.connect();
  const { id } = req.params;
  const userResponse = await client.query("SELECT * FROM users WHERE id = $1", [
    id,
  ]);

  if (userResponse.rowCount > 0) {
    res.status(200).json({ user: userResponse.rows[0] || {} });
  } else {
    res.status(404).send(`user with id: ${id} not found`);
  }

  await client.release();
};

export const createNewUserHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.body)) {
    res.status(400).send("missing request body");
    return;
  }

  const { fullname, email, time_preference } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const prepareStatement =
      "INSERT INTO users(fullname, email, time_preference) VALUES ($1,$2,$3) RETURNING *";
    const createUserResponse = await client.query(prepareStatement, [
      fullname,
      email,
      time_preference,
    ]);

    res.status(200).json({ user: createUserResponse.rows[0] });

    await client.query("COMMIT");
  } catch (err) {
    console.log({ err });

    res.status(500).send(err.detail);

    await client.query("ROLLBACK");
  } finally {
    await client.release();
  }
};

export const patchUserHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.params) || isEmpty(req.body)) {
    res.status(400).send("missing :id url param or request body");
    return;
  }

  const { id } = req.params;
  const { fullname, email, time_preference, active } = req.body;
  const client = await pool.connect();

  try {
    const prepareStatement = `
      INSERT INTO users(id, fullname, email, time_preference) VALUES ($1,$2,$3,$4)
      ON CONFLICT (id) DO UPDATE SET updated_at = now(),
         fullname        = $2,
         email           = $3,
         time_preference = $4,
         active          = $5
      RETURNING *`;
    const createUserResponse = await client.query(prepareStatement, [
      id,
      fullname,
      email,
      time_preference,
      active,
    ]);

    res.status(200).json({ user: createUserResponse.rows[0] });
  } catch (err) {
    console.log({ err });

    res.status(500).send(err.detail);
  }
  await client.release();
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.params)) {
    res.status(400).send("missing :id url param");
    return;
  }

  const client = await pool.connect();
  const { id } = req.params;

  const deleteResponse = await client.query("DELETE from users WHERE id = $1", [
    id,
  ]);

  if (deleteResponse.rowCount > 0) {
    res
      .status(200)
      .json({ message: `successfully deleted user with id: ${id}` });
  } else {
    res.status(404).send(`user with id: ${id} not found`);
  }

  await client.release();
};

export const createSubscriptionHandler = async (
  req: Request,
  res: Response
) => {
  if (isEmpty(req.params) || isEmpty(req.body)) {
    res.status(400).send("missing :id url param");
    return;
  }

  const { id: user_id } = req.params;
  const { subreddit: name, url } = req.body;
  const subredditResult = await upsertSubreddit(name, url);

  if (subredditResult.isErr()) {
    res.status(500).send(subredditResult.error);
    return;
  }

  if (subredditResult.isOk()) {
    const subredditRow = subredditResult.value;
    const newsletterResult = await upsertNewsletter(+user_id, subredditRow.id);

    if (newsletterResult.isOk()) {
      res.status(200).json({ newsletter: newsletterResult.value });
      return;
    }

    if (newsletterResult.isErr()) {
      res.status(500).send(newsletterResult.error);
      return;
    }
  }
};
