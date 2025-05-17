"use client";

import React, { createContext, useContext } from "react";
import { AppAbility, defineAbilityFor } from "./ability";

// Create the ability context
const AbilityContext = createContext<AppAbility | undefined>(undefined);

// Create a provider component
export function AbilityProvider({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const ability = defineAbilityFor(role);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}

// Create a hook to use the ability context
export function useAbility() {
  const ability = useContext(AbilityContext);

  if (!ability) {
    throw new Error("useAbility must be used within an AbilityProvider");
  }

  return ability;
}
