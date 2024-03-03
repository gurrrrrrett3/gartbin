import { Router } from 'express';
import UserManager from '../../../../database/managers/userManager';
const router = Router();

router.get("/:id", async (req, res) => {
    const user = await UserManager.getRootUser(req.params.id)
    res.json({
        id: user?.username,
        displayName: user?.displayName,
        createdAt: user?.createdAt,
    })
});

export default router;
