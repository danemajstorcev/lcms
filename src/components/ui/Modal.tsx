import { type ReactNode } from 'react';

interface ModalProps {
  title:     string;
  subtitle?: string;
  onClose:   () => void;
  children:  ReactNode;   // should include modal__body + modal__footer
}

export default function Modal({ title, subtitle, onClose, children }: ModalProps) {
  // Close on overlay click only (not on modal itself)
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal fade-in">
        <div className="modal__header">
          <div>
            <div className="modal__title">{title}</div>
            {subtitle && <div className="modal__subtitle">{subtitle}</div>}
          </div>
          <button className="modal__close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Form components render modal__body + modal__footer as children */}
        {children}
      </div>
    </div>
  );
}
