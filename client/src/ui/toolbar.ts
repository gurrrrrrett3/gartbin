import { languages } from "monaco-editor";
import { setLanguage } from "../editor/languageLoader";
import Profile from "../profile/profile";

const langSelect = document.getElementById('lang')! as HTMLSelectElement;

languages.getLanguages()
.sort((a, b) => a.id!.localeCompare(b.id!))
.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.id!;
    option.innerText = `${lang.aliases ? lang.aliases[0] : lang.id!}`; 
    langSelect.appendChild(option);
})

const lang = localStorage.getItem('lang') || 'typecript';

langSelect.value = lang;

langSelect.addEventListener('change', () => {
    setLanguage(langSelect.value);
});

const loginButton = document.getElementById("login")!
const loginGithubButton = document.getElementById("login-github")!
const loginDiscordButton = document.getElementById("login-discord")!
const profileLogoutButton = document.getElementById("profile-logout")!

loginButton.addEventListener("click", Profile.usernamePasswordLogin)
loginGithubButton.addEventListener("click", Profile.oauthGithubLogin)
loginDiscordButton.addEventListener("click", Profile.oauthDiscordLogin)
profileLogoutButton.addEventListener("click", Profile.logout)
