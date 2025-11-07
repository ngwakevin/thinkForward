import { HeroPreview } from "@/components/sections/preview/Hero.preview";
import { CloudTrainingStackPreview } from "@/components/sections/preview/CloudTrainingStack.preview";
import { ValuePillarsPreview } from "@/components/sections/preview/ValuePillars.preview";
import { HumanConnectionPreview } from "@/components/sections/preview/HumanConnection.preview";
import { CareerTrackPreview } from "@/components/sections/preview/CareerTrack.preview";
import { CompanyLogosPreview } from "@/components/sections/preview/CompanyLogos.preview";
import { TestimonialsPreview } from "@/components/sections/preview/Testimonials.preview";
import { AccelerationPromoPreview } from "@/components/sections/preview/AccelerationPromo.preview";
import { SupportEcosystemPreview } from "@/components/sections/preview/SupportEcosystem.preview";
import { BottomSplitPreview } from "@/components/sections/preview/BottomSplit.preview";
import { FinalCTAPreview } from "@/components/sections/preview/FinalCTA.preview";

export default function PreviewHomePage() {
  return (
    <main className="min-h-screen bg-bg">
      <HeroPreview />
      <CloudTrainingStackPreview />
      <ValuePillarsPreview />
      <HumanConnectionPreview />
      <CareerTrackPreview />
      <CompanyLogosPreview />
      <TestimonialsPreview />
      <AccelerationPromoPreview />
      <SupportEcosystemPreview />
      <BottomSplitPreview />
      <FinalCTAPreview />
    </main>
  );
}
