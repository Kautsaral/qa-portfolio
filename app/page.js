import Navbar from "./components/Navbar";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import ExperienceSection from "./components/ExperienceSection";

const projects = [
  {
    number: "01",
    category: "API AUTOMATION",
    title: "Cypress API Testing",
    description:
      "Automated API tests for authentication and booking workflows, including positive and negative scenarios.",
    features: [
      "Authentication and token handling",
      "Booking CRUD operations",
      "Unauthorized access validation",
      "GitHub Actions CI workflow",
    ],
    tools: ["Cypress", "JavaScript", "REST API", "GitHub Actions"],
    repo: "https://github.com/Kautsaral/cypress-api-testing",
  },
  {
    number: "02",
    category: "UI AUTOMATION",
    title: "Playwright UI Automation",
    description:
      "Browser automation practice using SauceDemo to validate user interactions and essential shopping workflows.",
    features: [
      "Locator strategies and assertions",
      "Form and UI interaction testing",
      "Reusable test organization",
      "Automated test execution",
    ],
    tools: ["Playwright", "JavaScript", "SauceDemo"],
    repo: "https://github.com/Kautsaral/playwright-ui-automation",
  },
  {
    number: "03",
    category: "BDD AUTOMATION",
    title: "Cypress BDD UI Automation",
    description:
      "UI automation using behavior-driven development to express scenarios in a readable, structured format.",
    features: [
      "Gherkin feature files",
      "Reusable step definitions",
      "Login scenario validation",
      "Automated UI regression checks",
    ],
    tools: ["Cypress", "Cucumber", "Gherkin", "JavaScript"],
    repo: "https://github.com/Kautsaral/cypress-bdd-ui-automation",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero */}
      <section
        id="home"
        className="mx-auto flex min-h-[85vh] max-w-6xl flex-col justify-center px-6 py-20 sm:px-10 lg:px-16"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
            QA Engineer
          </p>
        </div>

        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Building quality into{" "}
          <span className="text-blue-600">every release.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          Hi, I&apos;m Kautsar. I test applications, uncover defects, and build
          automation to help deliver reliable software.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Projects ↗
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-700"
          >
            Contact Me
          </a>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              number: "01",
              title: "API Testing",
              description: "Validate endpoints, responses, and error handling.",
            },
            {
              number: "02",
              title: "UI Automation",
              description: "Automate user journeys and regression scenarios.",
            },
            {
              number: "03",
              title: "Manual Testing",
              description: "Explore features and identify unexpected behavior.",
            },
          ].map((item) => (
            <div
              key={item.number}
              className="rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-blue-600">
                {item.number}
              </p>
              <h2 className="mt-3 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <SkillsSection />

      <ExperienceSection />

      <ProjectsSection />
      
      {/* Contact */}
      <section id="contact" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 lg:px-16">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 lg:p-16">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              Get In Touch
            </p>

            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
              Let&apos;s make software more reliable.
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-slate-600">
              I&apos;m open to QA Engineer opportunities, collaboration, and
              conversations about software testing and automation. Feel free to
              connect with me.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="mailto:your.email@example.com"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Email Me <span aria-hidden="true">↗</span>
              </a>

              <a
                href="https://github.com/Kautsaral"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-700"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-700"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Based in Indonesia · Available for professional connections
            </p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
          <div>
            <a
              href="#home"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              Kautsar<span className="text-blue-600">.</span>
            </a>
            <p className="mt-1 text-sm text-slate-500">
              QA Engineer · Quality through testing and automation.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-slate-500">
            <a href="#home" className="transition hover:text-blue-700">
              Home
            </a>
            <a href="#experience" className="transition hover:text-blue-700">
              Experience
            </a>
            <a href="#projects" className="transition hover:text-blue-700">
              Projects
            </a>
            <a href="#contact" className="transition hover:text-blue-700">
              Contact
            </a>
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Kautsar
          </p>
        </div>
      </footer>
    </main>
  );
}
