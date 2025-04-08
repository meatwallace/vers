import type { AvatarAppState } from '@vers/idle-core';
import { classes } from '@vers/data';
import { Heading } from '@vers/design-system';
import { AttackTimerBar } from './attack-timer-bar.tsx';
import * as styles from './avatar-info.styles.ts';
import { LifeBar } from './life-bar.tsx';

interface AvatarInfoProps {
  avatar: AvatarAppState;
}

export function AvatarInfo(props: AvatarInfoProps) {
  const classData = classes[props.avatar.class];

  const lastAttackTime =
    props.avatar.behaviours.avatarWeaponAttack?.lastAttackTime ?? 0;

  const attackSpeed = props.avatar.mainHandAttack?.speed ?? 0;
  const nextAttackTime = lastAttackTime + 1000 / attackSpeed;

  return (
    <div className={styles.avatarInfo}>
      <Heading className={styles.avatarName} level={4}>
        {props.avatar.name}
      </Heading>
      <LifeBar life={props.avatar.life} maxLife={props.avatar.maxLife} />
      <AttackTimerBar
        isAlive={props.avatar.isAlive}
        lastAttackTime={lastAttackTime}
        nextAttackTime={nextAttackTime}
      />
      <img
        alt={props.avatar.name}
        className={styles.avatarImage}
        src={classData.images.unitFrame}
      />
    </div>
  );
}
