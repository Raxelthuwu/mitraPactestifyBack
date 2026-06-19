import type { Response } from 'express';
import { LogoutService } from '../../services/loginServices/logouthService.js';
import type { AuthRequest } from '../../middleware/authJWT.js';
import { verifyToken } from '../../utils/jwt.js';

export class LogoutController {
  private logoutService = new LogoutService();

  constructor() {
    console.log('[LogoutController] Instance created');
  }

    async logout(req: AuthRequest, res: Response): Promise<void> {
        console.log('[LogoutController.logout] Request received');

        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
        console.error('[LogoutController.logout] Missing token');
        res.status(401).json({ status: 401 });
        return;
        }

        const decoded = verifyToken(token);

        if (!decoded.exp) {
        console.error('[LogoutController.logout] Token has no expiration');
        res.status(401).json({ status: 401 });
        return;
        }

        const expires_at = new Date(decoded.exp * 1000);

        const success = await this.logoutService.logoutOrquester(
        req.user!.id_user,
        token,
        expires_at
        );

        console.log('[LogoutController.logout] Return:', { status: success ? 200 : 500 });
        res.status(200).json({ status: success ? 200 : 500 });
    }
}