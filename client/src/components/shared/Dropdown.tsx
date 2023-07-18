import React, {type ReactNode} from 'react';

type DropdownProps = {
	children: ReactNode;
};

const Dropdown: React.FC<DropdownProps> = ({children}) =>
// Implement dropdown logic here

	<div>{children}</div>;
export default Dropdown;
