"use client";

import { PiHouseDuotone, PiFolderSimpleDashedDuotone, PiLegoSmileyDuotone, PiClockCountdownDuotone, PiArrowFatLineLeftDuotone, PiArrowFatLineRightDuotone, PiSignOutDuotone, PiAddressBookDuotone } from "react-icons/pi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import useAuth from "@/hooks/use-auth";

interface SidebarProps {
	isExpanded: boolean;
	setIsExpanded: (expanded: boolean) => void;
}

// Custom Logout Button Component
function CustomLogoutButton({ isExpanded }: { isExpanded: boolean }) {
	const router = useRouter();

	const handleLogout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push('/auth/login');
	};

	return (
		<button
			onClick={handleLogout}
			aria-label="Sign out"
			className="group w-full flex items-center justify-center p-2 rounded-md bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-500 ease-out backdrop-saturate-150"
		>
			<PiSignOutDuotone className={`shrink-0 transition-all duration-500 ease-out text-red-400 group-hover:text-red-300 ${
				isExpanded ? "w-4 h-4" : "w-6 h-6"
			}`} />
			<span className={`transition-all duration-500 ease-out whitespace-nowrap font-semibold tracking-tight text-sm text-white overflow-hidden ${
				isExpanded ? "ml-2 max-w-[8rem] opacity-100" : "ml-0 max-w-0 opacity-0"
			}`}>
				Sign out
			</span>
		</button>
	);
}

