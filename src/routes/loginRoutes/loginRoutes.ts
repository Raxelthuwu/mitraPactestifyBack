import { Router } from 'express';
import { LoginController } from '../../controllers/loginController/loginController.js';

const router = Router();
const loginController = new LoginController();

router.post('/iniciar', (req, res) => loginController.login(req, res));

export default router;