import { Router } from 'express';
import DiscordOauthProvider from './provider/discordOauthProvider';
import GitHubOauthProvider from './provider/githubOauthProvider';
const router = Router();

const discordOauth = new DiscordOauthProvider()
const gitHubOauth = new GitHubOauthProvider()

router.get("/discord", (req, res) => {
    res.redirect(discordOauth.generateOauthUrl())
})

router.get("/discord/callback", (req, res) => {
    discordOauth.handleCallback(req, res)
})

router.get("/github", (req, res) => {
    res.redirect(gitHubOauth.generateOauthUrl())
})

router.get("/github/callback", (req, res) => {
    gitHubOauth.handleCallback(req, res)
})

router.get("/logout", (req, res) => {
    res.clearCookie("session")
    res.redirect("/")
})

export default router;
