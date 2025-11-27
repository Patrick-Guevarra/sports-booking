import React, { createContext, useContext, useState } from "react";

const RoleContext = createContext({
  role: "athlete",
  setRole: () => {},
  userId: null,
  setUserId: () => {},
  fullName: null,
  setFullName: () => {},
  email: null,
  setEmail: () => {},
});

export function RoleProvider({ children }) {
  const [role, setRole] = useState("athlete");
  const [userId, setUserId] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [email, setEmail] = useState(null);

  return (
    <RoleContext.Provider
      value={{ role, setRole, userId, setUserId, fullName, setFullName, email, setEmail }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
