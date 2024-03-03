import express from "express"
import path from "path"
import cookieParser from "cookie-parser"

import IconRouter from "./icons"
import AuthRouter from "./auth/authRouter"
import ApiRouter from "./api"
import AuthMiddleware from "./auth/manager/middleware"
import BinManager from "../../database/managers/binManager"
import UserManager from "../../database/managers/userManager"

export const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(AuthMiddleware)

app.use('/static', express.static(path.resolve('./dist/client/static')))
app.use('/api', ApiRouter)
app.use('/icons', IconRouter)
app.use('/auth', AuthRouter)

app.get("/", (req, res) => {
    res.sendFile(path.resolve('./dist/client/index.html'))
})

app.get("/me", async (req, res) => {
    if (!req.body || !req.body.session) {
        res.json({
            error: "Not logged in"
        })
        return
    }

    const rootUser = await UserManager.getRootUser(req.body.session.user)

    res.json({
        user: {
            username: rootUser?.username,
            displayName: rootUser?.displayName,
        }
    })
})

app.get("/:id/raw", async (req, res) => {
    const bin = await BinManager.getBin(req.params.id)

    if (!bin) {
        res.status(404).setHeader('Content-Type', 'text/plain').send(`no bin found with id ${req.params.id}`)
        return;
    }

    res
        .status(200)
        .setHeader('Content-Type', 'text/plain')
        .setHeader('Content-Disposition', `filename="${bin.name}.${bin.extension}"`)
        .setHeader('Content-Length', bin.content.length.toString())
        .send(bin.content)
})

app.get("/:id/download", async (req, res) => {
    const bin = await BinManager.getBin(req.params.id)

    if (!bin) {
        res.status(404).send(`no bin found with id ${req.params.id}`)
        return;
    }

    res
        .status(200)
        .setHeader('Content-Type', 'application/octet-stream')
        .setHeader('Content-Disposition', `attachment; filename="${bin.name}.${bin.extension}"`)
        .setHeader('Content-Length', bin.content.length.toString())
        .send(bin.content)
})

app.get("/:id", (req, res) => {
    res.sendFile(path.resolve('./dist/client/index.html'))
})


app.listen(parseInt(process.env.PORT || "3001"), () => {
    console.log(`Listening on port ${process.env.PORT || "3001"}`)
})
