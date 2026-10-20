# QA Engineer Portfolio

A personal portfolio website showcasing my experience, technical skills, and software testing projects as a QA Engineer.

**Live Website:** [kausarqa.vercel.app](https://kausarqa.vercel.app)  
**Repository:** [Kautsaral/qa-portfolio](https://github.com/Kautsaral/qa-portfolio)

## Overview

This project was built to present my QA engineering profile, demonstrate my testing experience, and provide a central place to showcase my automation projects.

The website includes a public portfolio, a database-backed content management system, an admin dashboard, and automated end-to-end tests using Playwright.

## Features

### Public Portfolio
- Hero section with professional introduction.
- Skills and testing tools showcase.
- Professional experience section.
- Project showcase with GitHub repository links.
- Contact section.
- Responsive layout for desktop and mobile devices.

### Admin Dashboard
- Authentication for admin access.
- Manage portfolio project information.
- Manage skills and skill categories.
- Manage professional experience.
- Publish or keep supported content as drafts.
- Form validation for project data.

### Quality Assurance
- End-to-end UI testing with Playwright.
- Authentication and access-control scenarios.
- Positive and negative test scenarios.
- Admin project form validation.
- Projects, Skills, Experience, and public navigation tests.
- Automated test execution through GitHub Actions.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js (App Router) | React framework |
| JavaScript | Application development |
| Tailwind CSS | Styling and responsive UI |
| Supabase | Database and authentication integration |
| Playwright | End-to-end test automation |
| GitHub Actions | Continuous integration |
| Vercel | Production hosting |

## Project Structure

```text
qa-portfolio/
├── app/
│   ├── admin/               # Admin dashboard and management pages
│   ├── components/          # Public portfolio components
│   ├── login/               # Admin login page
│   ├── layout.js            # Root layout and metadata
│   └── page.js              # Public homepage
├── lib/
│   └── supabase/             # Supabase client configuration
├── scripts/                  # Utility and testing scripts
├── tests/
│   ├── admin-projects.spec.js
│   ├── auth.spec.js
│   ├── example.spec.js
│   ├── experience.spec.js
│   ├── projects.spec.js
│   ├── public.spec.js
│   └── skills.spec.js
├── .github/
│   └── workflows/            # GitHub Actions workflows
├── playwright.config.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Git
- A Supabase project configured for the application

### 1. Clone the Repository

```bash
git clone https://github.com/Kautsaral/qa-portfolio.git
cd qa-portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

Add the following variables using values from your own Supabase project and admin configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
ADMIN_EMAIL=your_admin_email
```

For authenticated Playwright tests, configure these additional variables when running tests locally:

```env
PLAYWRIGHT_ADMIN_EMAIL=your_test_admin_email
PLAYWRIGHT_ADMIN_PASSWORD=your_test_admin_password
```

Use an appropriate test account and ensure it has the required access.

**Security notes:**
- Never commit `.env.local` to Git.
- Never expose Supabase secret or `service_role` keys in client-side code.
- Do not share admin passwords or credentials in repository documentation.
- Configure production environment variables separately in Vercel.

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Automated Tests

This project uses Playwright to validate public portfolio behavior and admin functionality.

### Install Playwright Browser

```bash
npx playwright install chromium
```

### Run the Complete Test Suite

```bash
npx playwright test --workers=1 --reporter=list
```

### Run a Specific Test File

```bash
npx playwright test tests/auth.spec.js --workers=1 --reporter=list
```

You can replace `auth.spec.js` with another test file under `tests/`.

### View the HTML Report

```bash
npx playwright show-report
```

### Test Coverage

| Test Suite | Coverage |
|---|---|
| `auth.spec.js` | Login, invalid credentials, logout, and access control |
| `admin-projects.spec.js` | Project form validation, editing, and canceling edits |
| `projects.spec.js` | Project content, repository links, and live demo links |
| `skills.spec.js` | Skills section content and categories |
| `experience.spec.js` | Experience content and employment periods |
| `public.spec.js` | Hero content, navigation, and contact section |
| `example.spec.js` | Homepage smoke test |

### Latest Verified Test Results

The latest recorded full local test run completed with:

- **28 passed**
- **0 failed**
- **0 skipped**

GitHub Actions also completed successfully for the corresponding tested changes.

Test results may change as the application and test suite evolve.

## Continuous Integration

GitHub Actions runs automated checks when changes are pushed to the configured repository branches or pull requests, according to the workflow configuration.

Authenticated admin tests require the appropriate GitHub Actions secrets to be configured.

The test workflow uses:

- Playwright
- Chromium
- Environment variables for test credentials
- Automated test execution in CI

## Deployment

The production website is hosted on Vercel.

**Production URL:** [https://kausarqa.vercel.app](https://kausarqa.vercel.app)

The repository is connected to Vercel for deployment.

Typical development workflow:

1. Create a feature branch.
2. Make changes locally.
3. Run the relevant Playwright tests.
4. Push the branch to GitHub.
5. Review the GitHub Actions results and Vercel preview deployment.
6. Merge approved changes into `main`.
7. Verify the production deployment.

Production deployment behavior depends on the configured Vercel project settings.

## Future Improvements

This project is currently maintained as **Portfolio Web V1**. Future versions may include additional features, UI improvements, expanded test coverage, and further enhancements to the admin dashboard.

## Author

**Kautsar**  
QA Engineer | Manual Testing | API Testing | UI Automation

- Portfolio: [kausarqa.vercel.app](https://kausarqa.vercel.app)
- GitHub: [Kautsaral](https://github.com/Kautsaral)

---

*Built to showcase my QA engineering skills and continuous learning in software quality assurance.*