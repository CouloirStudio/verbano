import React from 'react';

type ButtonProps = {
	children: React.ReactNode;
	onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({children, onClick}) => (
	<button onClick={onClick}>{children}</button>
);

export default Button;
