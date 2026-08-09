# SiteCreator 🚀

**SiteCreator** is an all-in-one AI platform built for web agencies, freelancers, and marketers to discover local business leads, instantly generate category-tailored Next.js 15 websites, edit site code in real-time via AI prompt co-piloting, and publish directly to GitHub and Vercel edge CDNs with a single click.

---

## 🌟 Key Features

- **🔍 Local Lead Discovery**: Search local business leads in any city or industry, view contact details, and identify businesses lacking modern web presences.
- **⚡ Instant Next.js Site Provisioning**: 1-click site creation that generates a category-specific Next.js App Router codebase (Dental, Law, Dining, Service Businesses) with dedicated PTY terminal environments.
- **💬 Real-Time AI Co-Pilot Editor**: Edit website content, layout, styling, and sections in natural language inside an interactive split-screen browser preview.
- **🎛 Slash Commands & Skill Integration**: Use slash commands like `/impeccable` to apply expert UI/UX design transformations.
- **🔌 Dynamic Health Polling & Process Isolation**: Auto-detects local dev server startup (`:10000`, `:10001`, `:10002`...) with health checks and loading overlays.
- **🐙 1-Click GitHub Repository Push**: Automatically initializes Git and creates a public repository on GitHub via the GitHub CLI (`gh repo create`).
- **☁ 1-Click Vercel Edge Deployment**: Deploys production bundles directly to Vercel's global edge network with instant worldwide SSL certificates and 99/100 Lighthouse performance metrics.

---

## 🏗 Technology Stack

### **Frontend (`client/`)**
- **Core**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Vanilla CSS design system with CSS custom properties, HSL color tokens, dark mode, and glassmorphic UI elements
- **State & Routing**: Next.js Navigation (`useSearchParams`, `useRouter`), custom HTTP polling hooks

### **Backend (`server/`)**
- **Core**: Node.js, Express.js, TypeScript, ES Modules
- **Database**: MongoDB & Mongoose (`Site`, `User`, `Business` schemas)
- **Terminal Isolation**: `node-pty` for managing background terminal processes (`terminalA` for dev server `npx next dev -p <port>`, `terminalB` for `agy` AI editing)
- **CLI Integrations**: GitHub CLI (`gh`), Vercel CLI (`vercel`)

---

## 📁 Repository Structure

```text
site-creator/
├── client/                     # Next.js 16 Frontend Application
│   ├── app/
│   │   ├── (auth)/login/       # Authentication page
│   │   ├── dashboard/          # Lead search dashboard
│   │   ├── results/            # Lead search results
│   │   ├── lead/               # Lead detail & site creation trigger
│   │   ├── site/               # Site management & Vercel deployment status
│   │   ├── site/edit/          # Live AI Editor with split-screen preview
│   │   ├── components/         # Shared UI components (ThemeToggle, etc.)
│   │   └── lib/                # API client & fetch helpers
│   └── public/                 # Static assets
│
├── server/                     # Express.js Backend & Site Provisioning Engine
│   ├── src/
│   │   ├── config/             # MongoDB database connection
│   │   └── modules/
│   │       ├── user/           # User auth routes & controller
│   │       ├── business/       # Business lead search controller
│   │       └── site/           # Site creation, editing, start & deployment controllers
│   └── sites/                  # Provisioned Next.js projects (isolated PTY environments)
│
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local instance running at `mongodb://localhost:27017` or MongoDB Atlas connection string
- **GitHub CLI (`gh`)**: Authenticated (`gh auth login`)
- **Vercel CLI (`vercel`)**: Authenticated (`vercel login`)
- **AntiGravity CLI (`agy`)**: Authenticated 
---

### 🛠 Installation & Local Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/site-creator.git
cd site-creator
```

#### 2. Setup & Start the Express Backend
```bash
cd server
npm install
npm run build
npm start
```
*The Express server runs on `http://localhost:4000`.*

#### 3. Setup & Start the Next.js Frontend
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
*The Next.js client app runs on `http://localhost:3000`.*

---

## 🕹 Usage Workflow

1. **Login**: Sign in at `http://localhost:3000/login`.
2. **Search Business Leads**: On `/dashboard`, enter a city or niche (e.g. *"Dentists in Manhattan"*).
3. **Create Site**: Click on a lead and select **"Create Site & Open Editor →"**. The backend provisions a Next.js project inside `server/sites/` and assigns a dev port (e.g., `:10001`).
4. **Live AI Editing**: Prompt the AI co-pilot on `/site/edit` to customize text, hero headers, color palettes, or booking forms.
5. **Publish to GitHub & Vercel**: Navigate to `/site` and click **"🚀 Publish to Vercel"**. SiteCreator initializes Git, pushes the repository to GitHub, and deploys live on Vercel's global edge network.

---

## ⚡ API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/user/login` | Authenticate user and issue JWT token |
| `POST` | `/businesses` | Search local business leads by query |
| `GET` | `/site` | Retrieve all sites |
| `GET` | `/site/:id` | Get site details by ID |
| `POST` | `/site/create` | Provision new Next.js site codebase & MongoDB record |
| `POST` | `/site/start` | Start site dev server in Terminal A (`npx next dev -p <port>`) |
| `POST` | `/site/edit` | Send AI edit prompt to Terminal B (`agy`) |
| `POST` | `/site/deploy` | Push repository to GitHub and publish to Vercel Edge CDN |

---

## 🛡 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

© 2026 SiteCreator. All rights reserved.
