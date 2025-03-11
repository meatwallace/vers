import { type ReactNode } from 'react';

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
  return <div>{children}</div>;
}

function Header({ children }: HeaderProps) {
  return <div>{children}</div>;
}

function Title({ children }: TitleProps) {
  return <h2>{children}</h2>;
}

function Body({ children }: BodyProps) {
  return <div>{children}</div>;
}

Card.Header = Header;
Card.Title = Title;
Card.Body = Body;
