import React, { createContext, useContext, useState, useEffect } from 'react';

interface IsTouchDeviceContextType {
  isTouchDevice: boolean;
}

export const IsTouchDeviceContext = createContext<IsTouchDeviceContextType | undefined>(undefined);

export const IsTouchDeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);

  useEffect(() => {
    const result = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    console.log(`is touch device: ${result}`);
    setIsTouchDevice(result);
  }, []);

  return (
    <IsTouchDeviceContext.Provider value={{isTouchDevice}}>
      {children}
    </IsTouchDeviceContext.Provider>
  );
};

export const useIsTouchDevice = (): IsTouchDeviceContextType => {
  const context = useContext(IsTouchDeviceContext);
  if (context === undefined) {
    throw new Error('useIsTouchDevice must be used within an IsTouchDeviceProvider');
  }
  return context;
};
