/** biome-ignore-all lint/a11y/noLabelWithoutControl: -- */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/general/tabs";

export default function TabsShowcase() {
	return (
		<div className="space-y-8">
			{/* Settings Example */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Settings Panel</h3>
				<Tabs defaultValue="general" className="w-full">
					<TabsList>
						<TabsTrigger value="general">General</TabsTrigger>
						<TabsTrigger value="security">Security</TabsTrigger>
						<TabsTrigger value="notifications">Notifications</TabsTrigger>
						<TabsTrigger value="billing">Billing</TabsTrigger>
					</TabsList>
					<TabsContent value="general" className="mt-4">
						<div className="space-y-4 p-4 border rounded-lg bg-card">
							<h4 className="text-lg font-semibold text-foreground">General Settings</h4>
							<div className="space-y-2">
								<label className="text-foreground font-medium">Display Name</label>
								<input
									type="text"
									placeholder="Enter your name"
									className="w-full p-2 border rounded bg-background text-foreground"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-foreground font-medium">Email</label>
								<input
									type="email"
									placeholder="Enter your email"
									className="w-full p-2 border rounded bg-background text-foreground"
								/>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="security" className="mt-4">
						<div className="space-y-4 p-4 border rounded-lg bg-card">
							<h4 className="text-lg font-semibold text-foreground">Security Settings</h4>
							<div className="space-y-2">
								<label className="text-foreground font-medium">Current Password</label>
								<input
									type="password"
									placeholder="Enter current password"
									className="w-full p-2 border rounded bg-background text-foreground"
								/>
							</div>
							<div className="space-y-2">
								<label className="text-foreground font-medium">New Password</label>
								<input
									type="password"
									placeholder="Enter new password"
									className="w-full p-2 border rounded bg-background text-foreground"
								/>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="notifications" className="mt-4">
						<div className="space-y-4 p-4 border rounded-lg bg-card">
							<h4 className="text-lg font-semibold text-foreground">Notification Preferences</h4>
							<div className="space-y-3">
								<div className="flex items-center space-x-2">
									<input type="checkbox" id="email-notif" />
									<label htmlFor="email-notif" className="text-foreground">
										Email notifications
									</label>
								</div>
								<div className="flex items-center space-x-2">
									<input type="checkbox" id="push-notif" />
									<label htmlFor="push-notif" className="text-foreground">
										Push notifications
									</label>
								</div>
								<div className="flex items-center space-x-2">
									<input type="checkbox" id="sms-notif" />
									<label htmlFor="sms-notif" className="text-foreground">
										SMS notifications
									</label>
								</div>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="billing" className="mt-4">
						<div className="space-y-4 p-4 border rounded-lg bg-card">
							<h4 className="text-lg font-semibold text-foreground">Billing Information</h4>
							<div className="space-y-2">
								<p className="text-foreground">
									Current Plan: <span className="font-semibold">Pro</span>
								</p>
								<p className="text-muted-foreground">Next billing date: January 15, 2024</p>
								<p className="text-muted-foreground">Amount: $29.99/month</p>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</section>

			{/* Vertical Tabs */}
			<section>
				<h3 className="text-xl font-semibold mb-4 text-foreground">Vertical Layout</h3>
				<Tabs defaultValue="overview" orientation="vertical" className="flex space-x-4">
					<TabsList className="flex-col h-fit">
						<TabsTrigger value="overview" className="w-full">
							Overview
						</TabsTrigger>
						<TabsTrigger value="analytics" className="w-full">
							Analytics
						</TabsTrigger>
						<TabsTrigger value="reports" className="w-full" disabled>
							Reports
						</TabsTrigger>
						<TabsTrigger value="settings" className="w-full">
							Settings
						</TabsTrigger>
					</TabsList>
					<div className="flex-1">
						<TabsContent value="overview">
							<div className="p-4 border rounded-lg bg-card">
								<h4 className="text-lg font-semibold text-foreground mb-2">Overview</h4>
								<p className="text-muted-foreground">Dashboard overview content goes here.</p>
							</div>
						</TabsContent>
						<TabsContent value="analytics">
							<div className="p-4 border rounded-lg bg-card">
								<h4 className="text-lg font-semibold text-foreground mb-2">Analytics</h4>
								<p className="text-muted-foreground">Analytics and metrics content.</p>
							</div>
						</TabsContent>
						<TabsContent value="reports">
							<div className="p-4 border rounded-lg bg-card">
								<h4 className="text-lg font-semibold text-foreground mb-2">Reports</h4>
								<p className="text-muted-foreground">Reports and data exports.</p>
							</div>
						</TabsContent>
						<TabsContent value="settings">
							<div className="p-4 border rounded-lg bg-card">
								<h4 className="text-lg font-semibold text-foreground mb-2">Settings</h4>
								<p className="text-muted-foreground">Application settings and preferences.</p>
							</div>
						</TabsContent>
					</div>
				</Tabs>
			</section>
		</div>
	);
}
