import * as monaco from 'monaco-editor';
import { setLanguage } from './languageLoader';
import SaveManager from '../profile/saveManager';

const editor = monaco.editor.create(document.getElementById('code')!, {
    theme: 'vs-dark',
    cursorSmoothCaretAnimation: 'on',
    cursorBlinking: 'smooth',
    codeLens: true,
    lightbulb: {
        enabled: true,
    },
})

editor.onKeyUp((e) => {
    localStorage.setItem('code', editor.getValue());
})

const path = window.location.pathname;
const pathParts = path.split('/');
const id = pathParts[pathParts.length - 1];

if (!id) {
    setLanguage(localStorage.getItem('lang') || 'plaintext', window.localStorage.getItem('code') || '', true, editor);
} else {
    SaveManager.load()
}

export function setReadOnly(readOnly: boolean) {
    editor.updateOptions({
        readOnly,
    })
}

export default editor;