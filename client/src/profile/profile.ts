export default class Profile {

    public static loggedIn: boolean = false;
    public static username: string = "";
    public static displayName: string = "";

    public static oauthDiscordLogin() {
        window.location.pathname = "/auth/discord"
    }

    public static oauthGithubLogin() {
        window.location.pathname = "/auth/github"
    }

    public static usernamePasswordLogin() {
        window.location.pathname = "/auth/login"
    }

    public static logout() {
        window.location.pathname = "/auth/logout"
    }

    public static async checkLogin() {
        const res = await fetch("/me")
        const json: {
            user: {
                username: string
                displayName: string
            }
            error?: string
        } = await res.json()

        if (json.error) {
            return
        }

        Profile.loggedIn = true
        Profile.username = json.user.username
        Profile.displayName = json.user.displayName


        this.updateUi()
    }

    public static updateUi() {
        const profileText = document.getElementById("profile")!
        const loginButton = document.getElementById("login")!
        const loginGithubButton = document.getElementById("login-github")!
        const loginDiscordButton = document.getElementById("login-discord")!
        const profileLogoutButton = document.getElementById("profile-logout")!

        if (Profile.loggedIn) {
            profileText.innerText = Profile.displayName
            loginButton.setAttribute("hidden", "true")
            loginGithubButton.setAttribute("hidden", "true")
            loginDiscordButton.setAttribute("hidden", "true")
            profileLogoutButton.removeAttribute("hidden")
        } else {
            profileText.innerText = "Login"
            loginGithubButton.removeAttribute("hidden")
            loginDiscordButton.removeAttribute("hidden")
            loginButton.removeAttribute("hidden")
            profileLogoutButton.setAttribute("hidden", "true")
        }
    }

}