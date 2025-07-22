import { Badge, BADGE_VARIANTS, type BadgeVariant } from "@/components/datadisplay/Badge";

const badgeVariants = Object.values(BADGE_VARIANTS) as BadgeVariant[];

export default function BadgeShowcase() {
  return (
    <div className="space-y-8">
      {/* Variants Section */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Variants</h3>
        <div className="flex flex-wrap gap-4">
          {badgeVariants.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Badge>
          ))}
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-foreground">Usage Examples</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-foreground">Status:</span>
            <Badge variant="default">Active</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-foreground">Priority:</span>
            <Badge variant="destructive">High</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-foreground">Category:</span>
            <Badge variant="secondary">UI Component</Badge>
          </div>
        </div>
      </section>
    </div>
  );
}