# SlowbatOS 🛡️

SlowbatOS is a cybersecurity-themed portfolio operating system built with **Next.js**, **Tailwind CSS**, and **Shadcn UI**. It mimics a high-tech Linux-inspired environment to showcase skills, projects, and security research in an interactive and immersive way.

![SlowbatOS Desktop Preview](public/window.svg) <!-- Replace with actual screenshot if available -->

## 🚀 Features

- **Virtual Filesystem**: A persistent, hierarchical filesystem (`v2`) managed via global context and stored in `localStorage`.
- **Integrated Terminal**: A functional terminal emulator supporting common commands (`ls`, `cd`, `mkdir`, `touch`, `rm`, `cat`, etc.) and system application launching.
- **Window Management**: Dynamic window system supporting focusing, minimizing, maximizing, and closing.
- **Desktop Environment**: Responsive icon grid with drag-and-drop support and collision detection (drag-to-trash).
- **Mobile Optimized**: Full touch support, including long-press logic for dragging icons on mobile devices and haptic feedback.
- **Simulated Boot Sequence**: Immersive kernel initialization and login screens.
- **Persistent State**: System state and filesystem changes persist across sessions using `sessionStorage` and `localStorage`.

## 🛠️ Built With

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **Fonts**: Geist Sans & Geist Mono

## 📂 Project Structure

- `/app`: Next.js App Router core.
  - `/desktop`: Core OS shell and desktop environment components.
    - `/apps`: Individual OS applications (Terminal, Identity, Projects, etc.).
  - `/system`: Core OS services (Boot screen, Login, Global System Context).
- `/components`: Shared UI components (mostly Shadcn).
- `/hooks`: Custom React hooks (e.g., `useIsMobile`).
- `/lib`: Utility functions and shared libraries.

## ⌨️ Terminal Commands

- `help`: Display available commands.
- `ls`: List files in the current directory.
- `cd [dir]`: Change the current working directory.
- `cat [file]`: Display the content of a file.
- `mkdir [dir]`: Create a new directory.
- `touch [file]`: Create a new empty file.
- `rm [file]`: Remove a file.
- `rmdir [dir]`: Remove an empty directory.
- `[app].exe`: Launch a system application (e.g., `identity.exe`, `projects.exe`).

## 🚦 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Recommended) or Node.js / NPM.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/slowbat-portfolio.git
   cd slowbat-portfolio
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Run the development server:
   ```bash
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ⚡ by [Slowbat](https://github.com/your-username)
