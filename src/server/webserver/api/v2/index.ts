import binRouter from './bin';
import userRouter from './user';

import { Router } from 'express';
const router = Router();

router.use('/bin', binRouter);
router.use('/user', userRouter);

router.get("/", (req, res) => {
    res.json({
        version: 2
    });
});

router.get("/status", (req, res) => {
    res.json({
        status: "ok"
    });
})

export default router;