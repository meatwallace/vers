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
      getSessions: vi.fn(),
      refreshTokens: vi.fn(),
    },
    user: {
      createUser: vi.fn(),
      getUser: vi.fn(),
      verifyPassword: vi.fn(),
    },
    verification: {
      createVerification: vi.fn(),
      verifyCode: vi.fn(),
    },
    world: {
      createWorld: vi.fn(),
      deleteWorld: vi.fn(),
      generateWorldNames: vi.fn(),
      getWorld: vi.fn(),
      getWorlds: vi.fn(),
      updateWorld: vi.fn(),
    },
  };
}
