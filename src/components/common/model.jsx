import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md', // 'sm', 'md', 'lg', 'xl', 'full'
  closeOnClickOutside = true,
  showCloseButton = true,
}) => {
  const modalRef = useRef(null);
  
  // Size classes for the modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Remove body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  // Handle click outside
  const handleBackdropClick = (event) => {
    if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };
  
  // Don't render anything if modal is not open
  if (!isOpen) return null;
  
  // Create portal to render modal at the end of the document body
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50 animate-fade-in">
      <div className="relative w-full px-4 py-6 mx-auto" onClick={handleBackdropClick}>
        <div 
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl overflow-hidden mx-auto animate-slide-in ${sizeClasses[size] || sizeClasses.md}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            
            {showCloseButton && (
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-full p-1.5 inline-flex items-center justify-center"
                onClick={onClose}
                aria-label="Close"
              >
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Modal body */}
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-14rem)]">
            {children}
          </div>
          
          {/* Modal footer */}
          {footer && (
            <div className="flex items-center justify-end p-4 border-t border-gray-200 gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

// Default footer with cancel and confirm buttons
Modal.Footer = ({ onCancel, onConfirm, cancelText = 'Cancel', confirmText = 'Confirm', isLoading = false }) => {
  return (
    <>
      <Button variant="outline" onClick={onCancel} disabled={isLoading}>
        {cancelText}
      </Button>
      <Button onClick={onConfirm} isLoading={isLoading}>
        {confirmText}
      </Button>
    </>
  );
};

export default Modal;
