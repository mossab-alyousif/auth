import express, { Request, Response, NextFunction } from 'express';
import jsonwebtoken from 'jsonwebtoken';

async function checkTokenSetUser(req: any, res: Response, next: NextFunction) {
  const authHeader = req.get('Authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decodedUser = await jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
        req.user = decodedUser;
        next();
      } catch {
        next();
      }
    } else {
      next();
    }
  } else {
    next();
  }
}

function isLoggedIn(req: any, res: Response, next: NextFunction) {
  if (req.user) {
    next();
  } else {
    const error = new Error('Un-Authorized');
    res.status(401);
    next(error);
  }
}

export default {
  checkTokenSetUser,
  isLoggedIn
};
