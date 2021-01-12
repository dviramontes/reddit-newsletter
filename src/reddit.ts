import axios from "axios";
import { ok, err } from "neverthrow";
import { Child, ChildData } from "./types";

export const fetchPosts = async (subreddit: String) => {
  try {
    const {
      data: {
        data: { children },
      },
    } = await axios.get(
      `https://www.reddit.com/r/${subreddit}/top.json?limit=3`
    );
    const results = children
      .map(({ data }: Child) => data)
      .map(
        ({
          ups,
          title,
          permalink,
          thumbnail,
          preview,
          subreddit,
        }: ChildData) => ({
          ups,
          title,
          permalink,
          thumbnail,
          preview,
          subreddit,
        })
      );

    return ok(results);
  } catch (error) {
    return err(error);
  }
};
