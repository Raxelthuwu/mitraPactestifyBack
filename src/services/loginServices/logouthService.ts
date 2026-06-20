import { logouthModel } from '../../models/loginModels/logoutModel.js';

export class LogoutService {
  private logoutModel = new logouthModel();

  constructor() {
    console.log('[LogoutService] Instance created');
  }



  //1
    async logout(id_user: number): Promise<boolean> {
    console.log('[LogoutService.logout] Input:', { id_user });

    const success = await this.logoutModel.setUserActive(id_user);

    console.log('[LogoutService.logout] Return:', success);

    return success;
    }

 //2
 private async revokeJwtToken(token: string, expires_at: Date): Promise<boolean> {
  console.log('[LogoutService.revokeJwtToken] Input:', {
    token: token ? '[PROVIDED]' : '[MISSING]',
    expires_at,
  });

  const revoked = await this.logoutModel.revokeToken(token, expires_at);

  console.log('[LogoutService.revokeJwtToken] Return:', revoked);

  return revoked;
}

//3
async logoutOrquester(
  id_user: number,
  token: string,
  expires_at: Date
): Promise<boolean> {
  console.log('[LogoutService.logoutOrquester] Input:', {
    id_user,
    token: token ? '[PROVIDED]' : '[MISSING]',
    expires_at,
  });
  try {
    const tokenRevoked = await this.revokeJwtToken(token, expires_at);
    console.log('[LogoutService.logoutOrquester] Token revoked:', tokenRevoked);

    await this.logoutModel.deleteActiveToken(id_user);
    console.log('[LogoutService.logoutOrquester] Active token deleted');

    const userActivated = await this.logoutModel.setUserActive(id_user);
    console.log('[LogoutService.logoutOrquester] User activated:', userActivated);

    const success = tokenRevoked && userActivated;
    console.log('[LogoutService.logoutOrquester] Return:', success);
    return success;
  } catch (error) {
    console.error('[LogoutService.logoutOrquester] Error:', error);
    console.log('[LogoutService.logoutOrquester] Return:', false);
    return false;
  }
}

}