import { useIsAxesHelperVisible } from './use-is-axes-helper-visible';

export function AxesHelper() {
  const isAxesHelperVisible = useIsAxesHelperVisible();

  return isAxesHelperVisible && <axesHelper args={[200]} />;
}
