import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { CredentialsValidator } from '../validators';
import { UserModel } from '../models';
import db from '../db/connection';
import { nextTick } from 'process';
import bcryptjs from 'bcryptjs';

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
      delete insertedUser.password;
      res.json(insertedUser);
    }
  }
});

export default router;
