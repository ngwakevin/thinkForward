import { Hero } from '../components/sections/Hero';
import { ValuePillars } from '../components/sections/ValuePillars';
import { SupportEcosystem } from '../components/sections/SupportEcosystem';
import { BottomSplit } from '../components/sections/BottomSplit';
import { CloudTrainingStack } from '../components/sections/CloudTrainingStack';
import { AccelerationPromo } from '../components/sections/AccelerationPromo';

export default function HomePage() {
  return (
    <>
      <Hero />
  <CloudTrainingStack />
    <ValuePillars />
  <AccelerationPromo />
    <SupportEcosystem />
    {/* Final split: Chat With Us + Results side-by-side */}
    <BottomSplit />
    </>
  );
}