export default function Sidebar({ isExpanded, setIsExpanded }: SidebarProps) {
	const pathname = usePathname();
	const { isOwner, isAdmin, isUser } = useAuth();
	const isHomeActive = pathname === "/";
	const isAgentsActive = pathname === "/agents";
	const isClientsActive = pathname === "/clients";
	const isFilesActive = pathname === "/files";
	const isHistoryActive = pathname === "/history";
	
	// Show agents link only for company users (owners, admins, members), not client users
	const canAccessAgents = isOwner() || isAdmin() || isUser();
	
	return (
		<aside
			aria-label="Primary navigation"
			className={`fixed left-0 top-0 h-screen ${isExpanded ? "w-48" : "w-16"} transition-all duration-500 ease-out overflow-hidden bg-white/3 backdrop-blur-xl border-r border-white/5 flex flex-col justify-start pt-6 pb-4`}
		>
			{isExpanded && (
				<div className="w-full px-2 mb-4 flex justify-center">
					<div aria-label="Logo">
						<h1 className="text-xl font-semibold text-main-accent">LOGO</h1>
					</div>
				</div>
			)}

			{/* Divider */}
			{isExpanded && (
				<div className="w-full mb-4">
					<div className="border-t border-gray-300/40"></div>
				</div>
			)}

			<nav aria-label="Primary" className="w-full px-2">
				<ul className="flex flex-col items-stretch gap-3">
					<li>
						<Link
							href="/"
							aria-label="Home"
							className={`group w-full flex items-center justify-center p-2 rounded-md bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-500 ease-out backdrop-saturate-150`}
						>
							<PiHouseDuotone className={`shrink-0 transition-all duration-500 ease-out ${
								isHomeActive 
									? "text-hover-pink" 
									: "text-main-accent group-hover:text-hover-pink"
							} ${isExpanded ? "w-4 h-4" : "w-6 h-6"}`} />
							<span className={`transition-all duration-500 ease-out whitespace-nowrap font-semibold tracking-tight text-sm text-white overflow-hidden ${isExpanded ? "ml-2 max-w-[8rem] opacity-100" : "ml-0 max-w-0 opacity-0"}`}>
								Home
							</span>
						</Link>
					</li>
				</ul>
			</nav>

			{/* Dotted separator when expanded */}
			{isExpanded && (
				<div className="w-full mt-3 mb-3">
					<div className="border-t-2 border-dotted border-white/20"></div>
				</div>
			)}

			{/* Divider/Spacing before Build section */}
			{isExpanded ? (
				<div className="w-full mt-0 mb-2"></div>
			) : (
				<div className="w-full mt-4 mb-4">
					<div className="border-t border-gray-300/40"></div>
				</div>
			)}

			{/* Build Navigation */}
			<nav aria-label="Build" className="w-full px-2 mb-4">
				<ul className="flex flex-col items-stretch gap-3">
					{canAccessAgents && (
						<li>
							<Link
								href="/agents"
								aria-label="Agents"
								className={`group w-full flex items-center justify-center p-2 rounded-md bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-500 ease-out backdrop-saturate-150`}
							>
								<PiLegoSmileyDuotone className={`shrink-0 transition-all duration-500 ease-out ${
									isAgentsActive 
										? "text-hover-pink" 
										: "text-main-accent group-hover:text-hover-pink"
								} ${isExpanded ? "w-4 h-4" : "w-6 h-6"}`} />
								<span className={`transition-all duration-500 ease-out whitespace-nowrap font-semibold tracking-tight text-sm text-white overflow-hidden ${isExpanded ? "ml-2 max-w-[8rem] opacity-100" : "ml-0 max-w-0 opacity-0"}`}>
									Agents
								</span>
							</Link>
						</li>
					)}
					{canAccessAgents && (
						<li>
							<Link
								href="/clients"
								aria-label="Clients"
								className={`group w-full flex items-center justify-center p-2 rounded-md bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-500 ease-out backdrop-saturate-150`}
							>
								<PiAddressBookDuotone className={`shrink-0 transition-all duration-500 ease-out ${
									isClientsActive 
										? "text-hover-pink" 
										: "text-main-accent group-hover:text-hover-pink"
								} ${isExpanded ? "w-4 h-4" : "w-6 h-6"}`} />
								<span className={`transition-all duration-500 ease-out whitespace-nowrap font-semibold tracking-tight text-sm text-white overflow-hidden ${isExpanded ? "ml-2 max-w-[8rem] opacity-100" : "ml-0 max-w-0 opacity-0"}`}>
									Clients
								</span>
							</Link>
						</li>
					)}
					<li>
						<Link
							href="/history"
							aria-label="History"
							className={`group w-full flex items-center justify-center p-2 rounded-md bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-500 ease-out backdrop-saturate-150`}
						>
							<PiClockCountdownDuotone className={`shrink-0 transition-all duration-500 ease-out ${
								isHistoryActive 
									? "text-hover-pink" 
									: "text-main-accent group-hover:text-hover-pink"
							} ${isExpanded ? "w-4 h-4" : "w-6 h-6"}`} />
							<span className={`transition-all duration-500 ease-out whitespace-nowrap font-semibold tracking-tight text-sm text-white overflow-hidden ${isExpanded ? "ml-2 max-w-[8rem] opacity-100" : "ml-0 max-w-0 opacity-0"}`}>
								History
							</span>
						</Link>
					</li>
					<li>
						<Link
							href="/files"
							aria-label="Files"
							className={`group w-full flex items-center justify-center p-2 rounded-md bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-500 ease-out backdrop-saturate-150`}
						>
							<PiFolderSimpleDashedDuotone className={`shrink-0 transition-all duration-500 ease-out ${
								isFilesActive 
									? "text-hover-pink" 
									: "text-main-accent group-hover:text-hover-pink"
							} ${isExpanded ? "w-4 h-4" : "w-6 h-6"}`} />
							<span className={`transition-all duration-500 ease-out whitespace-nowrap font-semibold tracking-tight text-sm text-white overflow-hidden ${isExpanded ? "ml-2 max-w-[8rem] opacity-100" : "ml-0 max-w-0 opacity-0"}`}>
								Files
							</span>
						</Link>
					</li>
				</ul>
			</nav>

			{/* Logout Section */}
			<div className="mt-auto mb-2 w-full px-2">
				{/* Divider above Logout */}
				{isExpanded ? (
					<div className="w-full mb-3">
						<div className="border-t-2 border-dotted border-white/20"></div>
					</div>
				) : (
					<div className="w-full mb-4">
						<div className="border-t border-gray-300/40"></div>
					</div>
				)}
				
				{/* Custom Logout Button matching sidebar style */}
				<CustomLogoutButton isExpanded={isExpanded} />
			</div>

			{/* Toggle Button */}
			<div className="mt-2 mb-2 w-full px-2">
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="group w-full flex items-center justify-center p-2 rounded-md bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-500 ease-out backdrop-saturate-150"
					aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
				>
					{isExpanded ? (
						<>
							<PiArrowFatLineLeftDuotone className="shrink-0 w-4 h-4 text-main-accent group-hover:text-hover-pink transition-all duration-500 ease-out" />
							<span className="ml-2 transition-all duration-500 ease-out whitespace-nowrap font-semibold tracking-tight text-sm text-white overflow-hidden max-w-[8rem] opacity-100">
								Collapse
							</span>
						</>
					) : (
						<PiArrowFatLineRightDuotone className="shrink-0 w-6 h-6 text-main-accent group-hover:text-hover-pink transition-all duration-500 ease-out" />
					)}
				</button>
			</div>
		</aside>
	);
}
