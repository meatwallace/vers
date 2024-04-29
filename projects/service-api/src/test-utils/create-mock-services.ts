import { Services } from '../types';

export function createMockServices(): Services {
  return {
    users: {
      getCurrentUser: vi.fn(),
      getOrCreateUser: vi.fn(),
    },
  };
}
