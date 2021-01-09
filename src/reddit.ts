import axios from "axios";
import { ok, err } from 'neverthrow';

export const fetchPosts = async (subreddit: String) => {
  try {
    const {
      data: { data: { children } },
    } = await axios.get(`https://www.reddit.com/r/${subreddit}/top.json?limit=3`);

    return ok(children);
  } catch (e) {
    return err(e);
  }
}

