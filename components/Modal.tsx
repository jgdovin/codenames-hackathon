import { activeTeamColor } from '@/lib/user';
import { cn } from '@/lib/util/cn';
import React, { useState, useEffect } from 'react';

interface ModalProps {
  children: React.ReactNode,
  activeColor: string
}

const Modal: React.FC<ModalProps> = ({ children, activeColor }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  useEffect(() => {
  // Automatically close the modal after 2 seconds

    const timer = setTimeout(() => {
      setIsModalOpen(false);
    }, 2000);

  }, []);

  const borderColor = activeColor === 'red' ? 'border-red-700' : 'border-blue-700';
  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-bg fixed inset-0 bg-black opacity-50 z-40"></div>
          <div className={cn("modal-content z-50 bg-neutral font-bold p-4 rounded-lg shadow-md text-black text-5xl border-4", borderColor)}>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
