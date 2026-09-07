import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openQuote = () => setIsQuoteOpen(true);
  const closeQuote = () => setIsQuoteOpen(false);
  const openSub = () => setIsSubOpen(true);
  const closeSub = () => setIsSubOpen(false);

  return (
    <ModalContext.Provider value={{ 
      isCartOpen, openCart, closeCart, 
      isQuoteOpen, openQuote, closeQuote,
      isSubOpen, openSub, closeSub
    }}>
      {children}
    </ModalContext.Provider>
  );
}
