import axios from "axios";
import { isEmpty } from "lodash";

// This worker is responsible for publishing subreddit newsletters
export async function runPublishWorker() {
  try {
    // host will depend minikube ip assignment
    // $ minikube ssh "route -n | grep ^0.0.0.0 | awk '{ print \$2 }'"
    // for docker usage use `host.docker.internal`
    const host = "10.0.2.2";
    const listSubscriptionsRequest = await axios.get(
      `http://${host}:4000/api/subscriptions`
    );
    if (!isEmpty(listSubscriptionsRequest.data.subs)) {
      console.log("-- all subscriptions");
      console.log({ subscriptions: listSubscriptionsRequest.data.subs });
    } else {
      console.log("-- no subscriptions available");
    }
  } catch (error) {
    console.error({ error });
  }
}
