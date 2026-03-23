import { Hero } from '../../components/sections/Hero';
import { SocialProof } from '../../components/sections/SocialProof';
import { ValuePillars } from '../../components/sections/ValuePillars';
import { LivePanel } from '../../components/sections/LivePanel';
import { TestimonialsSlice } from '../../components/sections/TestimonialsSlice';
import { SupportEcosystem } from '../../components/sections/SupportEcosystem';
import { ContactChannels } from '../../components/sections/ContactChannels';

// Cameroon landing page – uses a dedicated WhatsApp number
const CM_WHATSAPP_NUMBER = '651326555';

export default function CmPage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <ValuePillars />
      <LivePanel />
      <TestimonialsSlice />
      <SupportEcosystem />
      <ContactChannels whatsappNumber={CM_WHATSAPP_NUMBER} />
    </>
  );
}
