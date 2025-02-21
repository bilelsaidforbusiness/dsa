import { AuthProvider } from "@/hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Switch, Route, useLocation } from "wouter";
import { ProtectedRoute } from "./lib/protected-route";
import { Navigation } from "@/components/navigation";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Appointments from "@/pages/appointments";
import NotFound from "@/pages/not-found";

function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isAuthPage = location === "/auth";

  if (isAuthPage) {
    return children;
  }

  return (
    <div className="flex">
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        <ProtectedRoute path="/" component={Dashboard} />
        <ProtectedRoute path="/appointments" component={Appointments} />
        <Route path="/auth" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;