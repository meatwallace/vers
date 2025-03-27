import { Spinner } from '@vers/design-system';
import { cx } from '@vers/styled-system/css';
import * as styles from './aether-node.styles.ts';
import { ActivityInfo } from './components/activity-info';
import { CharacterInfo } from './components/character-info';
import { EnemyInfo } from './components/enemy-info';
import { useActivity } from './state/use-activity';
import { useCharacter } from './state/use-character';

export function AetherNode() {
  const activity = useActivity();
  const character = useCharacter();

  if (!activity || !character) {
    return <Spinner />;
  }

  const enemies = activity.currentEnemyGroup?.enemies.reverse() ?? [];

  return (
    <div className={styles.container}>
      <section className={cx(styles.section, styles.characterSection)}>
        <ActivityInfo activity={activity} />
        <CharacterInfo character={character} />
      </section>
      <section className={cx(styles.section, styles.enemySection)}>
        {enemies.map((enemy) => (
          <EnemyInfo key={enemy.id} enemy={enemy} />
        ))}
      </section>
    </div>
  );
}
