import express from "express"
import { Server } from "http"
import path from "path"
import cookieParser from "cookie-parser"

import IconRouter from "./icons"
import AuthRouter from "./auth/authRouter"
import AuthMiddleware from "./auth/manager/middleware"

export const app = express()
export const server = new Server(app)

app.use(cookieParser())
app.use(AuthMiddleware)

app.use('/static', express.static(path.resolve('./dist/client/static')))
app.use('/icons', IconRouter)
app.use('/auth', AuthRouter)

app.get("/", (req, res) => {
    res.sendFile(path.resolve('./dist/client/index.html'))
})

app.get("/me", (req, res) => {
    if (!req.body.session) {
        res.json({
            error: "Not logged in"
        })
        return
    }

    res.json({
        user: {
            username: req.body.session.user.username,
            displayName: req.body.session.user.displayName,
        }
    })
})

server.listen(3001, () => {
    console.log("Listening on port 3001")
})
