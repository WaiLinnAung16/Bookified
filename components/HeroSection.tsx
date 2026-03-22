import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    number: 1,
    title: "Upload PDF",
    description: "Add your book file",
  },
  {
    number: 2,
    title: "AI Processing",
    description: "We analyze the content",
  },
  {
    number: 3,
    title: "Voice Chat",
    description: "Discuss with AI",
  },
];

export default function HeroSection() {
  return (
    <section
      className="library-hero-card flex-col gap-6 lg:flex-row lg:gap-8 lg:justify-between mb-10 md:mb-16"
      aria-label="Your library hero"
    >
      {/* Left: heading, description, button */}
      <div className="library-hero-text order-2 lg:order-1 shrink-0 lg:max-w-[340px]">
        <h1 className="library-hero-title">Your Library</h1>
        <p className="library-hero-description">
          Convert your books into interactive AI conversations. Listen, learn,
          and discuss your favorite reads.
        </p>
        <Link
          href="/books/new"
          className="library-cta-primary mt-1 inline-flex items-center gap-2"
        >
          <span className="text-lg leading-none" aria-hidden>
            +
          </span>
          Add new book
        </Link>
      </div>

      {/* Center: vintage books / globe illustration - visible on all screen sizes */}
      <div className="flex flex-1 justify-center items-center order-1 lg:order-2 min-h-[200px] lg:min-h-0 max-w-[400px] mx-auto lg:mx-0">
        <Image
          src="/assets/hero-illustration.png"
          alt="Vintage books and globe illustration"
          width={400}
          height={280}
          className="object-contain w-full max-w-[320px] lg:max-w-[380px] h-auto"
          priority
        />
      </div>

      {/* Right: white card with 3 numbered steps */}
      <div className="order-3 shrink-0 w-full lg:w-auto lg:max-w-[260px]">
        <div className="library-steps-card shadow-soft p-5 space-y-4">
          {steps.map((step) => (
            <div key={step.number} className="library-step-item">
              <span className="library-step-number" aria-hidden>
                {step.number}
              </span>
              <div>
                <h3 className="library-step-title">{step.title}</h3>
                <p className="library-step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
