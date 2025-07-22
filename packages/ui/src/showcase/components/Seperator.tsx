/** biome-ignore-all lint/a11y/useValidAnchor: -- */
import { Separator } from "@/components/general/seperator";

export default function SeparatorShowcase() {
	return (
		<div className="space-y-8">
			{/* Horizontal Separator */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Horizontal Separator</h3>
				<div className="space-y-4">
					<p className="text-foreground">Content above separator</p>
					<Separator className="bg-primary" />
					<p className="text-foreground">Content below separator</p>
				</div>
			</section>

			{/* Vertical Separator */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Vertical Separator</h3>
				<div className="flex items-center space-x-4 h-8">
					<span className="text-foreground">Left content</span>
					<Separator orientation="vertical" />
					<span className="text-foreground">Middle content</span>
					<Separator orientation="vertical" />
					<span className="text-foreground">Right content</span>
				</div>
			</section>

			{/* In Cards */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Card Content</h3>
				<div className="border rounded-lg p-6 bg-card">
					<h4 className="text-lg font-semibold text-foreground">Card Title</h4>
					<p className="text-muted-foreground mt-2">Card description goes here.</p>
					<Separator className="my-4" />
					<div className="space-y-2">
						<p className="text-foreground">Additional content</p>
						<p className="text-muted-foreground">More details below the separator</p>
					</div>
				</div>
			</section>
		</div>
	);
}
