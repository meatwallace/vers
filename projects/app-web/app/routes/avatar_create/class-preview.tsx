import { Class, classes } from '@vers/data';
import { BackgroundPattern, Text } from '@vers/design-system';
import { cx } from '@vers/styled-system/css';
import * as styles from './class-preview.styles';

interface Props {
  class: (typeof Class)[keyof typeof Class];
  isSelected: boolean;
  onClick: (classID: (typeof Class)[keyof typeof Class]) => void;
  tabIndex: number;
}

export function ClassPreview(props: Props) {
  const classData = classes[props.class];

  const handleClick = () => {
    props.onClick(props.class);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      props.onClick(props.class);
    }
  };

  return (
    <div
      aria-checked={props.isSelected}
      className={cx(styles.container, props.isSelected && styles.selected)}
      role="radio"
      tabIndex={props.tabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.contentContainer}>
        <header className={styles.header}>
          <Text className={styles.name}>{classData.name}</Text>
          <BackgroundPattern className={styles.headerBackgroundPattern} />
        </header>
        <div className={styles.flavourTextContainer}>
          {classData.description.map((description) => (
            <Text key={description} className={styles.flavourText}>
              {description}
            </Text>
          ))}
        </div>
      </div>
      <img
        alt={classData.name}
        className={styles.image}
        src={classData.images.full}
      />
      <BackgroundPattern className={styles.backgroundPattern} />
    </div>
  );
}
