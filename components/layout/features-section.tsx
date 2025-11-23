const FeaturesSection = () => {
  const features = [
    {
      stat: "100%",
      title: "Privacy-First",
      description:
        "Your data is processed entirely on your device. We never send, store, or share your information with any server.",
    },
    {
      stat: "4",
      title: "Key Analytics",
      description:
        "Overview stats, rating distribution, decade breakdown, and yearly watching trends in one powerful dashboard.",
    },
    {
      stat: "∞",
      title: "Unlimited Uploads",
      description:
        "Re-upload your data anytime to see updated insights as you watch more films. No limits, no restrictions.",
    },
    {
      stat: "$0",
      title: "Always Free",
      description:
        "Open source and community-driven. No hidden costs, subscriptions, or premium features. Ever.",
    },
  ];

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
          Why Choose Letterboxd Stats?
        </h2>
        <p className="mt-6 text-lg max-w-2xl text-foreground/60 dark:text-foreground/65">
          A privacy-first analytics tool that transforms your Letterboxd viewing history into beautiful, actionable insights—no data collection, no complications.
        </p>

        <div className="mt-20 sm:mt-28 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 lg:gap-x-16 gap-y-20">
          {features.map((feature, idx) => (
            <div key={idx}>
              <span className="text-5xl md:text-6xl tracking-tight font-semibold text-foreground">
                {feature.stat}
              </span>
              <p className="mt-6 font-semibold text-xl text-foreground">
                {feature.title}
              </p>
              <p className="mt-2 text-foreground/60 dark:text-foreground/65 leading-relaxed">
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
