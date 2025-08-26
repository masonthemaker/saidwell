"use client";

import { useClients } from "@/hooks/use-clients";
import { PiFirstAidDuotone, PiUsersDuotone, PiBuildingsDuotone, PiCalendarDuotone, PiDotsThreeCircleDuotone } from "react-icons/pi";

interface ClientsMainContentProps {
	isNavExpanded: boolean;
}

// Helper function to format date
function formatClientDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', { 
		month: 'short', 
		day: 'numeric',
		year: 'numeric'
	});
}

export default function ClientsMainContent({ isNavExpanded }: ClientsMainContentProps) {
	const { isLoading, clients, error, refresh } = useClients();

	const totalClients = clients.length;
	const activeClients = clients.length; // For now, assume all are active
	const recentClients = clients.filter(client => {
		if (!client.created_at) return false;
		const clientDate = new Date(client.created_at);
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		return clientDate > thirtyDaysAgo;
	}).length;

	return (
		<main
			className={`
				absolute top-22 right-6 bottom-6
				${isNavExpanded ? 'left-54' : 'left-22'} 
				transition-all duration-500 ease-out
				p-6
				bg-transparent
				overflow-y-auto scrollbar-hide
				flex flex-col
			`}
		>
			<div className="space-y-6">
				{/* Header Section */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold text-white">Client Management</h1>
						<p className="mt-1 text-white/70">Manage your client organizations and their access</p>
					</div>
					<div className="flex items-center gap-3">
						<button 
							onClick={refresh}
							className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-xl text-white text-sm transition-all duration-300"
						>
							Refresh
						</button>
						<button className="px-4 py-2 bg-[var(--color-main-accent)]/20 hover:bg-[var(--color-main-accent)]/30 border border-[var(--color-main-accent)]/30 hover:border-[var(--color-main-accent)]/50 rounded-xl text-[var(--color-main-accent)] text-sm font-medium transition-all duration-300 flex items-center gap-2">
							<PiFirstAidDuotone className="w-4 h-4" />
							Add Client
						</button>
					</div>
				</div>

				{/* Error Display */}
				{error && (
					<div className="rounded-xl bg-red-500/20 border border-red-500/30 p-4 text-red-200 text-sm">
						<strong>Error:</strong> {error}
					</div>
				)}

				{/* Stats Overview */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-[var(--color-sky-blue)]/20 rounded-xl">
								<PiUsersDuotone className="w-6 h-6 text-[var(--color-sky-blue)]" />
							</div>
							<div>
								<p className="text-2xl font-semibold text-white">{totalClients}</p>
								<p className="text-sm text-white/60">Total Clients</p>
							</div>
						</div>
					</div>
					
					<div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-[var(--color-grassy-green)]/20 rounded-xl">
								<PiBuildingsDuotone className="w-6 h-6 text-[var(--color-grassy-green)]" />
							</div>
							<div>
								<p className="text-2xl font-semibold text-white">{activeClients}</p>
								<p className="text-sm text-white/60">Active Clients</p>
							</div>
						</div>
					</div>
					
					<div className="p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl">
						<div className="flex items-center gap-3">
							<div className="p-3 bg-[var(--color-hover-pink)]/20 rounded-xl">
								<PiCalendarDuotone className="w-6 h-6 text-[var(--color-hover-pink)]" />
							</div>
							<div>
								<p className="text-2xl font-semibold text-white">{recentClients}</p>
								<p className="text-sm text-white/60">Added This Month</p>
							</div>
						</div>
					</div>
				</div>

				{/* Clients List */}
				<div className="bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl">
					<div className="p-6 border-b border-white/10">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-white">Client Organizations</h2>
							<div className="flex items-center gap-2 text-sm text-white/60">
								<span>{totalClients} client{totalClients !== 1 ? 's' : ''}</span>
							</div>
						</div>
					</div>
					
					<div className="p-6">
						{isLoading ? (
							<div className="flex items-center justify-center py-12">
								<div className="text-white/70">Loading clients...</div>
							</div>
						) : clients.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="p-4 bg-white/5 rounded-xl mb-4">
									<PiUsersDuotone className="w-8 h-8 text-white/40 mx-auto" />
								</div>
								<h3 className="text-lg font-medium text-white/80 mb-2">No clients yet</h3>
								<p className="text-white/60 mb-4">Get started by adding your first client organization</p>
								<button className="px-4 py-2 bg-[var(--color-main-accent)]/20 hover:bg-[var(--color-main-accent)]/30 border border-[var(--color-main-accent)]/30 hover:border-[var(--color-main-accent)]/50 rounded-xl text-[var(--color-main-accent)] text-sm font-medium transition-all duration-300 flex items-center gap-2">
									<PiFirstAidDuotone className="w-4 h-4" />
									Add Your First Client
								</button>
							</div>
						) : (
							<div className="space-y-3">
								{clients.map((client) => (
									<div 
										key={client.id} 
										className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 cursor-pointer group"
									>
										<div className="flex items-center justify-between">
											<div className="flex-1">
												<div className="flex items-center gap-3 mb-2">
													<h3 className="text-lg font-medium text-white group-hover:text-white/90 transition-colors">
														{client.name}
													</h3>
													<span className="px-3 py-1 text-xs bg-[var(--color-grassy-green)]/20 text-[var(--color-grassy-green)] border border-[var(--color-grassy-green)]/30 rounded-full">
														Active
													</span>
												</div>
												
												<div className="flex items-center gap-6 text-sm text-white/60">
													{client.company_name && (
														<div className="flex items-center gap-2">
															<PiBuildingsDuotone className="w-4 h-4" />
															<span>Company: {client.company_name}</span>
														</div>
													)}
													{client.created_at && (
														<div className="flex items-center gap-2">
															<PiCalendarDuotone className="w-4 h-4" />
															<span>Created: {formatClientDate(client.created_at)}</span>
														</div>
													)}
													<div className="flex items-center gap-2">
														<PiUsersDuotone className="w-4 h-4" />
														<span>0 users</span> {/* Placeholder for user count */}
													</div>
												</div>
											</div>
											
											<div className="flex items-center gap-2 ml-4">
												<button className="group/btn p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300">
													<PiDotsThreeCircleDuotone className="w-5 h-5 text-white/70 group-hover/btn:text-white transition-colors" />
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}


