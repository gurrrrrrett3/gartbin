import { Router } from "express";
import path from "path";
import { db, puppet } from "..";
import { Paste } from "../database/entities/paste.entity";
const router = Router();

router.get("/", (req, res) => {
  res.sendFile(path.resolve("./client/api.html"));
});

router.post("/paste", (req, res) => {
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
  const paste = new Paste();
  paste.id = id;
  paste.content = content;
  paste.language = language;
  paste.password = password;

  // if the paste has an expiration time, set it
  if (expiration !== "never") {
    paste.expiresAt = new Date(Date.now() + parseInt(expiration) * 60 * 60 * 1000);
  } else {
    paste.expiresAt = new Date(0);
  }

  console.log(paste);

  // save the paste to the database
  db.getEntityManager().fork().persistAndFlush(paste);

  // send the id of the paste to the user
  res.json({ id });
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
  puppet
    .getMetaScreensot(req.params.id)
    .then((image) => {
      res.setHeader("Content-Type", "image/webp").send(image);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

export default router;
