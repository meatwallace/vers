import { Text } from '../text/text';
import { Card } from './card';

export const Default = () => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>A Title For A Card</Card.Title>
      </Card.Header>
      <Card.Body>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </Card.Body>
    </Card>
  );
};
