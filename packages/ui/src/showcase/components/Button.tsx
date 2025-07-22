import { BUTTON_VARIANTS, Button, type ButtonVariant } from "@/components/general/button";

const buttonVariants = Object.values(BUTTON_VARIANTS) as ButtonVariant[];
const buttonSizes = ["sm", "default", "lg"] as const;

export default function ButtonShowcase() {
	return (
		<div className="space-y-8">
			{/* Variants Section */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Variants</h3>
				<div className="flex flex-wrap gap-4">
					{buttonVariants.map((variant) => (
						<Button key={variant} variant={variant}>
							{variant.charAt(0).toUpperCase() + variant.slice(1)}
						</Button>
					))}
				</div>
			</section>

			{/* Sizes Section */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Sizes</h3>
				<div className="flex items-center gap-4">
					{buttonSizes.map((size) => (
						<Button key={size} size={size}>
							Size {size}
						</Button>
					))}
				</div>
			</section>

			{/* Interactive Examples */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Interactive Examples</h3>
				<div className="space-y-4">
					<div className="flex gap-4">
						<Button onClick={() => alert("Clicked!")}>Click me</Button>
						<Button disabled>Disabled</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
