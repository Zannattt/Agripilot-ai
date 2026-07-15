import type { HTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../utils/helpers';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
  children: ReactNode;
}

export default function Card({ hover, glass, children, className, ...rest }: CardProps) {
  return (
    <div
      className={classNames('card', hover && 'card--hover', glass && 'card--glass', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
