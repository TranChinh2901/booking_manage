import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f0f9ff] text-[#0c3144]">
      {children}
    </main>
  );
}
