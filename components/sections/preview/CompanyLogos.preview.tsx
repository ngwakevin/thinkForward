"use client";

const companies = [
  "Microsoft",
  "Amazon",
  "Google",
  "Meta",
  "Netflix",
  "Uber",
  "Spotify",
  "Apple",
  "IBM",
  "Oracle",
  "Salesforce",
  "Adobe",
];

export function CompanyLogosPreview() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fff7ef] py-20 text-[#2b1e40]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(86,56,255,0.12), rgba(255,247,239,0))," +
            "radial-gradient(circle at 82% 24%, rgba(0,170,135,0.12), rgba(255,247,239,0))",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.34em] text-[#2b1e40]/65 shadow-[4px_4px_0_0_rgba(43,30,64,0.12)]">
            <span className="h-2 w-2 rounded-full bg-[#2f441c]" />
            Where they ship
          </span>
          <h2 className="mt-6 font-display text-3xl md:text-4xl font-semibold leading-tight">
            Alumni, mentors, and students ship at beloved companies.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {companies.map((company, index) => (
            <div
              key={company}
              className="flex items-center justify-center rounded-[32px] bg-white px-4 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#2b1e40]/70 shadow-[6px_6px_0_0_rgba(43,30,64,0.1)]"
              style={{
                backgroundColor:
                  index % 3 === 0 ? "#ffeedf" : index % 3 === 1 ? "#e8e7ff" : "#dff7f0",
              }}
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
