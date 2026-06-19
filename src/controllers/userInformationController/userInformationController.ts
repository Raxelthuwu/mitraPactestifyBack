import type { Response } from 'express';
import { userInormation } from '../../services/userInformationServices/userInformationService.js';
import type { AuthRequest } from '../../middleware/authJWT.js';

export class UserController {
  private userService = new userInormation();

  constructor() {
    console.log('[UserController] Instance created');
  }

  async getUser(req: AuthRequest, res: Response): Promise<void> {
    console.log('[UserController.getUser] Request received');

    const result = await this.userService.getUserInfo(req.user!);

    res.status(result.status).json(result);
  }
}