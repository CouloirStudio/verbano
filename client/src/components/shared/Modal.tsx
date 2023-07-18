import React, {type ReactNode} from 'react';

type ModalProps = {
	children: ReactNode;
};

const Modal: React.FC<ModalProps> = ({children}) =>
// Implement modal logic here

	<div>{children}</div>;
export default Modal;
