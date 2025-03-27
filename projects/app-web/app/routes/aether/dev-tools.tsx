import { CheckboxField } from '@vers/design-system';
import * as styles from './dev-tools.styles.ts';
import { toggleAxesHelper } from './toggle-axes-helper';
import { toggleDevCamera } from './toggle-dev-camera';
import { useIsAxesHelperVisible } from './use-is-axes-helper-visible.ts';
import { useIsDevCameraActive } from './use-is-dev-camera-active';

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
