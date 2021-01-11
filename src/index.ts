import minimist = require("minimist");
import { startApiServer } from "./server";
import { startWorker } from "./worker";

const { mode } = minimist(process.argv.slice(2));

console.log(`-- running mode: ${mode || "server"}`);

(async () => {
  switch (mode) {
    case "worker":
      // bootstraps worker for fetching latest post in
      // subreddit table
      await startWorker();
      break;
    case "service": // fallthrough
    default:
      // bootstraps api server for creating user accounts
      // and newsletter subscriptions
      await startApiServer();
      break;
  }
})();
