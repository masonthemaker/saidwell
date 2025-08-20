"use client";

import { PiWarningDuotone, PiXDuotone } from "react-icons/pi";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  itemName?: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'warning',
  itemName
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-400',
          iconBg: 'bg-red-500/20',
          confirmBtn: 'bg-red-500/20 hover:bg-red-500/40 text-red-300 border-red-500/30 hover:border-red-500/60'
        };
      case 'warning':
        return {
          icon: 'text-yellow-400',
          iconBg: 'bg-yellow-500/20',
          confirmBtn: 'bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 border-yellow-500/30 hover:border-yellow-500/60'
        };
      case 'info':
        return {
          icon: 'text-[var(--color-sky-blue)]',
          iconBg: 'bg-[var(--color-sky-blue)]/20',
          confirmBtn: 'bg-[var(--color-sky-blue)]/20 hover:bg-[var(--color-sky-blue)]/40 text-[var(--color-sky-blue)] border-[var(--color-sky-blue)]/30 hover:border-[var(--color-sky-blue)]/60'
        };
    }
  };

  const styles = getVariantStyles();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl backdrop-saturate-150 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${styles.iconBg} rounded-lg`}>
                <PiWarningDuotone className={`w-5 h-5 ${styles.icon}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white/90">{title}</h3>
                {itemName && (
                  <p className="text-sm text-white/60 mt-1">
                    <span className="font-medium text-white/80">"{itemName}"</span>
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/30 transition-all duration-300"
            >
              <PiXDuotone className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-white/80 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 hover:border-white/30 rounded-lg text-sm font-medium transition-all duration-300"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-300 ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
