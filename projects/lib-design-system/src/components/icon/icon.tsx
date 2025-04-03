import {
  GiAchievement,
  GiAnvil,
  GiCharacter,
  GiChest,
  GiCog,
  GiCrossedSwords,
  GiGriffinShield,
  GiHangingSign,
  GiOpenBook,
  GiPolarStar,
  GiStarSwirl,
} from 'react-icons/gi';
import { TbAlertSmall, TbCheck, TbCopy, TbMenu2 } from 'react-icons/tb';

export const Icon = {
  Alert: TbAlertSmall,
  Checkmark: TbCheck,
  Clipboard: TbCopy,
  Menu: TbMenu2,

  // feature specific
  Account: GiCog,
  Aether: GiStarSwirl,
  Arena: GiCrossedSwords,
  Avatar: GiCharacter,
  Forge: GiAnvil,
  Guild: GiGriffinShield,
  Leaderboard: GiAchievement,
  Market: GiHangingSign,
  Nexus: GiPolarStar,
  Stash: GiChest,
  Wiki: GiOpenBook,
};
