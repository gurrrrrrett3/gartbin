import { Router } from "express";
import path from "path";
import { db, puppet } from "..";
import { Paste } from "../database/entities/paste.entity";

import StreamRouter from "./stream";

const router = Router();

router.use("/stream", StreamRouter);

router.get("/", (req, res) => {
  res.sendFile(path.resolve("./client/api.html"));
});

router.post("/paste", async (req, res) => {
  const { content, language, expiration, password, allowUpdate } = req.body as {
    content: string; // content of the paste
    language: string; // language of the paste
    expiration: string; // time in hours until the paste expires, or "never"
    password?: string; // password to access the paste
    allowUpdate?: boolean; // allow the paste to be updated
  };

  // generate a random id for the paste
  const id = Math.random().toString(36).substring(2, 6);

  console.log(expiration);

  // create a new paste entity
  const paste = new Paste();
  paste.id = id;
  paste.content = content;
  paste.language = language;
  paste.password = password;
  paste.allowUpdate = allowUpdate;

  // if the paste has an expiration time, set it
  if (
    expiration !== "never" &&
    expiration !== "" &&
    expiration !== "0" &&
    expiration !== undefined &&
    expiration
  ) {
    paste.expiresAt = new Date(Date.now() + parseInt(expiration) * 60 * 60 * 1000);
  } else {
    paste.expiresAt = new Date(0);
  }

  console.log(paste);

  // save the paste to the database
  await db
    .getEntityManager()
    .fork()
    .persistAndFlush(paste)
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    });

  // send the id of the paste to the user
  res.json({ id });
});

router.post("/paste/:id/update", async (req, res) => {
  const id = req.params.id;

  const { content, password } = req.body as {
    content: string; // content of the paste
    password?: string; // password to access the paste
  };

  // get the paste from the database
  const paste = await db
    .getEntityManager()
    .fork()
    .findOne(Paste, { id })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    });

  if (!paste) {
    res.status(404).json({
      success: false,
      message: "Paste not found",
    });
    return;
  }

  if (!paste.allowUpdate) {
    res.status(403).json({
      success: false,
      message: "Paste does not allow updates",
    });
    return;
  }

  if (paste.password && paste.password !== password) {
    res.status(403).json({
      success: false,
      message: "Incorrect password",
    });
    return;
  }

  paste.content = content;

  await db
    .getEntityManager()
    .fork()
    .persistAndFlush(paste)
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    });

  res.json({
    success: true,
    message: "Paste updated",
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  // get the paste from the database
  db.getEntityManager()
    .fork()
    .findOne(Paste, { id })
    .then((paste) => {
      if (!paste) {
        res.status(404).json({
          success: false,
          message: "Paste not found",
        });
        return;
      } else if (
        paste.expiresAt &&
        paste.expiresAt.getTime() < Date.now() &&
        paste.expiresAt.getTime() !== 0
      ) {
        res.status(404).json({
          success: false,
          message: "Paste expired",
        });
        return;
      } else if (paste.password && req.query.password !== paste.password) {
        res.status(404).json({
          success: false,
          message: "Invalid password",
        });
        return;
      } else {
        res.json({
          success: true,
          content: paste.content,
          language: paste.language,
        });
      }
    });
});

router.get("/:id/thumbnail", (req, res) => {
  const id = req.params.id;

  // get the paste from the database
  db.getEntityManager()
    .fork()
    .findOne(Paste, { id })
    .then((paste) => {
      if (!paste) {
        res.status(404).json({
          success: false,
          message: "Paste not found",
        });
        return;
      }
      if (paste.language.startsWith("image")) {
        //image:png/base64
        const contentType = paste.language.split(":")[1];
        const delim = ";";

        if (paste.content.includes(delim)) {
          const [filename, data] = paste.content.split(delim);

          const buffer = Buffer.from(data, "base64");
          res.setHeader("Content-Type", contentType).send(buffer);
        } else {
          const buffer = Buffer.from(paste.content, "base64");
          res.setHeader("Content-Type", contentType).send(buffer);
        }
      } else {
        puppet
          .getMetaScreensot(req.params.id)
          .then((image) => {
            res.setHeader("Content-Type", "image/webp").send(image);
          })
          .catch((err) => {
            res.status(404).send(err);
          });
      }
    });
});

export default router;
