import editor, { setReadOnly } from "../editor/editor";
import { setLanguage } from "../editor/languageLoader";
import { cloneButton, downloadButton, fileNameInput, rawButton, saveAnonButton, saveButton, statusText } from "../ui/toolbar";
import Profile from "./profile";
export default class SaveManager {

    public static hasSaved: boolean = false;
    public static id?: string
    public static fileName: string = 'unsaved'
    public static fileExtension: string = '.txt'
    public static language: string = 'plaintext'
    public static isReadOnly: boolean = false;
    public static owner: { username: string, displayName: string } | null = null;

    public static async load() {
        const pathName = window.location.pathname;
        const pathParts = pathName.split('/');
        const id = pathParts[pathParts.length - 1];

        const res = await fetch(`/api/v2/bin/${id}`)
        if (res.ok) {
            const json = await res.json()
            editor.setValue(json.content)
            this.fileName = json.filename
            this.fileExtension = json.extension
            this.id = json.id
            this.isReadOnly = !json.isEditable
            this.owner = json.owner

            if (this.isReadOnly) {
                setReadOnly(true)
                saveButton.style.display = 'none'
                saveAnonButton.style.display = 'none'
            }

            rawButton.removeAttribute('hidden')
            downloadButton.removeAttribute('hidden')
            cloneButton.removeAttribute('hidden')

            SaveManager.hasSaved = true;
            SaveManager.updateUI()
            setLanguage(json.language)
        } else {
            setReadOnly(true)
            const json = await res.json()
            setLanguage('plaintext', `Failed to load bin: \n\n\terror: ${json.message}\n\nPlease try a different bin or create a new one.\n`, false)
        }
    }

    public static async save(anon: boolean = false) {
        const res = await fetch(`/api/v2/bin${this.id ? `/${this.id}` : ""}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: editor.getValue(),
                filename: SaveManager.fileName === 'unsaved' ? undefined : SaveManager.fileName,
                language: SaveManager.language,
                extension: SaveManager.fileExtension,
                expiration: 'never',
                password: '',
                anon
            })
        })

        if (res.ok) {
            const json = await res.json()
            SaveManager.hasSaved = true;

            if (!this.id) {
                this.id = json.id
                window.history.pushState({}, '', `/${json.id}`)
            }

            if (this.fileName === 'unsaved') {
                this.fileName = json.id
            }

            this.owner = {
                username: Profile.username,
                displayName: Profile.displayName
            }

            saveButton.style.backgroundColor = 'green'
            saveButton.innerText = 'Saved!'
            setTimeout(() => {
                saveButton.style.backgroundColor = ''
                saveButton.innerText = 'Save'
            }, 1000)

            rawButton.removeAttribute('hidden')
            downloadButton.removeAttribute('hidden')
            cloneButton.removeAttribute('hidden')

            SaveManager.updateUI()
        } else {
            saveButton.style.backgroundColor = 'red'
            saveButton.innerText = 'Failed to save'
            setTimeout(() => {
                saveButton.style.backgroundColor = ''
                saveButton.innerText = 'Save'
            }, 1000)
        }
    }

    public static async clone() {
        const res = await fetch(`/api/v2/bin/${this.id}/clone`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (res.ok) {
            const json = await res.json()
            this.id = json.id
            window.location.pathname = `/${json.id}`
            SaveManager.hasSaved = true;
            SaveManager.updateUI()
        } else {
            const json = await res.json()
            setLanguage('plaintext', `Failed to clone bin: \n\n\terror: ${json.message}\n\nPlease try a different bin or create a new one.\n`, false)
        }
    }

    public static updateUI() {

        if (!this.fileExtension.startsWith('.')) {
            this.fileExtension = `.${this.fileExtension}`
        }

        document.title = `gartbin | ${this.fileName}${this.fileExtension}`
        fileNameInput.value = this.fileName.endsWith(this.fileExtension) ? this.fileName : `${this.fileName}${this.fileExtension}`
        statusText.innerText = this.owner
            ? this.isReadOnly
                ? `Read only - owned by ${this.owner.displayName}`
                : this.owner.username == Profile.username
                    ? 'Owned by you'
                    : `Owned by ${this.owner.displayName}`
            : "Read Only - Unowned"
    }

    public static async new() {
        window.localStorage.removeItem('lang')
        window.localStorage.removeItem('code')
        window.location.href = '/'
    }
}