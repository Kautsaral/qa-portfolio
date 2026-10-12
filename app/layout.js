import "./globals.css";

export const metadata = {
  title: "Kautsar | QA Engineer Portfolio",
  description:
    "Kautsar's QA Engineer portfolio showcasing manual testing, API testing, Cypress, Playwright, and software quality assurance projects.",
  applicationName: "Kautsar QA Portfolio",
  keywords: [
    "QA Engineer",
    "Quality Assurance",
    "Software Testing",
    "Manual Testing",
    "API Testing",
    "Cypress",
    "Playwright",
    "Test Automation",
  ],
  authors: [{ name: "Kautsar" }],
  openGraph: {
    title: "Kautsar | QA Engineer Portfolio",
    description:
      "Explore QA projects, testing skills, and automation work by Kautsar.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
