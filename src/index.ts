import minimist = require("minimist");
import { runApiServer } from "./server";
import { runUpdateWorker } from "./workers/update";
import { runPublishWorker } from "./workers/publish";

const { mode } = minimist(process.argv.slice(2));

console.log(`-- running mode: ${mode || "server"}`);

(async () => {
  switch (mode) {
    case "update":
      // bootstraps worker for fetching latest posts
      await runUpdateWorker();
      break;
    case "publish":
      // bootstraps worker for publishing latest posts
      await runPublishWorker();
      break;
    case "service": // fallthrough
    default:
      // bootstraps api server for creating user accounts and newsletter subscriptions
      await runApiServer();
      break;
  }
})();
