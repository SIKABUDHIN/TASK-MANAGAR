# TASK MANAGAR - A Responsive Task Manager App

TASK MANAGAR is a modern, responsive task management web application inspired by tools like Trello and Notion Tasks. It provides a clean, intuitive interface for users to manage their tasks efficiently across different stages of completion.

## Live Demo & Repository

- **Live Demo:** [Link to your deployed application]
- **GitHub Repository:** [Link to your GitHub repository]

## Features

- **Intuitive Board Layout:** A 3-column layout for 'To-Do', 'In-Progress', and 'Completed' tasks.
- **Responsive Design:** A seamless experience on mobile, tablet, and desktop screens.
- **Task Management (CRUD):**
  - **Create:** Add new tasks with a title, description, priority, and due date via a modal form.
  - **Edit:** Click on any task to open it for editing.
  - **Delete:** Remove tasks with a confirmation step to prevent accidental deletion.
- **Drag & Drop:** Easily move tasks between boards to instantly update their status.
- **Filtering & Sorting:**
  - **Filter** by priority (Low, Medium, High).
  - **Sort** tasks by creation date (newest/oldest) or by the closest due date.
- **Data Persistence:** Initial tasks are loaded from a static JSON file, and all subsequent changes are saved to the browser's `localStorage`.
- **Conflict Handling:** Duplicate tasks within the same board are clearly marked with a "Duplicate" badge.

## Tech Stack

- **Framework:** Next.js (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** lucide-react
- **Form Management:** React Hook Form & Zod
- **Date Handling:** date-fns

## Folder Structure

The project follows a standard Next.js App Router structure with some key directories:

```
.
├── public/
│   └── tasks.json      # Initial static task data
├── src/
│   ├── app/
│   │   ├── globals.css   # Global styles and Tailwind directives
│   │   ├── layout.tsx    # Root layout for the application
│   │   └── page.tsx      # Main application component and state management
│   ├── components/
│   │   ├── ui/           # Reusable UI components from shadcn/ui
│   │   ├── TaskCard.tsx  # Component for a single task card
│   │   ├── TaskColumn.tsx# Component for a single board column
│   │   └── TaskForm.tsx  # Modal form for creating/editing tasks
│   ├── lib/
│   │   └── types.ts      # TypeScript type definitions
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── README.md             # Project documentation
```

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

### Running the Development Server

To start the app in development mode, run:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) (or the port specified in your `package.json`) in your browser to see the application.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready build of the application.
- `npm run start`: Starts the production server (requires a build first).
- `npm run lint`: Lints the project files for code quality.

## Deployment

This project can be easily deployed on platforms like Vercel, Netlify, or GitHub Pages.

### Deploying with Vercel

1.  Push your code to a GitHub repository.
2.  Go to the [Vercel dashboard](https://vercel.com/new) and import your project from GitHub.
3.  Vercel will automatically detect that it's a Next.js project and configure the build settings.
4.  Click "Deploy" and your application will be live in minutes.
