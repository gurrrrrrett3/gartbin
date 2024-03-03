import { Request, Response } from "express";
import { db } from "../../../..";
import User from "../../../../database/entities/user.entity";
import SessionManager from "../manager/sessionManager";
import oAuthProvider from "./oauthProvider";

export default class GitHubOauthProvider extends oAuthProvider {

    constructor() {
        super()
    }

    public generateOauthUrl() {
        const url = new URL("https://github.com/login/oauth/authorize")
        url.searchParams.append("client_id", process.env.GITHUB_CLIENT_ID!)
        url.searchParams.append("redirect_uri", process.env.GITHUB_REDIRECT_URI!)
        url.searchParams.append("state", this.generateState())
        url.searchParams.append("scope", "read:user")
        return url.toString()
    }

    public async handleCallback(req: Request, res: Response) {
        const code = req.query.code as string
        const state = req.query.state as string

        if (!code || !state) {
            res.status(400).send("Missing code or state")
            return
        }

        if (!this.isValidState(state)) {
            res.status(400).send("Invalid state")
            return
        }

        const token = await this.exchangeCode(code)

        if (!token.access_token) {
            res.status(400).send("Invalid code")
            return
        }

        const user = await this.getUser(token.access_token)

        if (!user.id) {
            res.status(400).send("Invalid token")
            return
        }


        let userEntity = await db.em.findOne(User, { username: `github:${user.id}` })

        if (!userEntity) {
            userEntity = User.fromGithub(user.id, user.login, token.access_token, [token.scope])
            await db.em.persistAndFlush(userEntity)
        }

        const session = await SessionManager.genSession(userEntity)
        res.cookie("session", session.id, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true })
        res.redirect("/")
    }

    public async exchangeCode(code: string) {
        const url = new URL("https://github.com/login/oauth/access_token")
        url.searchParams.append("client_id", process.env.GITHUB_CLIENT_ID!)
        url.searchParams.append("client_secret", process.env.GITHUB_CLIENT_SECRET!)
        url.searchParams.append("code", code)
        url.searchParams.append("redirect_uri", process.env.GITHUB_REDIRECT_URI!)
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Accept": "application/json"
            }
        })

        return response.json() as Promise<{ access_token: string, token_type: string, scope: string }>
    }

    public async getUser(token: string) {
        const response = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `token ${token}`
            }
        })


        return response.json() as Promise<{ id: number, login: string }>
    }


}