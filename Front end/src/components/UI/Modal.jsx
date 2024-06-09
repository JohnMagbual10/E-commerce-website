// File: ./components/UI/Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Close Modal</button>
      </div>
    </div>
  );
};

export default Modal;
