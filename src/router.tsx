import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { AppLayout } from './components/AppLayout';
import { StatusPage } from './pages/StatusPage';
import { SettingsPage } from './pages/SettingsPage';
import { JournalPage } from './pages/JournalPage';

// Root route with layout
const rootRoute = createRootRoute({
  component: AppLayout,
});

// Index route (/)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: StatusPage,
});

// Journal route (/journal)
const journalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/journal',
  component: JournalPage,
});

// Settings route (/settings)
const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, journalRoute, settingsRoute]);

// Create and export the router
export const router = createRouter({ routeTree });

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

