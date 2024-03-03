import { languages } from "monaco-editor";
import editor from "../editor/editor";
import { setLanguage } from "../editor/languageLoader";
import Profile from "../profile/profile";
import SaveManager from "../profile/saveManager";

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

const saveButton = document.getElementById('save')!;
const newButton = document.getElementById('new')!;
const copyButton = document.getElementById('copy')!;
const cloneButton = document.getElementById('clone')!;
const rawButton = document.getElementById('raw')!;
const downloadButton = document.getElementById('download')!;

copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(editor.getValue());
    copyButton.innerText = 'Copied!';
    setTimeout(() => {
        copyButton.innerText = 'Copy';
    }, 1000);
})

saveButton.addEventListener('click', () => {
    SaveManager.save()
})

newButton.addEventListener('click', () => {
    SaveManager.new()
})

cloneButton.addEventListener('click', () => {
    SaveManager.clone()
})

rawButton.addEventListener('click', () => {
    window.location.href = `/${SaveManager.id}/raw`;
})

downloadButton.addEventListener('click', () => {
    window.location.href = `/${SaveManager.id}/download`;
})

const statusText = document.getElementById('status')!;

const fileNameInput = document.getElementById('filename')! as HTMLInputElement;

fileNameInput.addEventListener('input', () => {
    SaveManager.fileName = fileNameInput.value;
})

const loginButton = document.getElementById("login")!
const loginGithubButton = document.getElementById("login-github")!
const loginDiscordButton = document.getElementById("login-discord")!
const profileLogoutButton = document.getElementById("profile-logout")!

loginButton.addEventListener("click", Profile.usernamePasswordLogin)
loginGithubButton.addEventListener("click", Profile.oauthGithubLogin)
loginDiscordButton.addEventListener("click", Profile.oauthDiscordLogin)
profileLogoutButton.addEventListener("click", Profile.logout)

export {
    saveButton,
    newButton,
    copyButton,
    cloneButton,
    rawButton,
    downloadButton,
    statusText,
    fileNameInput
}