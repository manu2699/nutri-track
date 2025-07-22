import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dataentry/select";

export default function SelectShowcase() {
  const [value, setValue] = useState("");

  return (
    <div className="space-y-8">
      {/* Basic Usage */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Basic Usage</h3>
        <div className="w-64">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="grape">Grape</SelectItem>
              <SelectItem value="strawberry">Strawberry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Controlled Example */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Controlled Example</h3>
        <div className="space-y-4">
          <p className="text-foreground">Selected: {value || "None"}</p>
          <div className="w-64">
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
                <SelectItem value="angular">Angular</SelectItem>
                <SelectItem value="svelte">Svelte</SelectItem>
                <SelectItem value="solid">SolidJS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Disabled State */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Disabled State</h3>
        <div className="w-64">
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Disabled select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="item1">Item 1</SelectItem>
              <SelectItem value="item2">Item 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* With Groups */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">With Groups</h3>
        <div className="w-64">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a programming language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Different Sizes */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Different Widths</h3>
        <div className="space-y-4">
          <div className="w-48">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Small width" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small1">Option 1</SelectItem>
                <SelectItem value="small2">Option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-80">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Large width select component" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="large1">Large option 1</SelectItem>
                <SelectItem value="large2">Large option 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </div>
  );
}