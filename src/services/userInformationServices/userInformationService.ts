import { usersInformationModel } from '../../models/userModels/usersInformationModel.js';
import type { TokenPayload } from '../../utils/jwt.js';

interface UserResponse {
  status: number;
  user: object;
}

export class userInormation {
  private userModel = new usersInformationModel();

  constructor() {
    console.log('[UserService] Instance created');
  }

  async getUserInfo(payload: TokenPayload): Promise<UserResponse> {
    console.log('[UserService.getUserInfo] Input:', payload);

    try {
      if (payload.role === 'testigo') {
        const assignedPlace = await this.userModel.getAssignedPlaceByUserId(payload.id_user);

        if (!assignedPlace) {
          console.log('[UserService.getUserInfo] No assignment found for testigo');
          return { status: 500, user: {} };
        }

        const response: UserResponse = {
          status: 200,
          user: {
            name: payload.name,
            role: payload.role,
            ...assignedPlace,
          },
        };

        console.log('[UserService.getUserInfo] Return:', response);
        return response;
      }

      const response: UserResponse = {
        status: 200,
        user: {
          name: payload.name,
          role: payload.role,
        },
      };

      console.log('[UserService.getUserInfo] Return:', response);
      return response;

    } catch (error) {
      console.error('[UserService.getUserInfo] Error:', error);
      return { status: 500, user: {} };
    }
  }
}