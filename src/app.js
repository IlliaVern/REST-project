import http from "http";
import { env, mongo, port, ip, apiRoot } from "./config";
import mongoose from "./services/mongoose";
import express from "./services/express";
import api from "./api";
import { checkForOrCreateAdmin, runSchedules } from "./services/middleware";

const app = express(apiRoot, api);
const server = http.createServer(app);

if (mongo.uri) {
  mongoose.connect(mongo.uri);
}
mongoose.Promise = Promise;

setImmediate(() => {
  server.listen(port, ip, () => {
    //checking if Admin exists. If no => creating HercAdmin with default email, password & phone
    checkForOrCreateAdmin();
    console.log(
      "Express server listening on http://%s:%d, in %s mode",
      ip,
      port,
      env
    );
    runSchedules();
  });
});

export default app;
