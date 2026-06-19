import { Router } from 'express';
import { LoginController } from '../../../controllers/loginController/loginController.js';
import { validateLoginSchema } from '../../../middleware/middlewareLogin/validateLoginSchema.js';
const router = Router();
const loginController = new LoginController();

router.post('/iniciar', validateLoginSchema, (req, res) => loginController.login(req, res));

export default router;