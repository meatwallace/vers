import { createStyleContext } from '../../utils/create-style-context.tsx';
import { tooltip } from './tooltip.styles.ts';

const styleContext = createStyleContext(tooltip);

export const { withContext, withProvider } = styleContext;
