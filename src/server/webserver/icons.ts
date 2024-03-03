import { Router } from 'express';
import * as SimpleIcons from 'simple-icons';
import Utils from '../../utils';

const router = Router();

router.get('/:language', (req, res) => {

    const language = req.params.language;

    if (Object.keys(SimpleIcons).includes(`si${Utils.capitalizeFirstLetter(language)}`)) {
        const icon = (SimpleIcons as { [key: string]: SimpleIcons.SimpleIcon })[`si${Utils.capitalizeFirstLetter(language)}`];

        res.json({
            success: true,
            path: icon.path,
            hex: icon.hex
        })
    } else {
        res.json({
            success: false,
            message: "Language not found"
        })
    }

})



export default router;
