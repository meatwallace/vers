import { CheckboxField } from '@vers/design-system';
import { toggleAxesHelper } from '../state/toggle-axes-helper.ts';
import { toggleDevCamera } from '../state/toggle-dev-camera.ts';
import { useIsAxesHelperVisible } from '../state/use-is-axes-helper-visible.ts';
import { useIsDevCameraActive } from '../state/use-is-dev-camera-active.ts';
import * as styles from './dev-tools.styles.ts';

export function DevTools() {
  const isDevCameraActive = useIsDevCameraActive();
  const isAxesHelperVisible = useIsAxesHelperVisible();

  return (
    <div className={styles.container}>
      <CheckboxField
        checkboxProps={{
          checked: isDevCameraActive,
          onClick: toggleDevCamera,
        }}
        errors={[]}
        labelProps={{ children: 'Dev Camera' }}
      />
      <CheckboxField
        checkboxProps={{
          checked: isAxesHelperVisible,
          onClick: toggleAxesHelper,
        }}
        errors={[]}
        labelProps={{ children: 'Axes Helper' }}
      />
    </div>
  );
}
