import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import crypto from "crypto";

@Entity()
export default class User {

    @PrimaryKey()
    username: string

    @Property()
    displayName: string

    @Property()
    token: string

    @Property()
    refreshToken?: string

    @Property()
    createdAt: Date = new Date()

    @Property()
    expiresAt?: Date

    @Property()
    scopes: string[] = []

    constructor(username: string, displayName: string, token: string, refreshToken?: string, scopes: string[] = [], expiresAt?: Date) {
        this.username = username
        this.displayName = displayName
        this.token = token
        this.refreshToken = refreshToken
        this.scopes = scopes
        this.expiresAt = expiresAt

        if (this.scopes.length === 0) {
            this.scopes = ["identify"]
        }
    }

    public static fromPassword(username: string, password: string) {

        const hash = crypto.createHash("sha256")
        hash.update(password)
        const hashedPassword = hash.digest("hex")

        const user = new User(username, username, hashedPassword)
        return user   
    }

    public static fromDiscord(userId: string, username: string, token: string, refreshToken?: string, scopes: string[] = [], expiresAt?: Date) {
        const user = new User(`discord:${userId}`, username, token, refreshToken, scopes, expiresAt)
        return user
    }

    public static fromGithub(username: string, token: string, refreshToken?: string, scopes: string[] = [], expiresAt?: Date) {
        const user = new User(`github:${username}`, username, token, refreshToken, scopes, expiresAt)
        return user
    }

    public static verifyPassword(user: User, password: string) {
     
        const hash = crypto.createHash("sha256")
        hash.update(password)
        const hashedPassword = hash.digest("hex")

        return user.token === hashedPassword
    }

}