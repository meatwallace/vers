interface IEquipment {
  id: string;
  name: string;
}

export interface EquipmentWeapon extends IEquipment {
  maxDamage: number;
  minDamage: number;
  speed: number;
}

export enum EquipmentSlot {
  MainHand = 'main_hand',
  OffHand = 'off_hand',
}
