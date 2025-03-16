// General errors
export const UNKNOWN_ERROR = {
  message: 'An unknown error occurred',
  title: 'Unknown error occurred',
};

// Verification errors
export const INVALID_OTP_ERROR = {
  message: 'Invalid verification code',
  title: 'Invalid code',
};

// Authentication errors
export const INVALID_CREDENTIALS_ERROR = {
  message: 'Wrong email or password',
  title: 'Invalid credentials',
};

export const INVALID_PASSWORD_ERROR = {
  message: 'Wrong password',
  title: 'Invalid password',
};

// 2FA errors
export const TWO_FACTOR_NOT_ENABLED_ERROR = {
  message: '2FA is not enabled for your account.',
  title: '2FA not enabled',
};

export const TWO_FACTOR_ALREADY_ENABLED_ERROR = {
  message: '2FA is already enabled for your account.',
  title: '2FA already enabled',
};
