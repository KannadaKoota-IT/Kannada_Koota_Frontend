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
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(852);

  const openMembership = () => setIsMembershipOpen(true);
  const closeMembership = () => setIsMembershipOpen(false);

  const handleMemberRegistered = () => {
    setMemberCount((prev) => prev + 1);
  };

  return (
    <MembershipContext.Provider
      value={{
        isMembershipOpen,
        openMembership,
        closeMembership,
        memberCount,
        handleMemberRegistered,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};
