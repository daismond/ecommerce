import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Header from './Header';
import Footer from './Footer';
import { CartDrawer } from '../cart/CartDrawer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <CartDrawer />
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
