import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Route, Switch } from "wouter";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">Driving School Management</h1>
        <p>Welcome to the driving school management system.</p>
      </div>
    </QueryClientProvider>
  );
}

export default App;