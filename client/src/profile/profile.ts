export default class Profile {

    public loggedIn: boolean = false;
    public username: string = "";
    public displayName: string = "";

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

        const profile = new Profile()
        profile.loggedIn = true
        profile.username = json.user.username
        profile.displayName = json.user.displayName
     

        this.updateUi(profile)
        
        return profile
    }

    public static updateUi(profile: Profile) {
        const profileText = document.getElementById("profile")!
        const loginButton = document.getElementById("login")!
        const loginGithubButton = document.getElementById("login-github")!
        const loginDiscordButton = document.getElementById("login-discord")!
        const profileLogoutButton = document.getElementById("profile-logout")!

        if (profile.loggedIn) {
            profileText.innerText = profile.displayName
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