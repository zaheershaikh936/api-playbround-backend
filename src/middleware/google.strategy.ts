import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { Injectable } from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class GoogleAuth extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: String(process.env.CLIENTID),
      clientSecret: String(process.env.CLIENTSECRET),
      callbackURL: `${process.env.CALLBACKURL}/api/v1/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, email, photos } = profile;
    const user = {
      email: email,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
