const FeaturesSection = () => {
  const features = [
    {
      stat: "18+",
      title: "Interactive Charts",
      description:
        "Rating distributions, timeline heatmaps, decade analysis, director trends, genre breakdowns, monthly patterns, and more.",
    },
    {
      stat: "100%",
      title: "Client-Side",
      description:
        "All processing happens in your browser. No servers, no data collection, no tracking. Ever.",
    },
    {
      stat: "€0",
      title: "Always Free",
      description:
        "No subscriptions, no premium tiers, no hidden costs. Open source and transparent.",
    },
    {
      stat: "0s",
      title: "Setup Time",
      description:
        "No login, no account creation, no email verification. Start analyzing in seconds.",
    },
  ];

  return (
    <section className="py-24 md:py-40 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-start mb-20">
          {/* Left: Heading */}
          <div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6">
              Built Different
            </h2>
            <p className="text-lg text-foreground/65 leading-relaxed">
              A privacy-first analytics platform that transforms your Letterboxd viewing history into beautiful, actionable insights. No compromises.
            </p>
          </div>

          {/* Right: Spacer */}
          <div />
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 border border-border rounded-sm hover:border-border-medium transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-900/50 flex flex-col"
            >
              <span className="text-4xl md:text-5xl font-bold text-foreground/80 group-hover:text-foreground transition-colors mb-6">
                {feature.stat}
              </span>
              <p className="font-semibold text-lg text-foreground mb-3">
                {feature.title}
              </p>
              <p className="text-sm text-foreground/60 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
