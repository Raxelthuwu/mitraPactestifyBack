import { Router } from 'express';
import { LoginController } from '../../../controllers/loginController/loginController.js';
import { validateLoginSchema } from '../../../middleware/middlewareLogin/validateLoginSchema.js';
import { loginRateLimiter } from '../../../middleware/limiters/loginLimiter.js';

const router = Router();
const loginController = new LoginController();

router.post('/iniciar', loginRateLimiter, validateLoginSchema, (req, res) => loginController.login(req, res));

export default router;