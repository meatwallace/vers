import { type ReactNode } from 'react';
import * as styles from './card.css.ts';

interface CardProps {
  children: ReactNode;
}

interface HeaderProps {
  children: ReactNode;
}

interface TitleProps {
  children: ReactNode;
}

interface BodyProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  return <div className={styles.card}>{children}</div>;
}

function Header({ children }: HeaderProps) {
  return <div className={styles.header}>{children}</div>;
}

function Title({ children }: TitleProps) {
  return <h2 className={styles.title}>{children}</h2>;
}

function Body({ children }: BodyProps) {
  return <div className={styles.body}>{children}</div>;
}

Card.Header = Header;
Card.Title = Title;
Card.Body = Body;
