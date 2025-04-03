import { Spinner } from '@vers/design-system';
import { cx } from '@vers/styled-system/css';
import * as styles from './aether-node.styles.ts';
import { ActivityInfo } from './components/activity-info';
import { AvatarInfo } from './components/avatar-info';
import { EnemyInfo } from './components/enemy-info';
import { useActivity } from './state/use-activity';
import { useAvatar } from './state/use-avatar';

export function AetherNode() {
  const activity = useActivity();
  const avatar = useAvatar();

  if (!activity || !avatar) {
    return <Spinner />;
  }

  const enemies = activity.currentEnemyGroup?.enemies.reverse() ?? [];

  return (
    <div className={styles.container}>
      <section className={cx(styles.section, styles.avatarSection)}>
        <ActivityInfo activity={activity} />
        <AvatarInfo avatar={avatar} />
      </section>
      <section className={cx(styles.section, styles.enemySection)}>
        {enemies.map((enemy) => (
          <EnemyInfo key={enemy.id} enemy={enemy} />
        ))}
      </section>
    </div>
  );
}
