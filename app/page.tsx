import { SiteNavbar } from "@/components/landing/site-navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustMetrics } from "@/components/landing/trust-metrics";
import { ModulesGrid } from "@/components/landing/modules-grid";
import { RoleWorkflowPreview } from "@/components/landing/role-workflow-preview";
import { CtaSection } from "@/components/landing/cta-section";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <HeroSection />
        <TrustMetrics />
        <ModulesGrid />
        <RoleWorkflowPreview />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
