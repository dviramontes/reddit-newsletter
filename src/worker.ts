import axios from "axios";
import { isEmpty } from "lodash";
import { fetchPosts } from "./reddit";
import { updateSubredditTops } from "./controllers/subreddit";

export async function startWorker() {
  try {
    const subredditRows = await axios.get(
      "http://host.docker.internal:4000/api/subreddits"
    );
    if (!isEmpty(subredditRows.data.subreddits)) {
      for (const { id, name } of subredditRows.data.subreddits) {
        const fetchPostResult = await fetchPosts(name);

        if (fetchPostResult.isOk()) {
          const updateSubredditTopsResult = await updateSubredditTops(
            id,
            fetchPostResult.value
          );
          if (updateSubredditTopsResult.isOk()) {
            console.log(
              `-- successfully updated top posts for subreddit: ${name}`
            );
          }
          if (updateSubredditTopsResult.isErr()) {
            console.error(updateSubredditTopsResult.error);
          }
        }

        if (fetchPostResult.isErr()) {
          console.error(fetchPostResult.error);
        }
      }
    }
  } catch (error) {
    console.error({ error });
  }
}
