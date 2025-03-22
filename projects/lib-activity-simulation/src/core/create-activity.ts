import type {
  Activity,
  ActivityData,
  ActivityState,
  EnemyGroup,
  SimulationContext,
} from '~/types';
import { getEnemyGroups } from './utils/get-enemy-groups';

interface ActivityConfig {
  groupCount?: number;
  groupSize?: number;
}

export function createActivity(
  data: ActivityData,
  ctx: SimulationContext,
  config: ActivityConfig = {},
): Activity {
  let elapsed = 0;
  let currentEnemyGroupIdx = 0;

  const enemyGroups: Array<EnemyGroup> = getEnemyGroups(data, ctx, config);

  const isEnemyGroupsRemaining = () => {
    return enemyGroups.some((group) => group.remaining > 0);
  };

  const moveToNextEnemyGroup = () => {
    currentEnemyGroupIdx++;
  };

  const elapseTime = (time: number) => {
    elapsed += time;
  };

  const getState = (): ActivityState => {
    return {
      enemyGroups: enemyGroups.map((group) => group.getState()),
    };
  };

  return {
    // meta
    enemyGroups,
    id: data.id,
    type: data.type,

    // getters
    get currentEnemyGroup() {
      return enemyGroups[currentEnemyGroupIdx];
    },
    get elapsed() {
      return elapsed;
    },
    get isEnemyGroupsRemaining() {
      return isEnemyGroupsRemaining();
    },

    // core
    getState,

    // utils
    elapseTime,
    moveToNextEnemyGroup,
  };
}
