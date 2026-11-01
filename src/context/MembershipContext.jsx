import React, { createContext, useContext, useState } from 'react';

const MembershipContext = createContext();

export const useMembership = () => {
  const context = useContext(MembershipContext);
  if (!context) {
    throw new Error('useMembership must be used within a MembershipProvider');
  }
  return context;
};

export const MembershipProvider = ({ children }) => {
  const whatsappUrl =
    process.env.NEXT_PUBLIC_WHATSAPP ||
    process.env.WHATSAPP ||
    'https://chat.whatsapp.com/G8aX4QWEiYFEWvz7dGK0XJ';

  const [memberCount, setMemberCount] = useState(852);

  const openMembership = () => {
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };
  const closeMembership = () => {};

  const handleMemberRegistered = () => {
    setMemberCount((prev) => prev + 1);
  };

  return (
    <MembershipContext.Provider
      value={{
        isMembershipOpen: false,
        openMembership,
        closeMembership,
        memberCount,
        handleMemberRegistered,
        whatsappUrl,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};
