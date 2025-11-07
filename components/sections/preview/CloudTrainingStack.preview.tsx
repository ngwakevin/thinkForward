"use client";

import { useState } from "react";

interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const topics: Topic[] = [
  {
    id: "aws",
    name: "AWS",
    icon: "☁️",
    description: "Master Amazon Web Services with hands-on training in EC2, S3, Lambda, and more. Learn to architect, deploy, and manage scalable cloud solutions.",
  },
  {
    id: "azure",
    name: "Azure",
    icon: "⚡",
    description: "Dive deep into Microsoft Azure services. Build enterprise-grade applications with Azure compute, storage, networking, and AI services.",
  },
  {
    id: "gcp",
    name: "GCP",
    icon: "🌐",
    description: "Explore Google Cloud Platform's powerful infrastructure. Learn Compute Engine, Cloud Storage, BigQuery, and Kubernetes Engine.",
  },
];

export function CloudTrainingStackPreview() {
  const [activeTopic, setActiveTopic] = useState<string>(topics[0].id);
  const currentTopic = topics.find(t => t.id === activeTopic) || topics[0];

  return (
    <section className="relative bg-bg py-20">
      {/* Liquid glass separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header - Clean Designlab style with brand colors */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Your Path to Cloud Mastery
          </h2>
          <p className="text-lg md:text-xl text-fg-muted leading-relaxed">
            Choose your cloud provider and start building real-world projects with expert guidance.
          </p>
        </div>

        {/* Interactive Topic Selector */}
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Topic Buttons - Frosted rail container */}
          <div className="bg-gradient-to-br from-bg-alt/60 to-bg-alt/40 rounded-2xl p-3 shadow-sm border border-border/60 flex lg:flex-col gap-3 w-full lg:w-auto backdrop-blur-sm">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`
                  group relative flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-200
                  ${activeTopic === topic.id 
                    ? 'bg-gradient-to-br from-accent/20 to-accent-alt/10 shadow-md shadow-accent/20 text-white scale-105 border border-accent/40' 
                    : 'text-fg-muted hover:bg-bg-alt/50 hover:text-white'
                  }
                `}
              >
                <span className="text-2xl">{topic.icon}</span>
                <span className="font-semibold text-lg whitespace-nowrap">{topic.name}</span>
              </button>
            ))}
          </div>

          {/* Active Topic Panel */}
          <div className="flex-1 bg-gradient-to-br from-bg-alt/50 to-bg rounded-2xl p-8 md:p-10 shadow-sm border border-border/60 min-h-[240px] flex items-center backdrop-blur-sm">
            <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentTopic.icon}</span>
                <h3 className="font-display text-3xl font-bold text-white">
                  {currentTopic.name}
                </h3>
              </div>
              <p className="text-lg text-fg-muted leading-relaxed">
                {currentTopic.description}
              </p>
              <a 
                href="/platform"
                className="inline-flex items-center gap-2 text-base font-semibold text-accent hover:text-accent-alt transition-colors group"
              >
                Start Learning
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom separator */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
}
