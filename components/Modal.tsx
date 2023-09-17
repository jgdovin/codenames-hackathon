import { activeTeamColor } from '@/lib/user';
import { cn } from '@/lib/util/cn';
import React, { useState, useEffect } from 'react';

interface ModalProps {
  children: React.ReactNode;
  activeColor: string;
}

const Modal: React.FC<ModalProps> = ({ children, activeColor }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [isHidden, setIsHidden] = useState<boolean>(true);
  useEffect(() => {
    // Automatically close the modal after 2 seconds
    setIsHidden(false);
    const timer = setTimeout(() => {
      setIsHidden(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 500);
    }, 2000);
  }, []);

  const borderColor =
    activeColor === 'red' ? 'border-red-700' : 'border-blue-700';
  return (
    <>
      {isModalOpen && (
        <div className={cn('fixed inset-0 flex items-center justify-center z-50 transition-all duration-500 ease-in-out', isHidden && 'opacity-0')}>
          <div className='modal-bg fixed inset-0 bg-black opacity-50 z-40'></div>
          <div
            className={cn(
              'modal-content z-50 bg-neutral font-bold p-4 rounded-lg shadow-md text-black text-5xl border-4',
              borderColor
            )}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
