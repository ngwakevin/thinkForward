export default function PreviewLegacyV2() {
  return (
    <div className="min-h-screen bg-[#0bb2ff] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative">
          {/* Tabs row on top of panel */}
          <div className="absolute inset-x-0 top-0 z-30 flex justify-center gap-6 px-8">
            {/* Left pill */}
            <div
              className="flex min-w-[220px] max-w-[320px] flex-1 items-center justify-center rounded-[4rem] px-8 py-7 text-[0.8rem] font-extrabold uppercase leading-tight tracking-[0.25em] shadow-lg"
              style={{ backgroundColor: '#314F0F', color: '#F4FCE3' }}
            >
              <span className="mr-2">→</span>
              <span className="text-center">
                UI DESIGN
                <br />
                SKILLS
              </span>
            </div>

            {/* Middle pill with bridge into panel */}
            <div className="flex min-w-[260px] max-w-[400px] flex-1 flex-col items-stretch">
              <div
                className="flex w-full items-center justify-center rounded-t-[4rem] px-10 py-7 text-[0.8rem] font-extrabold uppercase leading-tight tracking-[0.25em] shadow-2xl"
                style={{ backgroundColor: '#3F0307', color: '#F9F5F4' }}
              >
                <span className="mr-2">→</span>
                <span className="text-center">
                  WORK WITH
                  <br />
                  A MENTOR
                </span>
              </div>
              {/* bridge */}
              <div className="relative -mt-1 h-28 w-full" style={{ backgroundColor: '#400307' }} />
            </div>

            {/* Right pill */}
            <div
              className="flex min-w-[220px] max-w-[320px] flex-1 items-center justify-center rounded-[4rem] px-8 py-7 text-[0.8rem] font-extrabold uppercase leading-tight tracking-[0.25em] shadow-lg"
              style={{ backgroundColor: '#25E8FF', color: '#041836' }}
            >
              <span className="mr-2">→</span>
              <span className="text-center">
                LEARN THE
                <br />
                TOOLS
              </span>
            </div>
          </div>

          {/* Concave cutouts carved into panel under side tabs */}
          <div className="pointer-events-none absolute inset-x-0 top-24 z-20 h-16 overflow-hidden">
            {/* Only the very top of these circles should be visible to create shallow notches */}
            <div
              className="absolute left-[22%] h-24 w-40 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: '#0bb2ff' }}
            />
            <div
              className="absolute right-[22%] h-24 w-40 -translate-y-1/2 rounded-full"
              style={{ backgroundColor: '#0bb2ff' }}
            />
          </div>

          {/* Content panel */}
          <div
            className="relative z-10 mt-24 w-full rounded-[4rem] px-12 pb-24 pt-44 shadow-[0_48px_120px_rgba(0,0,0,0.5)]"
            style={{ backgroundColor: '#400307' }}
          >
            <p className="text-center text-[1.5rem] font-medium leading-[1.8] text-white sm:text-2xl">
              Gain experience working collaboratively with a professional designer through 1:1 mentor sessions. Incorporate your mentor&rsquo;s written and verbal feedback into your work, and hear an insider&rsquo;s perspective on the field of UX/ product designer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
