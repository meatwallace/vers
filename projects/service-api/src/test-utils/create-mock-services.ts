import { vi } from 'vitest';
import { Services } from '../types';

export function createMockServices(): Services {
  return {
    email: {
      sendEmail: vi.fn(),
    },
    session: {
      createSession: vi.fn(),
      deleteSession: vi.fn(),
      getSession: vi.fn(),
      getSessions: vi.fn(),
      refreshTokens: vi.fn(),
    },
    user: {
      changePassword: vi.fn(),
      createPasswordResetToken: vi.fn(),
      createUser: vi.fn(),
      getUser: vi.fn(),
      updateUser: vi.fn(),
      verifyPassword: vi.fn(),
    },
    verification: {
      createVerification: vi.fn(),
      deleteVerification: vi.fn(),
      get2FAVerificationURI: vi.fn(),
      getVerification: vi.fn(),
      updateVerification: vi.fn(),
      verifyCode: vi.fn(),
    },
  };
}
