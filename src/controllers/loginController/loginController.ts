import type { Request, Response  } from 'express';
import { LoginService } from '../../services/loginServices/loginService.js';

export class LoginController {
  private loginService = new LoginService();

  constructor() {
    console.log('[LoginController] Instance created');
  }

  async login(req: Request, res: Response): Promise<void> {
    console.log('[LoginController.login] Input:', {
      correo: req.body.correo,
      cedula: req.body.cedula,
      password: req.body.password ? '[PROVIDED]' : '[MISSING]',
    });

    const result = await this.loginService.loginOrquester(req.body);

    res.status(result.status).json(result);
  }








  
}