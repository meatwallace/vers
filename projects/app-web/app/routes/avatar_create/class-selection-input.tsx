import { useId } from 'react';
import { Class } from '@vers/data';
import { ClassPreview } from './class-preview';
import * as styles from './class-selection-input.styles';

const sortedClasses = [Class.Brute, Class.Scoundrel, Class.Scholar];

interface Props {
  id?: string;
  onSelectClass: (classID: (typeof Class)[keyof typeof Class]) => void;
  selected?: (typeof Class)[keyof typeof Class];
}

export function ClassSelectionInput(props: Props) {
  const { onSelectClass, selected, ...restProps } = props;

  const fallbackID = useId();
  const id = props.id ?? fallbackID;

  return (
    <>
      <div className={styles.container}>
        <input {...restProps} id={id} />
        <label className={styles.label} htmlFor={id}>
          Choose Your Class
        </label>
        <div className={styles.classSelector}>
          {sortedClasses.map((classID, index) => (
            <ClassPreview
              key={classID}
              class={classID}
              isSelected={selected === classID}
              tabIndex={index}
              onClick={onSelectClass}
            />
          ))}
        </div>
      </div>
    </>
  );
}
