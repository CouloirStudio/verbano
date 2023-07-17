import React, { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  // Implement modal logic here

  return <div>{children}</div>;
};

export default Modal;
