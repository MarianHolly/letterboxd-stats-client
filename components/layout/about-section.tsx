
const AboutSection = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="flex flex-col items-center text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-8 max-w-3xl">
            You&apos;ve tracked the films. Now, understand the <em>why</em>.
          </h1>
          <p className="text-lg text-foreground/70 dark:text-foreground/65 leading-relaxed max-w-2xl mb-6">
            We take your raw Letterboxd history—your ratings, your diary
            entries—and transform them into a definitive cinematic profile. Our
            charts don&apos;t just count movies; they show you the{" "}
            <strong>patterns, preferences, and unexplored landscapes</strong> of
            your taste.
          </p>
          <p className="text-lg text-foreground/70 dark:text-foreground/65 leading-relaxed max-w-2xl">
            From identifying your most defining decade to pinpointing your
            hidden genre biases, we give you the clarity you need to move from
            casual watcher to true cinematic explorer.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
