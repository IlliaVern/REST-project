import http from "http";
import { env, mongo, port, ip, apiRoot } from "./config";
import mongoose from "./services/mongoose";
import express from "./services/express";
import api from "./api";
import isAdmin from "./services/checkForOrCreateAdmin";

const app = express(apiRoot, api);
const server = http.createServer(app);

if (mongo.uri) {
  mongoose.connect(mongo.uri);
}
mongoose.Promise = Promise;

setImmediate(() => {
  server.listen(port, ip, () => {
    //checking if Admin exists. If no => creating HercAdmin with default email & password
    isAdmin();
    console.log(
      "Express server listening on http://%s:%d, in %s mode",
      ip,
      port,
      env
    );
  });
});

export default app;
