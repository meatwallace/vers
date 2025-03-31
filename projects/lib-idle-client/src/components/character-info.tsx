import type { CharacterAppState } from '@vers/idle-core';
import { Heading } from '@vers/design-system';
import { css } from '@vers/styled-system/css';
import { AttackTimerBar } from './attack-timer-bar';
import { LifeBar } from './life-bar';

const characterInfo = css({
  backgroundColor: 'gray.900',
  borderColor: 'gray.700',
  borderWidth: '1',
  boxShadow: 'md',
  padding: '2',
  rounded: 'md',
});

const characterName = css({
  marginBottom: '0',
  textAlign: 'right',
});

interface CharacterInfoProps {
  character: CharacterAppState;
}

export function CharacterInfo(props: CharacterInfoProps) {
  const lastAttackTime =
    props.character.behaviours.playerWeaponAttack?.lastAttackTime ?? 0;

  const attackSpeed = props.character.mainHandAttack?.speed ?? 0;
  const nextAttackTime = lastAttackTime + 1000 / attackSpeed;

  return (
    <div className={characterInfo}>
      <Heading className={characterName} level={4}>
        {props.character.name}
      </Heading>
      <LifeBar life={props.character.life} maxLife={props.character.maxLife} />
      <AttackTimerBar
        isAlive={props.character.isAlive}
        lastAttackTime={lastAttackTime}
        nextAttackTime={nextAttackTime}
      />
    </div>
  );
}
