import bcrypt from 'bcryptjs';
import { LoginModel } from '../../models/loginModels/loginModel.js';
import { generateToken } from '../../utils/jwt.js';
import type { LoginUserData } from '../../models/interfacesModels/Users_interface.js';
import { logouthModel } from '../../models/loginModels/logoutModel.js';

interface LoginRequestData {
  correo: string;
  cedula: number;
  password: string;
}

interface FormattedLoginData {
  email: string;
  cc: bigint;
  password: string;
}

interface LoginResponse {
  token?: string;
  status: number;
  inicio: boolean;
}

export class LoginService {
  private loginModel = new LoginModel();
  private logoutModel = new logouthModel();


  constructor() {
    console.log('[LoginService] Instance created')
  }

  //1
  private formatLoginData(data: LoginRequestData): FormattedLoginData {
      console.log('[LoginService.formatLoginData] Input:', {
        correo: data.correo,
        cedula: data.cedula,
        password: data.password ? '[PROVIDED]' : '[MISSING]',
      });

      const formattedData: FormattedLoginData = {
        email: data.correo.trim().toLowerCase(),
        cc: BigInt(data.cedula),
        password: data.password,
      };

      console.log('[LoginService.formatLoginData] Return:', {
        email: formattedData.email,
        cc: formattedData.cc.toString(),
        password: formattedData.password ? '[PROVIDED]' : '[MISSING]',
      });

      return formattedData;
    }


  //2
  private async getUserByCredentials(
    email: string,
    cc: bigint
  ): Promise<LoginUserData | null> {
    console.log('[LoginService.getUserByCredentials] Input:', {
      email,
      cc: cc.toString(),
    });

    const user = await this.loginModel.findUserByCredentials(email, cc);

    console.log('[LoginService.getUserByCredentials] Return:', user
      ? {
          id_user: user.id_user,
          name: user.name,
          email: user.email,
          cc: user.cc.toString(),
          active: user.active,
          type_rol: user.type_rol,
          password: '[PASSWORD_FOUND]',
        }
      : null
    );

    return user;
  }

  //3
  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    console.log('[LoginService.comparePasswords] Input:', {
      plainPassword: plainPassword ? '[PROVIDED]' : '[MISSING]',
      hashedPassword: hashedPassword ? '[PROVIDED]' : '[MISSING]',
    });

    const passwordsMatch = await bcrypt.compare(plainPassword, hashedPassword);

    console.log('[LoginService.comparePasswords] Return:', passwordsMatch);

    return passwordsMatch;
  }


  //4
  private generateLoginToken(user: LoginUserData): string {
    console.log('[LoginService.generateLoginToken] Input:', {
      id_user: user.id_user,
      name: user.name,
      role: user.type_rol,
    });

    const token = generateToken({
      id_user: user.id_user,
      name: user.name,
      role: user.type_rol,
    });

    console.log('[LoginService.generateLoginToken] Return:', '[TOKEN]');

    return token;
  }



  //5


  private async setUserInactive(email: string, cc: bigint): Promise<boolean> {
    console.log('[LoginService.setUserInactive] Input:', {
      email,
      cc: cc.toString(),
    });

    const success = await this.loginModel.setUserInactive(email, cc);

    console.log('[LoginService.setUserInactive] Return:', success);

    return success;
  }


  
  //6 
async loginOrquester(data: LoginRequestData): Promise<LoginResponse> {
  console.log('[LoginService.loginOrquester] Input:', {
    correo: data.correo,
    cedula: data.cedula,
    password: data.password ? '[PROVIDED]' : '[MISSING]',
  });

  try {
    const formattedData = this.formatLoginData(data);

    const user = await this.getUserByCredentials(formattedData.email, formattedData.cc);

    if (!user) {
      console.log('[LoginService.loginOrquester] User not found');
      return { status: 400, inicio: false };
    }

    if (user.active === false) {
      const hasToken = await this.logoutModel.hasActiveToken(user.id_user);
      if (hasToken) {
        console.log('[LoginService.loginOrquester] User already has an active session');
        return { status: 400, inicio: false };
      }
      console.log('[LoginService.loginOrquester] Stale session detected, resetting');
      await this.logoutModel.setUserActive(user.id_user);
    }

    const passwordMatches = await this.comparePasswords(formattedData.password, user.password);

    if (!passwordMatches) {
      console.log('[LoginService.loginOrquester] Invalid password');
      return { status: 400, inicio: false };
    }

    const token = this.generateLoginToken(user);

    const userUpdated = await this.setUserInactive(formattedData.email, formattedData.cc);

    if (!userUpdated) {
      console.log('[LoginService.loginOrquester] User status could not be updated');
      return { status: 400, inicio: false };
    }

    const jwtExpires = new Date();
    jwtExpires.setHours(jwtExpires.getHours() + 2);
    await this.logoutModel.saveActiveToken(user.id_user, token, jwtExpires);

    console.log('[LoginService.loginOrquester] Return:', { token: '[TOKEN]', status: 200, inicio: true });
    return { token, status: 200, inicio: true };

  } catch (error) {
    console.error('[LoginService.loginOrquester] Error:', error);
    return { status: 400, inicio: false };
  }
}



}