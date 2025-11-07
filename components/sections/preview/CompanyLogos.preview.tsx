"use client";

const companies = [
  { name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
  { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
  { name: "Google", logo: "https://logo.clearbit.com/google.com" },
  { name: "IBM", logo: "https://logo.clearbit.com/ibm.com" },
  { name: "Oracle", logo: "https://logo.clearbit.com/oracle.com" },
  { name: "Salesforce", logo: "https://logo.clearbit.com/salesforce.com" },
];

export function CompanyLogosPreview() {
  return (
    <section className="relative bg-bg-alt/30 py-20">
      {/* Liquid glass separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="mx-auto max-w-6xl px-6 text-center space-y-12">
        <h3 className="text-base md:text-lg font-semibold text-fg-muted uppercase tracking-wider">
          Graduates work at leading companies
        </h3>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {companies.map((company) => (
            <div
              key={company.name}
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200 grayscale hover:grayscale-0"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-10 w-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
