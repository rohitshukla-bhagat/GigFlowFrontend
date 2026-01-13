# GigFlow Client

GigFlow Client is the frontend application for the GigFlow platform, built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for a fast and modern development experience.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Vanilla CSS / CSS Modules
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root of the `client` directory and add the following:

```env
VITE_BACKEND_URL=http://localhost:5000
```
> Note: `VITE_BACKEND_URL` points to your running backend server instance.

### Running the App

Start the development server:

```bash
npm run dev
```

The application will typically run on [https://gigflowbackend.onrender.com](https://gigflowbackend.onrender.com).

### Building for Production

To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

### Linting

Run the linter to catch code quality issues:

```bash
npm run lint
```

## Project Structure

- `src/` - Source code for React components and logic.
- `src/api` - API configuration (Axios setup).
- `public/` - Static assets.
