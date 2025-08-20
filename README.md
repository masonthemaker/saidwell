# 🌱 **Saidwell** — The Open‑Source Dashboard for Voice AI

---

## ✨ Overview

**Saidwell** is the **open‑source analytics and management dashboard** for voice AI projects.

Whether you're an **agency**, a **developer**, or a **team building with AI voice platforms** (like LiveKit, Vapi, Retell, or others), Saidwell gives you a **single, beautiful interface** to:

* 📊 Track conversations and usage trends.
* 🎨 White‑label dashboards for your clients.
* ⚡ Visualize call performance and agent outcomes.
* 🔌 Connect multiple providers into one unified view.

Think of it as your **voice AI command center**.

---

## 🌈 Why Saidwell?

Most dashboards are bland, uninspired, and feel like corporate spreadsheets. **Saidwell is different.**
We believe analytics should be:

* **Glassy + Modern** → Beautiful frosted‑glass panels with vibrant highlights.
* **Neon‑Infused** → Accents that pop against a sleek black canvas.
* **Abstract + Outdoorsy** → A dashboard that feels *alive*, not sterile.
* **Client‑Ready** → Agencies can proudly show Saidwell dashboards to their customers.

With **configurable themes** and colors like:

* 🌟 Accent Yellow `#f0ff47`
* 🌸 Hover Pink `#f9a8d4`
* 🌿 Hover Green `#86efac`
* 🏜️ Tan `#d2b48c`
* 🌳 Grassy Green `#4ade80`
* ☁️ Sky Blue `#38bdf8`
* 🔴 Error Red `#ef4444`

…you can adapt Saidwell to your agency's brand with just a few variables.

---

## 🛠️ What You Get Today

* **Agent Call Activity** → Track inbound, outbound, and support calls with layered visualizations.
* **Call History + Recordings** → Browse and play back conversations with full transcript support.
* **File Management** → Upload, organize, and manage AI training materials and documents.
* **Team Management** → Role-based access control with admin, member, and viewer permissions.
* **Settings & Configuration** → Budget alerts, account management, and system preferences.
* **Responsive Design** → Works beautifully on desktop, tablet, and mobile devices.

---

## 🏗️ Architecture & Development

Saidwell is built with **modern React/Next.js patterns** and follows **enterprise-grade architecture principles**:

### 📁 **Project Structure**
```
saidwell/
├── COMPONENT_ARCHITECTURE.md    # 📋 Development guidelines
├── src/
│   ├── app/                     # 🛣️ Next.js 15 App Router
│   │   ├── page.tsx            # 🏠 Dashboard home
│   │   ├── history/            # 📞 Call history & recordings
│   │   ├── files/              # 📁 File management
│   │   └── settings/           # ⚙️ Team & account settings
│   └── components/             # 🧱 Component library
│       ├── dash/               # 📊 Dashboard components
│       ├── historydash/        # 📞 Call history components
│       ├── filesdash/          # 📁 File management components
│       ├── settingsdash/       # ⚙️ Settings components
│       ├── sidebar/            # 📋 Navigation components
│       └── ui/                 # 🎨 Reusable UI components
```

### 🎯 **Component Architecture**

Every page follows the **single responsibility principle**:

```typescript
// ✅ Clean page structure
/app/history/page.tsx → HistoryDashboard
├── Sidebar (shared navigation)
├── TopBar (page-specific header)
├── HistoryMainContent (page content orchestrator)
│   └── HistoryCallsFullPage (feature-specific logic)
│       ├── CallRecord (atomic component)
│       ├── CallRecordModal (modal component)
│       └── DatePicker (reusable UI)
└── ParallaxBackground (shared visual)
```

### 🔧 **Tech Stack**
* **Frontend**: Next.js 15, React 19, TypeScript
* **Styling**: Tailwind CSS with custom glassmorphism design system
* **Icons**: React Icons (Phosphor) for consistency
* **Charts**: Recharts for data visualization
* **State**: React hooks with lifted state patterns
* **Code Quality**: ESLint, TypeScript strict mode

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+ 
* npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/saidwell.git
cd saidwell

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see Saidwell in action.

### 🎨 Customization

Saidwell uses CSS custom properties for theming. Update `src/app/globals.css`:

```css
:root {
  --color-main-accent: #f0ff47;    /* 🌟 Your brand color */
  --color-hover-pink: #f9a8d4;     /* 🌸 Interactive highlights */
  --color-grassy-green: #4ade80;   /* 🌿 Success states */
  /* ... and more */
}
```

---

## 📊 Features Deep Dive

### 📞 **Call History & Analytics**
- Interactive timeline charts showing call volume trends
- Detailed call records with play/download functionality
- Full conversation transcripts with speaker identification
- Search and filter capabilities with date ranges
- Cost tracking and budget monitoring

### 📁 **File Management**
- Drag & drop file uploads with progress indicators
- File organization with type-specific icons and colors
- Preview and download capabilities
- Storage usage tracking and limits
- Delete confirmations with custom modal system

### ⚙️ **Settings & Administration**
- **Budget Settings**: Configurable spending limits and alerts
- **Team Management**: User invitations, role assignments, status tracking
- **Account Security**: Email changes, password resets with validation
- **Permissions System**: Admin, Member, and Viewer role hierarchy

---

## 🚀 Roadmap

Saidwell starts as an **analytics dashboard**, but our vision is bigger:

* 📈 **Today** → Open‑source analytics for agencies & developers
* 🌐 **Near Future** → Hosted version with scaling, reporting, and advanced features
* 🤖 **Later** → Build, deploy, and manage agents across *multiple voice AI platforms*
* 🔌 **Integration** → Connect with LiveKit, Vapi, Retell, and other voice AI platforms

Ultimately, Saidwell aims to be the **hub for voice AI businesses**: analytics + creation + deployment + billing.

---

## 🤝 Contributing

We believe in building in the open. Saidwell is:

* 🪴 **Free & Open‑Source** → MIT licensed core
* 🌍 **Community‑Driven** → Contributions, plugins, and integrations welcome
* 🧑‍🎨 **Opinionated by Design** → Not just functional, but delightful
* 📚 **Well-Documented** → Clear architecture guidelines for contributors

### 📋 **Development Guidelines**

Before contributing, please read our [`COMPONENT_ARCHITECTURE.md`](./COMPONENT_ARCHITECTURE.md) which covers:

* Component organization principles
* File structure conventions  
* TypeScript patterns and interfaces
* Styling guidelines and design system
* Performance and scalability patterns

### 🛠️ **Quick Contribution Steps**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** the component architecture guidelines
4. **Test** your changes thoroughly
5. **Submit** a pull request with clear description

---

## 📬 Get Involved

* ⭐ **Star** the repository
* 🐛 **Report bugs** and request features via issues
* 💬 **Join discussions** in our community channels
* 🔀 **Contribute** code, documentation, or designs
* 📢 **Share** Saidwell with your agency or team

---

## 📄 License

MIT © Saidwell Contributors

---

> **Saidwell is where voice AI data becomes insight.**  
> **Open‑source, client‑ready, and designed with care.**