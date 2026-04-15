import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { PageShell } from "@/components/layout/page-shell";
import { Navbar } from "@/components/travel-landing/ui/navbar";

export default function LoginPage() {
  return (
    <PageShell>
      <section className="relative min-h-screen px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,#e0f7ff_0%,#fff7ed_48%,#ecfeff_100%)]" />
        <Navbar />
        <Suspense>
          <AuthForm mode="login" />
        </Suspense>
      </section>
    </PageShell>
  );
}
