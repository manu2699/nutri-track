import { useState } from "react";

import { Switch } from "@/components/dataentry/switch";

export default function SwitchShowcase() {
	const [isEnabled, setIsEnabled] = useState(false);
	const [notifications, setNotifications] = useState(true);
	const [darkMode, setDarkMode] = useState(false);

	return (
		<div className="space-y-8">
			{/* Controlled Example */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Controlled Example</h3>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<label htmlFor="controlled" className="text-foreground font-medium">
								Feature Toggle
							</label>
							<p className="text-muted-foreground text-sm">Status: {isEnabled ? "Enabled" : "Disabled"}</p>
						</div>
						<Switch id="controlled" checked={isEnabled} onCheckedChange={setIsEnabled} />
					</div>
				</div>
			</section>

			{/* Settings Example */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Settings Panel</h3>
				<div className="space-y-6 border rounded-lg p-6 bg-card">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<label htmlFor="notifications" className="text-foreground font-medium">
								Push Notifications
							</label>
							<p className="text-muted-foreground text-sm">Receive notifications about updates</p>
						</div>
						<Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
					</div>

					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<label htmlFor="darkmode" className="text-foreground font-medium">
								Dark Mode
							</label>
							<p className="text-muted-foreground text-sm">Switch to dark theme</p>
						</div>
						<Switch id="darkmode" checked={darkMode} onCheckedChange={setDarkMode} />
					</div>
				</div>
			</section>

			{/* Size Variations */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Different Contexts</h3>
				<div className="space-y-4">
					<div className="flex items-center space-x-2">
						<Switch id="compact" className="scale-75" />
						<label htmlFor="compact" className="text-foreground text-sm">
							Compact switch
						</label>
					</div>
					<div className="flex items-center space-x-2">
						<Switch id="normal" />
						<label htmlFor="normal" className="text-foreground">
							Normal switch
						</label>
					</div>
					<div className="flex items-center space-x-2">
						<Switch id="large" className="scale-125" />
						<label htmlFor="large" className="text-foreground text-lg">
							Large switch
						</label>
					</div>
				</div>
			</section>
		</div>
	);
}
