import React, {type ReactNode} from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

type LayoutProps = {
	children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({children}) => (
	<div>
		<Header />
		<Sidebar />
		{children}
	</div>
);

export default Layout;
