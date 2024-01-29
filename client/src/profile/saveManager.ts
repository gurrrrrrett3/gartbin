export default class SaveManager {

    public static hasSaved: boolean = false;
    public static id: string = "";
    public static fileName: string = 'unsaved'
    public static fileExtension: string = '.txt'
    public static isReadOnly: boolean = false;

    public static async load() {
        const pathName = window.location.pathname;
        const pathParts = pathName.split('/');
        const id = pathParts[pathParts.length - 1];

        
        const res = await fetch(`/api/paste/${id}`)
        
    }
}