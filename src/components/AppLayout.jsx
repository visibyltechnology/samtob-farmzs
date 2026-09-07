import React from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppCartDrawer from './UX/WhatsAppCartDrawer';
import InstantQuoteBuilder from './UX/InstantQuoteBuilder';
import SubscriptionModal from './Subscriptions/SubscriptionModal';
import FloatingWidgets from './FloatingWidgets';
import ScrollToTop from './ScrollToTop';
import { useModal } from '../context/ModalContext';

export default function AppLayout({ children }) {
  const { isCartOpen, closeCart, isQuoteOpen, closeQuote, isSubOpen, closeSub } = useModal();

  return (
    <ReactLenis root>
      <ScrollToTop />
      <Navbar />
      <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
        {children}
      </main>
      <Footer />
      <FloatingWidgets />
      <WhatsAppCartDrawer isOpen={isCartOpen} onClose={closeCart} />
      <InstantQuoteBuilder isOpen={isQuoteOpen} onClose={closeQuote} />
      <SubscriptionModal isOpen={isSubOpen} onClose={closeSub} />
    </ReactLenis>
  );
}
