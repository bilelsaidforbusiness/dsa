import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Route, Switch } from "wouter";
import AuthPage from "./pages/auth-page";
import NotFound from "./pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/">
          <div className="min-h-screen p-8">
            <h1 className="text-2xl font-bold mb-4">Driving School Management</h1>
            <p>Welcome to the driving school management system.</p>
          </div>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </QueryClientProvider>
  );
}

export default App;