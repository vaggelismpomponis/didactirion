Product Requirements Document (PRD)

Project: Website Redesign for "Διδακτήριον" Educational Organization

1. Executive Summary

The objective of this project is the complete redesign and migration of the website Διδακτήριον.gr from WordPress to a fully custom, modern web application. The new platform must feature a modern UI/UX, be 100% responsive, exceptionally fast (SEO & Performance optimized), and include a Custom CMS (Admin Dashboard) exclusively for the organization's administrators, eliminating the need for public user registration/login. The application will be deployed on Vercel with seamless Git/GitHub integration.

2. Technology Stack

To ensure optimal performance, security, and seamless hosting on Vercel, the AI Agent must utilize the following stack:

Frontend & Full-stack Framework: Next.js (App Router) with React and TypeScript.

Styling & UI: Tailwind CSS, combined with headless UI components (e.g., shadcn/ui) for rapid and professional development. Framer Motion for modern and smooth animations.

Database (for Custom CMS): PostgreSQL (Supabase).

ORM: Prisma (for type-safe database communication).

Authentication (Admin Only): NextAuth.js (Auth.js) to secure the Admin Dashboard (e.g., via Google account login and Email/Password with hashed credentials).

Version Control & CI/CD: Git, GitHub repository linked directly to Vercel for automated deployments upon pushing to the main branch. The custom domain (Διδακτήριον.gr) will be configured within Vercel.

3. Information Architecture & Sitemap

The AI Agent must migrate and restructure the existing content according to the following sitemap:

Home Page:

Hero section with a dynamic Slider/Banners and the slogan "Απαίτησε την κορυφή!" (Demand the top!).

Quick links: Success System, Announcements, Contact.

Dynamic Popup system (for announcements, e.g., Summer Preparation) controlled via CMS.

The Organization (Το Φροντιστήριο):

History / Philosophy.

Teachers (Dynamic grid with photos and bios - via CMS).

Successful Students (Dynamic list/gallery by year - via CMS).

Publications, Success System, Evaluation System, Photo Gallery.

Curricula (Προγράμματα Σπουδών):

Junior High, High School (Grades 10, 11, 12), Vocational Schools (EPAL), Alumni, Model Schools, Summer Classes, Special Courses (e.g., Scratch/Python Programming).

Exams (Εξετάσεις):

The New High School System, Panhellenic Exams, Question Bank, OEFE Subjects.

Custom Feature: Automated Admission Points Calculator (To be implemented with custom JavaScript logic on the frontend).

Announcements / Blog (Ανακοινώσεις):

Career Guide, News, Articles (Dynamic content fetched from CMS).

E-class & StudyBot:

Portals/External links to the existing Distance Learning Platform (open eclass), Video Conference, and StudyBot.

Contact (Επικοινωνία):

Contact form, details (Thrakomakedonon 97, Acharnes, Phones, Email), Google Maps iframe, Operating hours.

4. Custom CMS Specifications (Admin Dashboard)

There will be absolutely no public login form on the main site. The content management system will be located at the /admin route (or admin.Διδακτήριον.gr).

Access: Strictly restricted via whitelisted admin emails or secure login credentials.

Features (CRUD - Create, Read, Update, Delete) for Admins:

Manage Announcements/Articles: Rich text editor (e.g., TipTap or React Quill) for creating new posts, adding images, and categorizing.

Manage Teachers & Staff: Add/Remove profiles, names, specialties, photos.

Manage Successful Students: Add student names, admitted university/faculty, year, photos.

Manage Banners & Popups: Enable/Disable popups (e.g., "Book an appointment for Summer Classes") and change Hero section images on the Home page.

View Contact Messages: A data table displaying messages submitted via the contact form (acting as a backup/log alongside the automated email sent to info@Διδακτήριον.gr).

5. UI/UX & Design Requirements

Responsive Design: 100% Mobile-first approach. The site must render flawlessly on smartphones, tablets, and desktops.

Aesthetics: Modern, "clean", educational, and professional. Maintain the brand's color palette (extract colors from the existing logo) while introducing modern gradients or subtle shadows.

Typography: Legible, modern Google Fonts (e.g., Inter, Roboto, or Poppins) with proper header hierarchy (H1, H2, H3).

Performance: Zero Cumulative Layout Shift (CLS), image optimization (using Next.js <Image/> component for WebP support) to achieve a 90+ score on Google Lighthouse.

6. Functional Requirements & Integrations

Contact Form: Built with React Hook Form and Zod for schema validation. Triggers an email to the admin via an API integration (e.g., Resend or Nodemailer).

SEO: Server-Side Rendering (SSR) or Static Site Generation (SSG) via Next.js. Dynamic Meta tags and Open Graph tags for every page (crucial for articles/announcements to ensure proper Social Media sharing).

Domain & SSL: The existing custom domain will be pointed to Vercel's Nameservers (or via CNAME/A records). Vercel will automatically provision and manage the SSL certificate.

7. Execution Roadmap for the AI Agent

The AI Agent must execute the following steps sequentially:

Phase 1: Setup & Infrastructure

Initialize the Next.js app with TypeScript, Tailwind CSS, and App Router.

Setup the Git repository and commit the initial scaffolding.

Setup Prisma ORM, create the database schema for User (Admins), Post (Announcements), Teacher, and SuccessStory.

Run initial database migrations (PostgreSQL).

Phase 2: Frontend Foundation & Static Pages

Create the global layout, Header (with responsive hamburger menu), and Footer.

Develop static pages (Philosophy, Facilities, Curricula).

Develop the custom "Points Calculator" tool using React state.

Phase 3: Backend & Admin CMS

Install NextAuth.js and create API routes for authentication.

Create the /admin layout protected route.

Develop CRUD UI screens in the dashboard (data tables, input forms with a rich text editor).

Connect the frontend to the database (SSR fetching for announcements, teachers, success stories).

Phase 4: Testing & Refinement

Test responsive behavior across all Tailwind breakpoints (sm, md, lg, xl).

Integrate Framer Motion for page transitions and scroll-reveal effects.

Conduct a Lighthouse audit to ensure Performance, Accessibility, and SEO standards are met.

Phase 5: Deployment

Push all code to the GitHub repository.

Create a new Project in the Vercel CLI/Dashboard and link it to the GitHub repo.

Set necessary Environment Variables (DATABASE_URL, NEXTAUTH_SECRET, API keys) in Vercel.

Deploy to production and configure the custom domain (Διδακτήριον.gr).

This document serves as the central "Master Prompt/Plan" for any autonomous AI Developer assigned to build this project.