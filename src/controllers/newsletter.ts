import { pool } from "../db";
import { ok, err } from "neverthrow";

export async function findNewsletterByIds(
  user_id: number,
  subreddit_id: number
) {
  const client = await pool.connect();
  const subredditResponse = await client.query(
    `SELECT * FROM newsletters WHERE user_id = $1 AND subreddit_id = $2`,
    [user_id, subreddit_id]
  );

  await client.release();

  if (subredditResponse.rowCount > 0) {
    return ok(subredditResponse.rows[0]);
  }

  return err(
    new Error(
      `newsletter with subreddit_id: ${subreddit_id} and user_id ${user_id} was not found`
    )
  );
}

export async function upsertNewsletter(user_id: number, subredditId: number) {
  let rowResult = null;
  const newsletterQueryResult = await findNewsletterByIds(user_id, subredditId);

  if (newsletterQueryResult.isOk()) {
    rowResult = newsletterQueryResult.value;
  } else {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const prepareStatement =
        "INSERT INTO newsletters(user_id, subreddit_id) VALUES ($1,$2) RETURNING *";
      const createTransaction = await client.query(prepareStatement, [
        user_id,
        subredditId,
      ]);

      if (createTransaction.rowCount === 1) {
        await client.query("COMMIT");
        rowResult = createTransaction.rows[0];
      }
    } catch (error) {
      console.error({ error });
      await client.query("ROLLBACK");
      return err(error.detail);
    } finally {
      await client.release();
    }
  }

  return ok(rowResult);
}
