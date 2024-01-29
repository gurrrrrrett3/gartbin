import * as monaco from 'monaco-editor';
import { setLanguage } from './languageLoader';

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

setLanguage(localStorage.getItem('lang') || 'plaintext', window.localStorage.getItem('code') || '', editor);

export function setReadOnly(readOnly: boolean) {
    editor.updateOptions({
        readOnly,
    })
}
export default editor;