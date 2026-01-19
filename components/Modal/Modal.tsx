'use client';

import { useEffect, useCallback } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import css from './Modal.module.css';

interface ModalProps {
  children: ReactNode;
  isOpen?: boolean; // Робимо необов'язковим
  onClose?: () => void; // Робимо необов'язковим
}

export default function Modal({ children, isOpen = true, onClose }: ModalProps) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  }, [onClose, router]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    },
    [handleClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onKeyDown]);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Якщо isOpen === false, нічого не малюємо
  if (!isOpen) return null;

  // Перевірка на браузер (SSR)
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        {/* <button className={css.closeBtn} onClick={handleClose} type="button" aria-label="Close">
          ×
        </button> */}
        {children}
      </div>
    </div>,
    document.body
  );
}
