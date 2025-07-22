import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {


  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;

    const email = profile.emails?.[0]?.value;
    const emailDomain = email.split('@')[1];

    const allowedDomain = 'ujcv.edu.hn';
    if (emailDomain !== allowedDomain) {
      return done(new UnauthorizedException('Email domain not allowed'), false);
    }

    const user = {
      email: emails[0].value,
      oauthId: profile.id,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos?.[0]?.value,
      accessToken,
    };
    done(null, user);
  }
}
