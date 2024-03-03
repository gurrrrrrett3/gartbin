export default class IconManager {

    private static _IconCache = new Map<string, string>();

    public static async getIconForLanguage(language: string) { 
        
        if (IconManager._IconCache.has(language)) {
            return IconManager._IconCache.get(language);
        }

        const response = await fetch(`/icons/${language}`);
        const data = await response.json();

        if (data.success) {

            const path = data.path;
            const hex = data.hex;

            const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#${hex}" width="24px" height="24px">
                <path d="${path}"/>
            </svg>
            `;

            const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
            IconManager._IconCache.set(language, dataUrl);
            IconManager._saveIconCache();
            return dataUrl;
        } else {
            return undefined;
        }
        
    }
    
    private static _saveIconCache() {
        localStorage.setItem("iconCache", JSON.stringify([...IconManager._IconCache]));
    }

    private static _loadIconCache() {
        const iconCache = localStorage.getItem("iconCache");
        if (iconCache) {
            IconManager._IconCache = new Map(JSON.parse(iconCache));
        }
    }

    public static init() {
        IconManager._loadIconCache();
    }
}

IconManager.init();

