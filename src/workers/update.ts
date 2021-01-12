import axios from "axios";
import { isEmpty } from "lodash";
import { fetchPosts } from "../reddit";

// This worker is responsible for updating a subreddit's top posts
export async function runUpdateWorker() {
  try {
    // host will depend minikube ip assignment
    // $ minikube ssh "route -n | grep ^0.0.0.0 | awk '{ print \$2 }'"
    // for docker usage use `host.docker.internal`
    const host = "10.0.2.2";
    const subredditRequest = await axios.get(
      `http://${host}:4000/api/subreddits`
    );
    if (!isEmpty(subredditRequest.data.subreddits)) {
      for (const { id, name } of subredditRequest.data.subreddits) {
        const fetchPostResult = await fetchPosts(name);
        if (fetchPostResult.isErr()) {
          console.error(fetchPostResult.error);
          return;
        }
        if (fetchPostResult.isOk()) {
          try {
            const {
              data: { newsletter },
            } = await axios.patch(
              `http://${host}:4000/api/subreddits/${id}/tops`,
              {
                tops: fetchPostResult.value,
              }
            );
            console.log(
              `-- successfully updated top posts for subreddit: ${name}`
            );
            console.log({ newsletter });
          } catch (error) {
            console.error({ error });
          }
        }
      }
    }
  } catch (error) {
    console.error({ error });
  }
}
