import { useState, Suspense, lazy } from "react";
import { Button } from "@/components/general/Button";

// Component registry - maps component names to their lazy-loaded showcase components
const componentRegistry = {
  Button: lazy(() => import("./components/Button")),
  Badge: lazy(() => import("./components/Badge")),
  Drawer: lazy(() => import("./components/Drawer")),
} as const;

type ComponentName = keyof typeof componentRegistry;

const componentNames = Object.keys(componentRegistry) as ComponentName[];

export default function ComponentShowcase() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentName>("Button");

  const SelectedShowcase = componentRegistry[selectedComponent];

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-border bg-card p-4">
        <h2 className="text-lg font-semibold mb-4 text-foreground">UI Components</h2>
        <nav className="space-y-2">
          {componentNames.map((name) => (
            <Button
              key={name}
              variant={selectedComponent === name ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedComponent(name)}
            >
              {name}
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8 text-foreground">{selectedComponent} Component</h1>
        
        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <div className="text-muted-foreground">Loading component...</div>
          </div>
        }>
          <SelectedShowcase />
        </Suspense>
      </div>
    </div>
  );
}