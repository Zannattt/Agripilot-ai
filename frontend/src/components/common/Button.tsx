import { useRef, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';
import { classNames } from '../../utils/helpers';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  children,
  onClick,
  className,
  ...rest
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (el && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      const d = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${d}px`;
      ripple.style.left = `${e.clientX - rect.left - d / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - d / 2}px`;
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
    onClick?.(e);
  }

  return (
    <button
      ref={ref}
      className={classNames(
        'btn',
        `btn--${variant}`,
        size !== 'md' && `btn--${size}`,
        block && 'btn--block',
        className,
      )}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}
