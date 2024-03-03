import { Router } from 'express';
import BinManager from '../../../../database/managers/binManager';
import UserManager from '../../../../database/managers/userManager';
import User from '../../../../database/entities/user.entity';
const router = Router();

router.post("/", async (req, res) => {
    const { content, language, filename, extension, expiration, password, anon } = req.body as { content: string, filename: string, language: string, extension: string, expiration: string, password: string, anon: boolean };
    const session = req.body.session;
    const id = await BinManager.createBin(content, filename, language, extension, expiration == 'never' ? 'never' : new Date(expiration), password, anon ? undefined : session?.user || undefined);

    res.json({
        success: true,
        id
    });
});


router.get("/:id", async (req, res) => {
    const bin = await BinManager.getBin(req.params.id)
    const session = req.body.session as {
        id: string,
        user: User
    }

    if (!bin) {
        res.status(404).json({
            success: false,
            message: "bin not found"
        });
        return;
    }

    res.json({
        success: true,
        id: bin.id,
        content: bin.content,
        filename: bin.name,
        extension: bin.extension,
        expiration: bin.expiration,
        language: bin.language,
        isEditable: bin.user && session && bin.user.username === (await UserManager.getRootUser(session.user))?.username || false,
        owner: bin.user
    });
});

router.post("/:id", async (req, res) => {
    const { content, language, filename, extension, expiration, password } = req.body as { content: string, filename: string, language: string, extension: string, expiration: string, password: string };
    const id = req.params.id;
    const session = req.body.session;
    const result = await BinManager.updateBin(id, content, filename, language, extension, expiration == 'never' ? 'never' : new Date(expiration), password, session?.user || undefined);

    res.status(result.status).json({
        ...result,
        status: undefined
    });
    return;
})

router.get("/:id/clone", async (req, res) => {
    const bin = await BinManager.getBin(req.params.id);
    const session = req.body.session as {
        id: string,
        user: User
    }

    if (!bin) {
        res.status(404).json({
            success: false,
            message: "bin not found"
        });
        return;
    }

    const id = await BinManager.createBin(bin.content, `copy of ${bin.filename}`, bin.language, bin.extension, "never", bin.password, session.user || undefined);

    res.json({
        success: true,
        id
    });
})

export default router;
