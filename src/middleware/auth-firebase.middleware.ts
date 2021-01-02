import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import admin from 'firebase-admin';

@Injectable()
export class AuthFirebaseMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: any) {
    const header = req.headers?.authorization;
    if (header && header.split(' ')[0] === 'Bearer') {
      const idToken = header.split('Bearer ')[1];

      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.currentUser = decodedToken;
      } catch (error) {
        if (error.code === 'auth/argument-error') {
          throw new UnauthorizedException('Invalid token.');
        }
      }
    } else {
      req.currentUser = null;
    }
    next();
  }
}
