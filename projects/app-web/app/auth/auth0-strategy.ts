import { OAuth2Strategy } from 'remix-auth-oauth2';
import { Strategy } from 'remix-auth/strategy';

type Auth0StrategyOptions = {
  audience: string;
} & OAuth2Strategy.ConstructorOptions;

export class Auth0Strategy<User> extends OAuth2Strategy<User> {
  private audience: string;

  constructor(
    options: Auth0StrategyOptions,
    verify: Strategy.VerifyFunction<User, OAuth2Strategy.VerifyOptions>,
  ) {
    const { audience, ...rest } = options;

    super(rest, verify);

    this.audience = audience;
  }

  protected authorizationParams(params: URLSearchParams) {
    if (this.audience) {
      params.set('audience', this.audience);
    }

    return params;
  }
}
