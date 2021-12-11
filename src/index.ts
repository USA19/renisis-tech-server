import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import config from "./config";
import { AuthRoutes, UserRoutes, PostRoutes } from "./routes";
import { isAuthenticated } from "./utils";

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });

const app = express();

app.use(cors());
app.use(express.json());

app.use("/images", express.static("./images"));

// routes
//publicRoutes
app.use(AuthRoutes);
//protectedRoutes
app.use(isAuthenticated); //~token protection
app.use(UserRoutes);
app.use(PostRoutes)

mongoose
  .connect(config.mongoUri)
  .then(() => {
    app.listen(process.env.PORT || config.PORT);
  })
  .catch((e) => console.log(e));