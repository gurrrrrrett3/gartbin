import { Router } from 'express';
import { db } from '..';
import { Paste } from '../database/entities/paste.entity';
import StreamManager from './streamManager';
const router = Router();

const streamManager = new StreamManager();

router.get('/', (req, res) => {

    const stream = streamManager.createStream();

    res.json({
        id: stream.id,
        chunkSize: StreamManager.STEAM_CHUNK_SIZE,
        maxChunks: Math.floor(StreamManager.MAX_SIZE / StreamManager.STEAM_CHUNK_SIZE)
    })

    console.log("Stream created", stream.id)
})

router.post("/:id", (req, res) => {
    const id = req.params.id;

    const stream = streamManager.getStream(id);
    
    if (!stream) {
        res.status(404).json({
            success: false,
            message: "Stream not found"
        })
        return
    }

    const chunk = req.body.content;
    const index = req.body.index;

    if (chunk.length > StreamManager.STEAM_CHUNK_SIZE) {
        res.status(400).json({
            success: false,
            message: "Chunk too large"
        })
        return
    }

    stream.write(chunk, index);

    res.json({
        success: true,
        totalSize: stream.chunks.length * StreamManager.STEAM_CHUNK_SIZE,
    })

    console.log("Chunk written", stream.id, stream.chunks.length)
})

router.post("/:id/end", async (req, res) => {
    const id = req.params.id;
    
    const stream = streamManager.getStream(id);

    if (!stream) {
        res.status(404).json({
            success: false,
            message: "Stream not found"
        })
        return
    }

    const content = stream.end();

    // create paste

    const paste = new Paste();
    paste.content = content;
    paste.language = req.body.language;
    paste.password = req.body.password;
    paste.expiresAt = new Date(Date.now() + parseInt(req.body.expiration) * 60 * 60 * 1000);

    res.json({
        success: true,
        totalSize: content.length,
        pasteId: paste.id
    })

    streamManager.deleteStream(id);

    await db
    .getEntityManager()
    .fork()
    .persistAndFlush(paste)

    console.log("Stream ended", stream.id, content.length)
    console.log("Paste created", paste.id)
})

router.post

export default router;