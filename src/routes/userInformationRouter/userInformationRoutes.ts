import { Router } from 'express';
import { UserController } from '../../controllers/userInformationController/userInformationController.js';
import { authJWT } from '../../middleware/authJWT.js';

const router = Router();
const userController = new UserController();

router.get('/get', authJWT, (req, res) => userController.getUser(req as any, res));

export default router;