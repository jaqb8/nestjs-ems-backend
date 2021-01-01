import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import admin from 'firebase-admin';

@Injectable()
export class AuthFirebaseMiddleware implements NestMiddleware {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: 'https://ems-employee-managment-system.firebaseio.com',
    });
  }

  async use(req: any, res: any, next: any) {
    const header = req.headers?.authorization;
    if (
      header !== 'Bearer null' &&
      req.headers?.authorization.split('Bearer ')
    ) {
      const idToken = req.headers.authorization.split('Bearer ')[1];

      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req['currentUser'] = decodedToken;
      } catch (error) {
        console.log(error);
      }
    }

    next();
  }
}
// TODO - GetUser decorator
