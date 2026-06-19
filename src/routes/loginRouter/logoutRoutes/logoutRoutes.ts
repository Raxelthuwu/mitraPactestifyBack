import { Router } from 'express';
import { LogoutController } from '../../../controllers/loginController/logoutController.js';
import { authJWT } from '../../../middleware/authJWT.js';

const router = Router();
const logoutController = new LogoutController();

router.post('/', authJWT, (req, res) => logoutController.logout(req as any, res));

export default router;