export default class Gartbin {

    public static baseUrl = "https://bin.gart.sh"

    public static async createPaste(content: string, options: {
        language?: string,
        expiresAt?: Date,
        password?: string
    } = {
        language: "plaintext",
        expiresAt: undefined,
        password: undefined
    }): Promise<string> {

        const res = await fetch(`${this.baseUrl}/api/paste`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content,
                language: options.language || "plaintext",
                expiration: options.expiresAt ? options.expiresAt.getTime() : "never",
                password: options.password
            })
        })

        const json = await res.json()
        
        if (json.error) {
            throw new Error(json.message)
        }
        
        return json.id
    }

    public static async getPaste(id: string, password?: string): Promise<string> {

        const res = await fetch(`${this.baseUrl}/api/${id}${password ? `?password=${password}` : ""}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const json = await res.json()

        if (json.error) {
            throw new Error(json.message)
        }

        return json.content
    }


}