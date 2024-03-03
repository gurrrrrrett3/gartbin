import { Router } from 'express';

import v1 from './api/v1/index';
import v2 from './api/v2/index';

const router = Router();

router.use('/', v1)
router.use('/v1', v1);
router.use('/v2', v2);

export default router;