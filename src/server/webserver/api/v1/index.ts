import { Router } from "express";
import path from "path";
import { db, } from "../../../..";
import { Bin } from "../../../../database/entities/bin.entity";

import StreamRouter from "./stream";

const router = Router();

router.use("/stream", StreamRouter);

router.get("/", (req, res) => {
  res.json({
    version: 1
  })
});

router.post("/paste", async (req, res) => {
  const { content, language, expiration, password } = req.body as {
    content: string; // content of the paste
    language: string; // language of the paste
    expiration: string; // time in hours until the paste expires, or "never"
    password?: string; // password to access the paste
  };

  // generate a random id for the paste
  const id = Math.random().toString(36).substring(2, 6);

  console.log(expiration);

  // create a new paste entity
  const paste = new Bin();
  paste.id = id;
  paste.content = content;
  paste.language = language;
  paste.password = password;

  // if the paste has an expiration time, set it
  if (
    expiration !== "never" &&
    expiration !== "" &&
    expiration !== "0" &&
    expiration !== undefined &&
    expiration
  ) {
    paste.expiration = new Date(Date.now() + parseInt(expiration) * 60 * 60 * 1000);
  } else {
    paste.expiration = new Date(0);
  }

  console.log(paste);

  // save the paste to the database
  await db
    .em
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
    .em
    .findOne(Bin, { id })
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


  if (paste.password && paste.password !== password) {
    res.status(403).json({
      success: false,
      message: "Incorrect password",
    });
    return;
  }

  paste.content = content;

  await db
    .em
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
  db.em
    .findOne(Bin, { id })
    .then((paste) => {
      if (!paste) {
        res.status(404).json({
          success: false,
          message: "Paste not found",
        });
        return;
      } else if (
        paste.expiration &&
        paste.expiration.getTime() < Date.now() &&
        paste.expiration.getTime() !== 0
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

export default router;
