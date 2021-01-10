import { pool } from "../db";
import { ok, err } from "neverthrow";

export async function findSubredditByName(name: string) {
  const client = await pool.connect();
  const subredditResponse = await client.query(
    "SELECT * FROM subreddits WHERE name = $1",
    [name]
  );

  await client.release();

  if (subredditResponse.rowCount > 0) {
    return ok(subredditResponse.rows[0]);
  }

  return err(new Error(`subreddit with name: ${name} was not found`));
}

export async function upsertSubreddit(name: string, url: string) {
  let rowResult = null;
  const subredditQueryResult = await findSubredditByName(name);

  if (subredditQueryResult.isOk()) {
    rowResult = subredditQueryResult.value;
  } else {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const prepareStatement =
        "INSERT INTO subreddits(name, url) VALUES ($1,$2) RETURNING *";
      const createTransaction = await client.query(prepareStatement, [
        name,
        url,
      ]);

      if (createTransaction.rowCount === 1) {
        await client.query("COMMIT");
        rowResult = createTransaction.rows[0];
      }
    } catch (error) {
      console.log({ err: error });
      await client.query("ROLLBACK");
      return err(error.detail);
    } finally {
      await client.release();
    }
  }

  return ok(rowResult);
}
