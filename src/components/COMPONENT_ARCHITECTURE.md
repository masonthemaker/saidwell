# Component Architecture Guidelines

## 📋 Open Source Project - Organization Principles

This is an **open source project** that prioritizes clean, maintainable, and scalable component architecture. Every developer contributing to this project should follow these organizational structures to ensure code quality and maintainability.

## 🏗️ Core Principles

### 1. **Single Responsibility Components**
- Every UI section must be its own component
- Components should have a single, well-defined purpose
- No large monolithic components

### 2. **Page-Level Organization**
- Each page should return **only one main component**
- Page components act as layout containers
- All business logic and UI sections are delegated to child components

### 3. **Folder Structure by Feature**
```
src/
├── app/
│   ├── page.tsx          # Returns <Dashboard />
│   ├── history/
│   │   └── page.tsx      # Returns <HistoryDashboard />
│   └── files/
│       └── page.tsx      # Returns <FilesDashboard />
├── components/
│   ├── dash/             # Dashboard-specific components
│   ├── historydash/      # History page components
│   ├── filesdash/        # Files page components
│   ├── sidebar/          # Shared sidebar components
│   └── ui/               # Reusable UI components
```

## 🎯 Component Patterns

### ✅ **Correct Architecture Example - Files Page**
```tsx
// ❌ DON'T DO THIS - Monolithic component
function FilesPage() {
  return (
    <div>
      {/* Upload section inline */}
      {/* Files list inline */}
      {/* Modal inline */}
    </div>
  );
}

// ✅ DO THIS - Properly componentized
function FilesDashboard() {
  return (
    <div>
      <Sidebar />
      <TopBar />
      <FilesMainContent />
      <ParallaxBackground />
    </div>
  );
}

function FilesMainContent() {
  return (
    <main>
      <FileUploadSection />
      <FilesList />
      <ConfirmationModal />
    </main>
  );
}
```

### 🔧 **Component Hierarchy Rules**

1. **Page Level** (`/app/*/page.tsx`)
   - Returns one main Dashboard component
   - No UI logic, just component composition

2. **Dashboard Level** (`*Dashboard.tsx`)
   - Handles layout (sidebar, topbar, main content)
   - Manages navigation state
   - No business logic

3. **Main Content Level** (`*MainContent.tsx`)
   - Orchestrates page-specific sections
   - Manages page-specific state
   - Coordinates component communication

4. **Section Level** (e.g., `FileUploadSection.tsx`, `FilesList.tsx`)
   - Self-contained functionality
   - Clear props interface
   - Single responsibility

5. **Item Level** (e.g., `FileItem.tsx`, `CallRecord.tsx`)
   - Reusable, atomic components
   - Pure presentation with callbacks
   - Type-safe props

## 📁 Current Implementation Status

### ✅ **Files Page Architecture**
```
/files/page.tsx → FilesDashboard
├── Sidebar (shared)
├── TopBar (shared)
├── FilesMainContent
│   ├── FileUploadSection ✓
│   ├── FilesList ✓
│   │   └── FileItem ✓ (each file)
│   └── ConfirmationModal ✓
└── ParallaxBackground (shared)
```

### ✅ **History Page Architecture**
```
/history/page.tsx → HistoryDashboard
├── Sidebar (shared)
├── TopBar (shared)
├── HistoryMainContent
│   └── HistoryCallsFullPage ✓
│       ├── CallRecord ✓ (each call)
│       ├── CallRecordModal ✓
│       └── DatePicker ✓
└── ParallaxBackground (shared)
```

## 🚀 **Benefits of This Architecture**

1. **Maintainability** - Easy to locate and update specific functionality
2. **Reusability** - Components can be reused across different pages
3. **Testability** - Each component can be tested in isolation
4. **Collaboration** - Multiple developers can work on different components simultaneously
5. **Performance** - Enables better code splitting and lazy loading
6. **Documentation** - Clear component boundaries make the codebase self-documenting

## 📝 **Contributing Guidelines**

When adding new features:

1. **Create dedicated components** for each UI section
2. **Use TypeScript interfaces** for all props
3. **Follow the folder structure** by feature/page
4. **Export components** through index files for clean imports
5. **Add proper error boundaries** and loading states
6. **Include JSDoc comments** for complex components

## 🎨 **Styling Consistency**

- Use **Tailwind CSS** for all styling
- Follow **glass morphism** design patterns
- Use **color variables** from CSS custom properties
- Maintain **consistent spacing** and typography
- Apply **smooth transitions** for interactive elements

---

**Remember**: This architecture makes the codebase accessible to new contributors and ensures long-term maintainability. Every component should be self-contained, reusable, and follow these organizational principles.
