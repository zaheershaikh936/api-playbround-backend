import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITCLIENTID,
      clientSecret: process.env.GITCLIENTSECRET,
      callbackURL: `${process.env.CALLBACKURL}/api/v1/auth/github/callback`,
      scope: ['public_profile'],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    return profile;
  }
}
