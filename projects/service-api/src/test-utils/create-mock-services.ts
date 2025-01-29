import { vi } from 'vitest';
import { Services } from '../types';

export function createMockServices(): Services {
  return {
    email: {
      sendEmail: vi.fn(),
    },
    user: {
      createUser: vi.fn(),
      getUser: vi.fn(),
      verifyPassword: vi.fn(),
    },
    world: {
      createWorld: vi.fn(),
      generateWorldNames: vi.fn(),
      getWorld: vi.fn(),
      getWorlds: vi.fn(),
      deleteWorld: vi.fn(),
      updateWorld: vi.fn(),
    },
    verification: {
      createVerification: vi.fn(),
      verifyCode: vi.fn(),
    },
    session: {
      createSession: vi.fn(),
      getSessions: vi.fn(),
      refreshTokens: vi.fn(),
      deleteSession: vi.fn(),
    },
  };
}
