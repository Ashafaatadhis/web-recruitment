"use client";

import { Can } from "@casl/react";
import { useAbility } from "@/lib/casl/AbilityContext";

export default function CanWrapper({
  children,
  I,
  a,
}: {
  children: React.ReactNode;
  I: string;
  a: string;
}) {
  const ability = useAbility();

  return (
    <Can I={I} a={a} ability={ability}>
      {children}
    </Can>
  );
}
