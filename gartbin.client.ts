export default class Gartbin {
  public static baseUrl = "https://bin.gart.sh";

  public static async createPaste(
    content: string,
    options: {
      language?: string;
      expiresAt?: Date;
      password?: string;
      allowUpdate?: boolean;
    } = {
      language: "plaintext",
      expiresAt: undefined,
      password: undefined,
      allowUpdate: false,
    }
  ): Promise<string> {
    const res = await fetch(`${this.baseUrl}/api/paste`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        language: options.language || "plaintext",
        expiration: options.expiresAt ? options.expiresAt.getTime() : "never",
        password: options.password,
      }),
    });

    const json = await res.json();

    if (json.error) {
      throw new Error(json.message);
    }

    return json.id;
  }

  public static async getPaste(id: string, password?: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/api/${id}${password ? `?password=${password}` : ""}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();

    if (json.error) {
      throw new Error(json.message);
    }

    return json.content;
  }

  public static async createPasteAsStream(
    content: string | Buffer,
    options: {
      language?: string;
      expiresAt?: Date;
      password?: string;
    } = {
      language: "plaintext",
      expiresAt: undefined,
      password: undefined,
    }
  ): Promise<string> {
    return fetch(`${this.baseUrl}/api/stream`)
      .then((res) => res.json())
      .then((json) => {
        const streamId = json.id;
        const chunkSize = json.chunkSize;
        const maxChunks = json.maxChunks;

        const chunks = [];

        for (let i = 0; i < content.length; i += chunkSize) {
          chunks.push(content.slice(i, i + chunkSize));
        }

        if (chunks.length > maxChunks) {
          throw new Error("Content is too large");
        }

        chunks.forEach(async (chunk, index) => {
          await fetch(`${this.baseUrl}/api/stream/${streamId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: chunk,
              index,
            }),
          });
        });

        return fetch(`${this.baseUrl}/api/stream/${streamId}/end`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language: options.language || "plaintext",
            expiration: options.expiresAt ? options.expiresAt.getTime() : "never",
            password: options.password,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            return json.pasteId as string;
          });
      });
  }

  public static async updatePaste(
    id: string,
    content: string,
    options: {
      password?: string;
    } = {
      password: undefined,
    }
  ): Promise<void> {
    const res = await fetch(`${this.baseUrl}/api/paste/${id}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        password: options.password,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to update paste");
    }

    const json = await res.json();

    if (json.error) {
      throw new Error(json.message);
    }
  }
}
