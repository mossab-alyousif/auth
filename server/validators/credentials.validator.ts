import Joi from 'joi';
import { Constants } from '../utils/constants';

export class CredentialsValidator {
  static getSchema(): Joi.Schema {
    return Joi.object({
      username: Joi.string().trim().min(7).max(256).required(),
      email: Joi.string().trim().min(7).max(256).email(),
      password: Joi.string().trim().pattern(new RegExp(Constants.PASSWORD_PATTERN))
    });
  }
}
