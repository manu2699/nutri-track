import { useState } from "react";
import { Button } from "../../components/general/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/general/Drawer";

export default function DrawerShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Basic Usage */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Basic Usage</h3>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>
                This is a drawer component built with Vaul.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <p className="text-foreground">Drawer content goes here.</p>
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </section>

      {/* Controlled Example */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Controlled Example</h3>
        <div className="space-y-4">
          <Button onClick={() => setIsOpen(true)}>
            Open Controlled Drawer
          </Button>
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Controlled Drawer</DrawerTitle>
                <DrawerDescription>
                  This drawer is controlled by state.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4">
                <p className="text-foreground">
                  You can control this drawer programmatically.
                </p>
              </div>
              <DrawerFooter>
                <Button onClick={() => setIsOpen(false)}>Close</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </section>
    </div>
  );
}