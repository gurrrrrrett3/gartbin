import express from "express";
import fs from "fs";
import path from "path";
import { db } from "..";
import { Paste } from "../database/entities/paste.entity";
import Logger from "../utils/logger";

import apiRouter from "./api";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  const file = fs.readFileSync(path.resolve("./client/index.html"), "utf-8");
  res.send(file.replace(/{{id}}/g, "new paste"));
});

app.get("/style.css", (req, res) => {
  res.sendFile(path.resolve("./client/style.css"));
});

app.get("/:id", (req, res) => {
  const id = req.params.id;

  // get the paste from the database
  db.getEntityManager()
    .fork()
    .findOne(Paste, { id })
    .then((paste) => {
      if (!paste) {
        res.status(404).send("Paste not found");
        return;
      } else if (
        paste.expiresAt &&
        paste.expiresAt.getTime() < Date.now() &&
        paste.expiresAt.getTime() !== 0
      ) {
        res.status(404).send("Paste expired");
        return;
      } else if (paste.password && req.query.password !== paste.password) {
        res.sendFile(path.resolve("./client/password.html"));
        return;
      } else {
        // special cases for languages

        if (paste.language.startsWith("image")) {
          //image:png/base64

          const contentType = paste.language.split(":")[1];
          const delim = "ⓢ¢€ⓢ¢";

          if (paste.content.includes(delim)) {
            const [filename, data] = paste.content.split(delim);
            res.setHeader("Content-Type", contentType);
            res.send(Buffer.from(data, "base64"));
            return;
          }

          const file = fs.readFileSync(path.resolve("./client/index.html"), "utf-8");
          res.send(file.replace(/{{id}}/g, paste.id));
        }
      }
    });
});

app.get("/:id/clean", (req, res) => {
  const id = req.params.id;

  // get the paste from the database
  db.getEntityManager()
    .fork()
    .findOne(Paste, { id })
    .then((paste) => {
      if (!paste) {
        res.status(404).send("Paste not found");
        return;
      }
      const html = fs.readFileSync(path.resolve("./client/thumbnail.html"), "utf-8");
      const content = html
        .replace("{{content}}", paste.content)
        .replace("{{language}}", paste.language)
        .replace("\\n", "\u000A")
        .replace(/&amp;/g, "&")
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&quot;/g, '"');
      res.send(content);
    });
});

app.get("/:id/raw", (req, res) => {
  const id = req.params.id;

  // get the paste from the database
  db.getEntityManager()
    .fork()
    .findOne(Paste, { id })
    .then((paste) => {
      if (!paste) {
        res.status(404).send("Paste not found");
        return;
      }

      res.setHeader("Content-Type", "text/plain").send(
        paste.content
          .replace("\\n", "\u000A")
          .replace(/&amp;/g, "&")
          .replace(/&gt;/g, ">")
          .replace(/&lt;/g, "<")
          .replace(/&quot;/g, '"')
      );
    });
});

app.listen(3003, () => {
  Logger.log("Listening on port 3003");
});
