import { Spinner } from '@vers/design-system';
import { css, cx } from '@vers/styled-system/css';
import { ActivityInfo } from './components/activity-info';
import { CharacterInfo } from './components/character-info';
import { EnemyInfo } from './components/enemy-info';
import { useActivity } from './state/use-activity';
import { useCharacter } from './state/use-character';

const container = css({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  height: 'full',
  maxHeight: 'full',
  width: 'full',
});

const section = css({
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '2',
});

const characterSection = css({
  flex: '1',
});

const enemySection = css({
  alignItems: 'flex-start',
  columnGap: '2',
  display: 'flex',
  flex: '1',
  flexDirection: 'column-reverse',
  flexWrap: 'wrap-reverse',
  justifyContent: 'flex-end',
  rowGap: '3',
});

export function AetherNode() {
  const activity = useActivity();
  const character = useCharacter();

  if (!activity || !character) {
    return <Spinner />;
  }

  const enemies = activity.currentEnemyGroup?.enemies.reverse() ?? [];

  return (
    <div className={container}>
      <section className={cx(section, characterSection)}>
        <ActivityInfo activity={activity} />
        <CharacterInfo character={character} />
      </section>
      <section className={cx(section, enemySection)}>
        {enemies.map((enemy) => (
          <EnemyInfo key={enemy.id} enemy={enemy} />
        ))}
      </section>
    </div>
  );
}
