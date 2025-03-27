import { Text } from '../text/text';
import { Tooltip } from './tooltip';

export const Default = () => {
  return (
    <Tooltip>
      <Tooltip.Header>Tooltip</Tooltip.Header>
      <Tooltip.Content>
        <Text>Some tooltip content</Text>
      </Tooltip.Content>
    </Tooltip>
  );
};
