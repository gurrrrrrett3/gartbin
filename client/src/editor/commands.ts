import * as monaco from 'monaco-editor';
import editor from "./editor";

editor.addAction({
    id: 'login',
    label: 'gartbin: Login',
    keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyL,
    ],
    run(editor, ...args) {
        console.log('login');
    },
})

editor.addAction({
    id: 'save',
    label: 'gartbin: Save',
    keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    ],
    run(editor, ...args) {
        console.log('save');
    },
})

