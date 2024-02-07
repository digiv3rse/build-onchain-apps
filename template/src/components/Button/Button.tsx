import { MouseEventHandler, ReactNode } from 'react';
import clsx from 'clsx';

type ButtonProps = {
  buttonContent: ReactNode | string;
  isSubmit?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  icon?: ReactNode;
  rounded?: boolean;
};

export default function Button({
  buttonContent,
  isSubmit,
  className,
  onClick,
  variant = 'primary',
  disabled = false,
  icon,
  rounded = true,
}: ButtonProps) {
  return (
    <button
      type={isSubmit ? 'submit' : 'button'}
      onClick={onClick}
      className={clsx(
        'flex w-full items-center justify-center',
        'py-4 text-sm',
        variant === 'primary' ? 'bg-white' : 'bg-black',
        variant === 'primary' ? 'text-black' : 'text-white',
        disabled && variant === 'primary' ? 'bg-gray-400' : null,
        disabled && variant === 'secondary' ? 'bg-boat-color-gray-900' : null,
        rounded ? 'rounded-full' : null,
        className,
      )}
      disabled={disabled}
    >
      {icon ? <span className="mr-2">{icon}</span> : null}
      {buttonContent}
    </button>
  );
}
