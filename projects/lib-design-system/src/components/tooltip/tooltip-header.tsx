import { BackgroundPattern } from '../background-pattern/background-pattern.tsx';
import { withContext } from './context.ts';

interface TooltipHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TooltipHeader(props: TooltipHeaderProps) {
  const { children, className, ...restProps } = props;

  return (
    <header className={className} {...restProps}>
      {children}
      <TooltipHeaderBackground />
    </header>
  );
}

const TooltipHeaderBackground = withContext(
  BackgroundPattern,
  'headerBackground',
);
