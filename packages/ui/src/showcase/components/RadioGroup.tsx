import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/dataentry/radio-group";

export default function RadioGroupShowcase() {
  const [value, setValue] = useState("option1");
  const [size, setSize] = useState("medium");

  return (
    <div className="space-y-8">
      {/* Basic Usage */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Basic Usage</h3>
        <RadioGroup defaultValue="option1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="option1" />
            <label htmlFor="option1" className="text-foreground">Option 1</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="option2" />
            <label htmlFor="option2" className="text-foreground">Option 2</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option3" id="option3" />
            <label htmlFor="option3" className="text-foreground">Option 3</label>
          </div>
        </RadioGroup>
      </section>

      {/* Controlled Example */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Controlled Example</h3>
        <div className="space-y-4">
          <p className="text-foreground">Selected: {value}</p>
          <RadioGroup value={value} onValueChange={setValue}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option1" id="controlled1" />
              <label htmlFor="controlled1" className="text-foreground">First option</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option2" id="controlled2" />
              <label htmlFor="controlled2" className="text-foreground">Second option</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option3" id="controlled3" />
              <label htmlFor="controlled3" className="text-foreground">Third option</label>
            </div>
          </RadioGroup>
        </div>
      </section>

      {/* Size Selection Example */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Size Selection</h3>
        <div className="space-y-4">
          <p className="text-foreground">T-shirt size: {size}</p>
          <RadioGroup value={size} onValueChange={setSize}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="small" />
              <label htmlFor="small" className="text-foreground">Small</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <label htmlFor="medium" className="text-foreground">Medium</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <label htmlFor="large" className="text-foreground">Large</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="xlarge" id="xlarge" />
              <label htmlFor="xlarge" className="text-foreground">X-Large</label>
            </div>
          </RadioGroup>
        </div>
      </section>

      {/* Disabled State */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Disabled State</h3>
        <RadioGroup defaultValue="disabled1" disabled>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disabled1" id="disabled1" />
            <label htmlFor="disabled1" className="text-muted-foreground">Disabled option 1</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disabled2" id="disabled2" />
            <label htmlFor="disabled2" className="text-muted-foreground">Disabled option 2</label>
          </div>
        </RadioGroup>
      </section>
    </div>
  );
}