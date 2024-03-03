import * as monaco from 'monaco-editor';
import editor from './editor';
import Utils from '../utils';
import IconManager from '../utils/iconManager';
import SaveManager from '../profile/saveManager';

export function loadLanguages() {
    monaco.languages.getLanguages()
        .sort((a, b) => a.id!.localeCompare(b.id!))
        .forEach(lang => {

            editor.addAction({
                id: lang.id!,
                label: `gartbin: Set Language to ${lang.aliases ? lang.aliases[0] : lang.id!}`,
                keybindings: [
                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL,
                ],
                run(editor, ...args) {
                    setLanguage(lang.id!);
                },
            })

        })

}

export async function setLanguage(lang: string, value?: string, save: boolean = true, editorObject = editor) {
    const langSelect = document.getElementById('lang')! as HTMLSelectElement;
    // const langIcon = document.getElementById('langIcon')! as HTMLImageElement;

    langSelect.value = lang;
    if (save) {
        localStorage.setItem('lang', lang);
    }

    const newValue = value || editorObject.getValue();
    editorObject.getModel()?.dispose();
    const model = monaco.editor.createModel(newValue, lang);
    editorObject.setModel(model);

    // IconManager.getIconForLanguage(lang).then(icon => {
    //     if (icon) {
    //         langIcon.src = icon;
    //         langIcon.alt = lang;
    //     }
    // })

    const langData = monaco.languages.getLanguages().find(l => l.id == lang);

    if (!SaveManager.hasSaved) {
        const fileNameInput = document.getElementById('filename')! as HTMLInputElement;
        const fileName = SaveManager.fileName || 'untitled';

        fileNameInput.value = `${fileName}${langData?.extensions![0]}`

    }

    SaveManager.language = lang;
    SaveManager.fileExtension = langData?.extensions![0] || 'txt';

    return langData;
}
