import { UserDTO } from '../dtos';
import { NextFunction, Response } from 'express';
import jwt = require('jsonwebtoken');
import APIResponse from './api-response';
import CONSTANTS from './constants';
import Helpers from './helpers';
import MESSAGES from './messages';
import { AuthenticatedRequest } from './types';
import UserService from '../modules/user/user.service';

export default class Middlewares {
    /**
     * Authenticate middleware
     *
     * Verify access token in request headers
     */
    public static authenticate() {
        return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
            try {
                const { access_token: bearerAccessToken } = req.headers;
                if (!Helpers.isString(bearerAccessToken)) {
                    return res.status(CONSTANTS.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(APIResponse.error(MESSAGES.ERROR.ERR_UNAUTHORIZED));
                }

                const secret = process.env.ACCESS_TOKEN_SECRET;
                if (!Helpers.isString(secret)) {
                    return res
                        .status(CONSTANTS.HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR)
                        .json(APIResponse.error(MESSAGES.ERROR.ERR_INTERNAL_SERVER_ERROR));
                }

                const accessToken = bearerAccessToken.replace('Bearer ', '');
                const payload = jwt.verify(accessToken, secret);
                if (!UserDTO.is(payload)) {
                    return res.status(CONSTANTS.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(APIResponse.error(MESSAGES.ERROR.ERR_UNAUTHORIZED));
                }

                const userDTO = await UserService.findByUsername(payload.username);
                if (!userDTO) {
                    return res.status(CONSTANTS.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(APIResponse.error(MESSAGES.ERROR.ERR_UNAUTHORIZED));
                }

                req.userPayload = payload;

                next();
            } catch (e) {
                return res.status(CONSTANTS.HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(APIResponse.error(MESSAGES.ERROR.ERR_UNAUTHORIZED));
            }
        };
    }
}
