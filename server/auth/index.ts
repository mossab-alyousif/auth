import express, { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

import { Constants } from '../utils/constants';
import { CredentialsValidator } from '../validators';
import { UserModel } from '../models';
import db from '../db/connection';

const users = db.get('users');
users.createIndex('username', { unique: true });

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'auth router!'
  });
});

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  const result = CredentialsValidator.getSchema().validate(req.body);
  if (result.error) {
    next(result.error);
  } else {
    const dbUser = await users.findOne({ username: req.body.username });
    if (dbUser) {
      next(new Error('username already exists'));
    } else {
      const hashedPassword = await bcryptjs.hash(req.body.password, 12);

      const newUser: UserModel = {
        username: req.body.username,
        password: hashedPassword
      };

      const insertedUser: UserModel = await users.insert(newUser);

      const payload = {
        _id: insertedUser._id,
        username: insertedUser.username
      };

      const token = await jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1d' });

      res.header({ token });
      res.json(payload);
    }
  }
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const result = CredentialsValidator.getSchema().validate(req.body);
  if (result.error) {
    res.statusCode = 400;
    next(new Error(Constants.LOGIN_ERROR));
  } else {
    const dbUser: UserModel = await users.findOne({ username: req.body.username });

    if (dbUser === null) {
      res.statusCode = 400;
      next(new Error(Constants.LOGIN_ERROR));
    } else {
      const isPasswordsMatching = await bcryptjs.compare(req.body.password, dbUser.password);

      if (isPasswordsMatching) {
        const payload = {
          _id: dbUser._id,
          username: dbUser.username
        };
        const token = await jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '1d' });

        res.header({ token });
        res.json(payload);
      } else {
        res.statusCode = 400;
        next(new Error(Constants.LOGIN_ERROR));
      }
    }
  }
});

export default router;
