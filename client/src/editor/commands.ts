import * as monaco from 'monaco-editor';
import editor from "./editor";
import SaveManager from '../profile/saveManager';

editor.addAction({
    id: 'save',
    label: 'gartbin: Save',
    keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    ],
    run(editor, ...args) {
        SaveManager.save()
    },
})

