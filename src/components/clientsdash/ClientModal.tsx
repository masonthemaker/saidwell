"use client";

import { useState, useEffect, useMemo } from "react";
import { 
	PiXDuotone, 
	PiBuildingsDuotone, 
	PiUsersDuotone, 
	PiCalendarDuotone,
	PiCurrencyDollarDuotone,
	PiClockDuotone,
	PiTargetDuotone,
	PiChartLineUpDuotone
} from "react-icons/pi";
import { ClientOrg } from "@/hooks/use-clients/types";
import { createClient } from "@/lib/supabase/client";

interface ClientModalProps {
	isOpen: boolean;
	onClose: () => void;
	client: ClientOrg | null;
}

type BillingType = 'per_minute' | 'outcome_based';

interface BillingConfig {
	type: BillingType;
	perMinuteRate?: number;
	outcomeBasedRate?: number;
}

// Helper function to format date
function formatClientDate(dateString?: string): string {
	if (!dateString) return 'N/A';
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', { 
		month: 'long', 
		day: 'numeric',
		year: 'numeric'
	});
}

export default function ClientModal({ isOpen, onClose, client }: ClientModalProps) {
	const supabase = useMemo(() => createClient(), []);
	
	const [billingConfig, setBillingConfig] = useState<BillingConfig>({
		type: 'per_minute',
		perMinuteRate: 0.50,
		outcomeBasedRate: 25.00
	});

	const [tempRates, setTempRates] = useState({
		perMinute: billingConfig.perMinuteRate || 0.50,
		outcomeBased: billingConfig.outcomeBasedRate || 25.00
	});

	const [agentMinutesData, setAgentMinutesData] = useState<{
		totalMinutes: number;
		totalCalls: number;
		agentCount: number;
		isLoading: boolean;
		error: string | null;
	}>({
		totalMinutes: 0,
		totalCalls: 0,
		agentCount: 0,
		isLoading: false,
		error: null
	});

	// Function to fetch agent minutes data for this client
	const fetchAgentMinutesData = async (clientId: string) => {
		setAgentMinutesData(prev => ({ ...prev, isLoading: true, error: null }));
		
		try {
			// Get the start of current month
			const now = new Date();
			const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			
			// First, get all agents assigned to this client
			const { data: agentsData, error: agentsError } = await supabase
				.from('agents')
				.select('id, name')
				.eq('client_id', clientId);

			if (agentsError) {
				setAgentMinutesData(prev => ({ 
					...prev, 
					isLoading: false, 
					error: agentsError.message 
				}));
				return;
			}

			const totalAgentCount = (agentsData || []).length;

			// Then, get calls for these agents for the current month
			const { data: callsData, error: callsError } = await supabase
				.from('calls')
				.select(`
					duration_seconds,
					agent_id,
					agents!inner (
						id,
						name,
						client_id
					)
				`)
				.eq('agents.client_id', clientId)
				.gte('created_at', startOfMonth.toISOString())
				.lte('created_at', new Date().toISOString());

			if (callsError) {
				setAgentMinutesData(prev => ({ 
					...prev, 
					isLoading: false, 
					error: callsError.message 
				}));
				return;
			}

			// Calculate totals
			const totalSeconds = (callsData || []).reduce((sum, call) => sum + call.duration_seconds, 0);
			const totalMinutes = Math.round(totalSeconds / 60);
			const totalCalls = (callsData || []).length;

			setAgentMinutesData({
				totalMinutes,
				totalCalls,
				agentCount: totalAgentCount, // Use total assigned agents, not just those with calls
				isLoading: false,
				error: null
			});
		} catch (err) {
			setAgentMinutesData(prev => ({ 
				...prev, 
				isLoading: false, 
				error: err instanceof Error ? err.message : 'Failed to fetch agent data'
			}));
		}
	};

	// Load agent minutes data when modal opens or client changes
	useEffect(() => {
		if (isOpen && client?.id) {
			fetchAgentMinutesData(client.id);
		}
	}, [isOpen, client?.id, supabase]);

	if (!isOpen || !client) return null;

	const handleBillingTypeChange = (type: BillingType) => {
		setBillingConfig(prev => ({ ...prev, type }));
	};

	const handleRateChange = (type: 'perMinute' | 'outcomeBased', value: string) => {
		const numValue = parseFloat(value) || 0;
		setTempRates(prev => ({ ...prev, [type]: numValue }));
		
		if (type === 'perMinute') {
			setBillingConfig(prev => ({ ...prev, perMinuteRate: numValue }));
		} else {
			setBillingConfig(prev => ({ ...prev, outcomeBasedRate: numValue }));
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div 
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
				onClick={onClose}
			/>
			
			{/* Modal */}
			<div className="relative w-full max-w-5xl mx-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-white/10">
					<div className="flex items-center gap-3">
						<div className="p-3 bg-[var(--color-sky-blue)]/20 rounded-xl">
							<PiBuildingsDuotone className="w-6 h-6 text-[var(--color-sky-blue)]" />
						</div>
						<div>
							<h2 className="text-xl font-semibold text-white">{client.name}</h2>
							<p className="text-sm text-white/60">Client Details & Billing</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="p-2 hover:bg-white/10 rounded-xl transition-colors"
					>
						<PiXDuotone className="w-6 h-6 text-white/70 hover:text-white" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 space-y-6">
					{/* Client Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium text-white">Client Information</h3>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="p-4 bg-white/5 rounded-xl border border-white/10">
								<div className="flex items-center gap-3 mb-2">
									<PiBuildingsDuotone className="w-5 h-5 text-white/60" />
									<span className="text-sm text-white/60">Company</span>
								</div>
								<p className="text-white font-medium">{client.company_name || 'Not specified'}</p>
							</div>

							<div className="p-4 bg-white/5 rounded-xl border border-white/10">
								<div className="flex items-center gap-3 mb-2">
									<PiUsersDuotone className="w-5 h-5 text-white/60" />
									<span className="text-sm text-white/60">Users</span>
								</div>
								<p className="text-white font-medium">
									{client.user_count ?? 0} user{(client.user_count ?? 0) !== 1 ? 's' : ''}
								</p>
							</div>

							<div className="p-4 bg-white/5 rounded-xl border border-white/10">
								<div className="flex items-center gap-3 mb-2">
									<PiCalendarDuotone className="w-5 h-5 text-white/60" />
									<span className="text-sm text-white/60">Created</span>
								</div>
								<p className="text-white font-medium">{formatClientDate(client.created_at)}</p>
							</div>

							<div className="p-4 bg-white/5 rounded-xl border border-white/10">
								<div className="flex items-center gap-3 mb-2">
									<PiTargetDuotone className="w-5 h-5 text-white/60" />
									<span className="text-sm text-white/60">Status</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 bg-[var(--color-grassy-green)] rounded-full"></span>
									<span className="text-[var(--color-grassy-green)] font-medium">Active</span>
								</div>
							</div>
						</div>
					</div>

					{/* Agent Activity This Month */}
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<PiChartLineUpDuotone className="w-6 h-6 text-[var(--color-sky-blue)]" />
							<h3 className="text-lg font-medium text-white">Agent Activity This Month</h3>
						</div>

						{agentMinutesData.isLoading ? (
							<div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
								<div className="text-white/70">Loading agent activity...</div>
							</div>
						) : agentMinutesData.error ? (
							<div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
								<strong>Error:</strong> {agentMinutesData.error}
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="p-4 bg-white/5 rounded-xl border border-white/10">
									<div className="flex items-center gap-3 mb-2">
										<PiClockDuotone className="w-5 h-5 text-[var(--color-sky-blue)]" />
										<span className="text-sm text-white/60">Total Minutes</span>
									</div>
									<p className="text-2xl font-semibold text-white">
										{agentMinutesData.totalMinutes.toLocaleString()}
									</p>
									<p className="text-xs text-white/50 mt-1">
										{Math.floor(agentMinutesData.totalMinutes / 60)}h {agentMinutesData.totalMinutes % 60}m
									</p>
								</div>

								<div className="p-4 bg-white/5 rounded-xl border border-white/10">
									<div className="flex items-center gap-3 mb-2">
										<PiTargetDuotone className="w-5 h-5 text-[var(--color-grassy-green)]" />
										<span className="text-sm text-white/60">Total Calls</span>
									</div>
									<p className="text-2xl font-semibold text-white">
										{agentMinutesData.totalCalls.toLocaleString()}
									</p>
									<p className="text-xs text-white/50 mt-1">
										{agentMinutesData.totalCalls > 0 
											? `Avg ${Math.round(agentMinutesData.totalMinutes / agentMinutesData.totalCalls)} min/call`
											: 'No calls yet'
										}
									</p>
								</div>

								<div className="p-4 bg-white/5 rounded-xl border border-white/10">
									<div className="flex items-center gap-3 mb-2">
										<PiBuildingsDuotone className="w-5 h-5 text-[var(--color-hover-pink)]" />
										<span className="text-sm text-white/60">Active Agents</span>
									</div>
									<p className="text-2xl font-semibold text-white">
										{agentMinutesData.agentCount}
									</p>
									<p className="text-xs text-white/50 mt-1">
										{agentMinutesData.agentCount === 1 ? 'agent' : 'agents'} assigned
									</p>
								</div>
							</div>
						)}

						{/* Monthly Billing Estimate */}
						{!agentMinutesData.isLoading && !agentMinutesData.error && agentMinutesData.totalMinutes > 0 && (
							<div className="p-4 bg-[var(--color-main-accent)]/10 border border-[var(--color-main-accent)]/20 rounded-xl">
								<div className="flex items-center justify-between">
									<div>
										<div className="flex items-center gap-2 mb-1">
											<PiCurrencyDollarDuotone className="w-4 h-4 text-[var(--color-main-accent)]" />
											<span className="text-sm font-medium text-[var(--color-main-accent)]">Estimated Monthly Bill</span>
										</div>
										<p className="text-white text-sm">
											Based on current billing model and this month's activity
										</p>
									</div>
									<div className="text-right">
										<p className="text-2xl font-semibold text-white">
											${billingConfig.type === 'per_minute' 
												? (agentMinutesData.totalMinutes * (billingConfig.perMinuteRate || 0)).toFixed(2)
												: (agentMinutesData.totalCalls * (billingConfig.outcomeBasedRate || 0)).toFixed(2)
											}
										</p>
										<p className="text-xs text-white/60">
											{billingConfig.type === 'per_minute' 
												? `${agentMinutesData.totalMinutes} min × $${billingConfig.perMinuteRate?.toFixed(2)}`
												: `${agentMinutesData.totalCalls} calls × $${billingConfig.outcomeBasedRate?.toFixed(2)}`
											}
										</p>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Billing Configuration */}
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<PiCurrencyDollarDuotone className="w-6 h-6 text-[var(--color-main-accent)]" />
							<h3 className="text-lg font-medium text-white">Billing Configuration</h3>
						</div>

						{/* Billing Type Selection */}
						<div className="space-y-3">
							<p className="text-sm text-white/70">Choose billing model for this client:</p>
							
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								{/* Per Minute Option */}
								<div 
									className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
										billingConfig.type === 'per_minute'
											? 'bg-[var(--color-main-accent)]/20 border-[var(--color-main-accent)]/50 shadow-lg'
											: 'bg-white/5 border-white/20 hover:bg-white/8 hover:border-white/30'
									}`}
									onClick={() => handleBillingTypeChange('per_minute')}
								>
									<div className="flex items-center gap-3 mb-3">
										<div className={`p-2 rounded-lg ${
											billingConfig.type === 'per_minute'
												? 'bg-[var(--color-main-accent)]/30'
												: 'bg-white/10'
										}`}>
											<PiClockDuotone className={`w-5 h-5 ${
												billingConfig.type === 'per_minute'
													? 'text-[var(--color-main-accent)]'
													: 'text-white/60'
											}`} />
										</div>
										<div>
											<h4 className="font-medium text-white">Per Minute</h4>
											<p className="text-xs text-white/60">Charge based on call duration</p>
										</div>
									</div>
									
									<div className="space-y-2">
										<label className="text-sm text-white/70">Rate per minute ($)</label>
										<input
											type="number"
											step="0.01"
											min="0"
											value={tempRates.perMinute}
											onChange={(e) => handleRateChange('perMinute', e.target.value)}
											className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 focus:bg-white/15 transition-all"
											placeholder="0.50"
										/>
									</div>
								</div>

								{/* Outcome Based Option */}
								<div 
									className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
										billingConfig.type === 'outcome_based'
											? 'bg-[var(--color-main-accent)]/20 border-[var(--color-main-accent)]/50 shadow-lg'
											: 'bg-white/5 border-white/20 hover:bg-white/8 hover:border-white/30'
									}`}
									onClick={() => handleBillingTypeChange('outcome_based')}
								>
									<div className="flex items-center gap-3 mb-3">
										<div className={`p-2 rounded-lg ${
											billingConfig.type === 'outcome_based'
												? 'bg-[var(--color-main-accent)]/30'
												: 'bg-white/10'
										}`}>
											<PiTargetDuotone className={`w-5 h-5 ${
												billingConfig.type === 'outcome_based'
													? 'text-[var(--color-main-accent)]'
													: 'text-white/60'
											}`} />
										</div>
										<div>
											<h4 className="font-medium text-white">Outcome Based</h4>
											<p className="text-xs text-white/60">Charge based on successful outcomes</p>
										</div>
									</div>
									
									<div className="space-y-2">
										<label className="text-sm text-white/70">Rate per outcome ($)</label>
										<input
											type="number"
											step="0.01"
											min="0"
											value={tempRates.outcomeBased}
											onChange={(e) => handleRateChange('outcomeBased', e.target.value)}
											className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 focus:bg-white/15 transition-all"
											placeholder="25.00"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Current Configuration Summary */}
						<div className="p-4 bg-[var(--color-main-accent)]/10 border border-[var(--color-main-accent)]/20 rounded-xl">
							<div className="flex items-center gap-2 mb-2">
								<span className="w-2 h-2 bg-[var(--color-main-accent)] rounded-full"></span>
								<span className="text-sm font-medium text-[var(--color-main-accent)]">Active Billing Model</span>
							</div>
							<p className="text-white">
								{billingConfig.type === 'per_minute' 
									? `Per Minute: $${billingConfig.perMinuteRate?.toFixed(2)}/min`
									: `Outcome Based: $${billingConfig.outcomeBasedRate?.toFixed(2)}/outcome`
								}
							</p>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
					<button
						onClick={onClose}
						className="px-4 py-2 text-white/70 hover:text-white transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onClose}
						className="px-6 py-2 bg-[var(--color-main-accent)]/20 hover:bg-[var(--color-main-accent)]/30 border border-[var(--color-main-accent)]/30 hover:border-[var(--color-main-accent)]/50 rounded-xl text-[var(--color-main-accent)] font-medium transition-all duration-300"
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	);
}
