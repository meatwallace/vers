import type { CharacterAppState } from '@vers/idle-core';
import { Heading } from '@vers/design-system';
import { AttackTimerBar } from './attack-timer-bar';
import * as styles from './character-info.styles.ts';
import { LifeBar } from './life-bar';

interface CharacterInfoProps {
  character: CharacterAppState;
}

export function CharacterInfo(props: CharacterInfoProps) {
  const lastAttackTime =
    props.character.behaviours.playerWeaponAttack?.lastAttackTime ?? 0;

  const attackSpeed = props.character.mainHandAttack?.speed ?? 0;
  const nextAttackTime = lastAttackTime + 1000 / attackSpeed;

  return (
    <div className={styles.characterInfo}>
      <Heading className={styles.characterName} level={4}>
        {props.character.name}
      </Heading>
      <LifeBar life={props.character.life} maxLife={props.character.maxLife} />
      <AttackTimerBar
        isAlive={props.character.isAlive}
        lastAttackTime={lastAttackTime}
        nextAttackTime={nextAttackTime}
      />
      <img
        alt={props.character.name}
        className={styles.characterImage}
        src={props.character.image}
      />
    </div>
  );
}
