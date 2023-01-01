export default class StreamManager {

    public streams: Map<string, Stream> = new Map();
    public static readonly STEAM_CHUNK_SIZE = 10240; // 10kb
    public static readonly MAX_SIZE = 1024 * 1024 * 8; 

    public getStream(id: string): Stream | undefined {
        return this.streams.get(id);
    }

    public createStream(): Stream {
        const stream = new Stream();
        this.streams.set(stream.id, stream);
        return stream;
    }

    public deleteStream(id: string): void {
        this.streams.delete(id);
    }

}

export class Stream {

    public chunks: string[] = [];
    public ended: boolean = false;
    public id: string = Math.random().toString(36).substring(2, 6);

    public write(chunk: string, index: number): void {
    

        if (index > this.chunks.length) {
                //create empty chunks
            for (let i = this.chunks.length; i < index; i++) {
                this.chunks.push("");
            }
        }

        this.chunks[index] = chunk;

    }

    public end(): string {
        this.ended = true;
        return this.chunks.join("");
    }
}