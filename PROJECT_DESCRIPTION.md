# Project Description: Algorithm Visualizer

## Overview
**Algorithm Visualizer** is an interactive educational web application designed to visualize various algorithms and data structures. Built with **Next.js 15**, it provides a modern, responsive, and engaging user interface to help students and developers understand complex algorithmic concepts through dynamic animations.

## Tech Stack
-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives, [shadcn/ui](https://ui.shadcn.com/) patterns
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Visualization Engine**: [@xyflow/react](https://reactflow.dev/) (formerly React Flow) for graph and node-based visualizations
-   **Utilities**: `clsx`, `tailwind-merge` for dynamic class management

## Project Structure

The project follows a standard Next.js App Router structure, organized by feature and component type.

### 1. Core Application (`src/app`)
This directory contains the application routes and pages.

-   **`layout.js`**: The root layout component. It defines the global structure, including the `Navbar` and `Footer`, and applies global styles (`globals.css`).
-   **`page.js`**: The landing page. It renders the `Hero` section and the `AlgorithmCards` grid, serving as the entry point for users to choose a visualization.
-   **`globals.css`**: Global CSS file containing Tailwind directives and custom global styles.

### 2. Visualization Modules (`src/app/[feature]`)
Each algorithm or data structure has its own dedicated directory in `src/app`. These are self-contained modules responsible for the specific visualization logic.

**Example: Singly Linked List (`src/app/sll`)**
-   **`page.jsx`**: The main controller for the visualization. It manages the state (list nodes, edges, operation history), handles the visualization logic (insert, delete, traverse), and renders the React Flow canvas.
-   **`menu.jsx`**: The control panel component. It contains the UI controls (buttons, inputs, sliders) that allow the user to interact with the visualization. It communicates user actions back to `page.jsx`.
-   **`LinkedListNode.jsx`**: A custom React Flow node component used to render individual linked list nodes.
-   **`MetadataNode.jsx`** (Conceptual): A custom node for displaying low-level details like head/tail pointers and size.

**Other Modules:**
-   `sorting/`: Sorting algorithms (Bubble, Quick, Merge, etc.).
-   `pathfinder/`: Pathfinding algorithms (Dijkstra, A*, BFS, DFS).
-   `binary-search/`: Binary search visualization.
-   `recursion-tree/`: Visualization of recursive function calls.
-   `n-queen/`, `game-of-life/`, `convex-hull/`, etc.: Specific algorithmic problem visualizations.

### 3. Shared UI Components (`src/components`)
Reusable UI components used throughout the application.

-   **`ui/`**: Contains low-level, atomic UI components (e.g., `button.jsx`, `input.jsx`, `slider.jsx`, `card.jsx`). These are built using Radix UI primitives and styled with Tailwind CSS, following the shadcn/ui pattern.
-   **`custom-*.jsx`**: Higher-level UI components tailored for the visualizer controls:
    -   `custom-slider.jsx`: A slider with a label and value display.
    -   `custom-select.jsx`: A dropdown menu for selecting algorithms or options.
    -   `custom-toggle.jsx`: A toggle switch.
-   **`navbar.jsx`**: The top navigation bar component.

### 4. App-Specific Components (`src/app/components`)
Components specific to the application's layout and landing page.

-   **`algorithm-cards.jsx`**: Renders the grid of cards on the home page, categorized by "Algorithms" and "Data Structures". It handles the navigation logic to the specific visualization pages.
-   **`hero.jsx`**: The introductory section of the landing page with the title and description.
-   **`footer.jsx`**: The application footer.

### 5. Logic & Utilities (`src/lib`)
Separates pure algorithmic logic from the UI.

-   **`algorithms/`**: Contains the pure JavaScript implementations of the algorithms. These functions typically return a sequence of "steps" or "animations" that the UI components (`page.jsx`) then render frame-by-frame.
    -   Example: `sorting/bubbleSort.js` would return an array of swap operations to be animated.
-   **`utils.js`**: General utility functions, primarily `cn` (class names) helper for merging Tailwind classes.

## Key Concepts for Developers

### Visualization Loop
1.  **User Action**: The user interacts with the `Menu` (e.g., clicks "Sort").
2.  **Algorithm Execution**: The `page.jsx` calls a function from `src/lib/algorithms` to run the algorithm on the current data.
3.  **Animation Generation**: The algorithm returns a list of steps (snapshots or operations).
4.  **Rendering**: The `page.jsx` iterates through these steps using `setTimeout` or an interval, updating the React state (nodes, colors, positions) to create the animation effect.

### React Flow Integration
For graph-based structures (Linked Lists, Trees, Graphs), `@xyflow/react` is used.
-   **Nodes**: Represent data elements. Custom node types (like `LinkedListNode`) are registered to define their appearance.
-   **Edges**: Represent connections (pointers) between nodes.
-   **Handles**: Connection points on nodes (source/target) that allow edges to be drawn.

### Styling Philosophy
The project uses a "utility-first" approach with Tailwind CSS.
-   **Responsiveness**: Layouts are designed to adapt to mobile and desktop screens.
-   **Theming**: Colors are chosen to be accessible and visually distinct (e.g., highlighting active nodes in red, sorted nodes in green).
