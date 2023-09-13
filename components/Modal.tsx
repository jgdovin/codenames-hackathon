import React, { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(isOpen);

  useEffect(() => {
    setIsModalOpen(isOpen);

    // Automatically close the modal after 2 seconds
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-bg fixed inset-0 bg-black opacity-50"></div>
          <div className="modal-content bg-white p-4 rounded-lg shadow-md">
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
