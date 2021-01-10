import { Request, Response } from "express";
import { fetchPosts } from "./reddit";
import { pool } from "./db";
import { isEmpty } from "lodash";

export const pingHandler = (req: Request, res: Response) => {
  return res.send("pong");
};

export const apiHandler = async (req: Request, res: Response) => {
  const result = await fetchPosts("worldnews");

  if (result.isOk()) {
    console.log(result.value);
  }

  if (result.isErr()) {
    console.log(result.error);
  }

  return res.send({});
};

export const getAllSubscriptionsHandler = async (req: Request, res: Response) => {
  const client = await pool.connect();
  const allSubsResponse = await client.query(`
    SELECT * FROM newsletters as n INNER JOIN users AS u ON (u.id=n.user_id)
  `);

  res.json({
    status: 200,
    subs: allSubsResponse.rows || [],
  });

  await client.release();
};


export const getAllUsersHandler = async (req: Request, res: Response) => {
  const client = await pool.connect();
  const allUsersResponse = await client.query("SELECT * FROM users");

  res.json({
    status: 200,
    users: allUsersResponse.rows || [],
  });

  await client.release();
};

export const getUserHandler = async (req: Request, res: Response) => {
  const client = await pool.connect();
  const { id } = req.params;
  const userResponse = await client.query("SELECT * FROM users WHERE id = $1", [
    id,
  ]);

  if (userResponse.rowCount > 0) {
    res.json({
      status: 200,
      user: userResponse.rows[0] || {},
    });
  } else {
    res.json({
      status: 404,
      message: `user with id: ${id} not found`,
    });
  }

  await client.release();
};

export const createNewUserHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.body)) {
    res.send({
      status: 400,
      message: "missing request body",
    });
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

    res.json({
      status: 200,
      user: createUserResponse.rows[0],
    });

    await client.query("COMMIT");
  } catch (err) {
    console.log({ err });

    res.json({
      status: 500,
      message: err.detail,
    });

    await client.query("ROLLBACK");
  } finally {
    await client.release();
  }
};

export const patchUserHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.params) || isEmpty(req.body)) {
    res.send({
      status: 400,
      message: "missing :id url param or request body",
    });
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

    res.json({
      status: 200,
      user: createUserResponse.rows[0],
    });
  } catch (err) {
    console.log({ err });

    res.json({
      status: 500,
      message: err.detail,
    });
  }
  await client.release();
};

export const deleteUserHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.params)) {
    res.send({
      status: 400,
      message: "missing :id url param",
    });
    return;
  }

  const client = await pool.connect();
  const { id } = req.params;

  const deleteResponse = await client.query("DELETE from users WHERE id = $1", [
    id,
  ]);

  if (deleteResponse.rowCount > 0) {
    res.json({
      status: 200,
      message: `successfully deleted user with id: ${id}`,
    });
  } else {
    res.json({
      status: 404,
      message: `user with id: ${id} not found`,
    });
  }

  await client.release();
};

export const createSubscriptionHandler = async (
  req: Request,
  res: Response
) => {
  if (isEmpty(req.params) || isEmpty(req.body)) {
    res.send({
      status: 400,
      message: "missing :id url param or request body",
    });
    return;
  }

  const { id: user_id } = req.params;
  const { subreddit, url, top } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const prepareStatement =
      "INSERT INTO newsletters(user_id, subreddit, url, top) VALUES ($1,$2,$3,$4) RETURNING *";
    const createNewsLetterResponse = await client.query(prepareStatement, [
      user_id,
      subreddit,
      url,
      JSON.stringify(top),
    ]);

    res.json({
      status: 200,
      user: createNewsLetterResponse.rows[0],
    });

    await client.query("COMMIT");
  } catch (err) {
    console.log({ err });

    res.json({
      status: 500,
      message: err.detail,
    });

    await client.query("ROLLBACK");
  } finally {
    await client.release();
  }
};

export const patchSubscriptionHandler = async (req: Request, res: Response) => {
  if (isEmpty(req.params) || isEmpty(req.body)) {
    res.send({
      status: 400,
      message: "missing :id url param or request body",
    });
    return;
  }

  const { id: user_id, subId: id } = req.params;
  const { subreddit, url, top } = req.body;
  const client = await pool.connect();

  try {
    const prepareStatement = `INSERT INTO newsletters(id, user_id, subreddit, url,top) VALUES ($1,$2,$3,$4,$5)
      ON CONFLICT (id) DO UPDATE SET updated_at = now(),
         user_id   = $2,
         subreddit = $3,
         url       = $4,
         top       = $5
      RETURNING *`;
    const createUserResponse = await client.query(prepareStatement, [
      id,
      user_id,
      subreddit,
      url,
      JSON.stringify(top),
    ]);

    res.json({
      status: 200,
      user: createUserResponse.rows[0],
    });
  } catch (err) {
    console.log({ err });

    res.json({
      status: 500,
      message: err.detail,
    });
  }

  await client.release();
};
