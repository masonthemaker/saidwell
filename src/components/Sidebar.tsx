"use client";

import { useState } from "react";
import { FaHouseDamage, FaChevronDown, FaSignOutAlt, FaBuilding, FaUser } from "react-icons/fa";
import { PiAppWindowDuotone, PiHouseDuotone } from "react-icons/pi";

export default function Sidebar() {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);

	return (
		<aside
			aria-label="Primary navigation"
			className={`fixed left-0 top-0 h-screen ${isExpanded ? "w-48" : "w-16"} transition-all duration-300 overflow-hidden bg-white/3 backdrop-blur-xl border-r border-white/5 flex flex-col justify-start pt-6 pb-4`}
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
						<button
							aria-label="Home"
							className={`group w-full flex items-center justify-center p-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-saturate-150`}
						>
							<PiHouseDuotone className={`shrink-0 transition-all duration-300 text-main-accent group-hover:text-hover-pink ${isExpanded ? "w-4 h-4" : "w-6 h-6"}`} />
							<span className={`transition-all duration-300 whitespace-nowrap font-semibold tracking-tight text-sm overflow-hidden ${isExpanded ? "ml-2 max-w-[8rem] opacity-100" : "ml-0 max-w-0 opacity-0"}`}>
								Home
							</span>
						</button>
					</li>
				</ul>
			</nav>

			{/* Divider for collapsed state */}
			{!isExpanded && (
				<div className="w-full mt-4 mb-4">
					<div className="border-t border-gray-300/40"></div>
				</div>
			)}

			{/* Profile/Org section */}
			<div className="mt-auto mb-2 w-full px-2 relative">
				{isExpanded ? (
					<div className="w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-3 backdrop-saturate-150">
						{/* User Info */}
						<div className="mb-3">
							<div className="text-xs text-gray-300 font-medium">John Doe</div>
						</div>
						
						{/* Org Dropdown */}
						<button
							onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
							className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
						>
							<div className="flex items-center">
								<FaBuilding className="w-3 h-3 mr-2 text-main-accent" />
								<span className="text-xs text-gray-200 font-medium">Acme Corp</span>
							</div>
							<FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOrgDropdownOpen ? 'rotate-180' : ''}`} />
						</button>

						{/* Dropdown Menu */}
						{isOrgDropdownOpen && (
							<div className="absolute bottom-full mb-2 left-2 right-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2 backdrop-saturate-150">
								<div className="space-y-1">
									<button className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-white/10 rounded-lg transition-colors">
										Acme Corp
									</button>
									<button className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-white/10 rounded-lg transition-colors">
										Tech Solutions Inc
									</button>
									<button className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-white/10 rounded-lg transition-colors">
										StartupXYZ
									</button>
								</div>
							</div>
						)}

						{/* Logout Button */}
						<button className="w-full flex items-center p-2 mt-3 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-200">
							<FaSignOutAlt className="w-3 h-3 mr-2 text-red-400" />
							<span className="text-xs text-red-400 font-medium">Logout</span>
						</button>
					</div>
				) : (
					/* Collapsed Profile Button */
					<button
						onClick={() => {
							setIsExpanded(true);
							setIsOrgDropdownOpen(false);
						}}
						className="group w-full flex items-center justify-center p-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-saturate-150"
					>
						<FaUser className="w-5 h-5 text-main-accent group-hover:text-hover-green transition-all duration-300" />
					</button>
				)}
			</div>

			{/* Open/Close button at bottom */}
			<div className="w-full px-2">
				<button
					aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
					onClick={() => setIsExpanded((v) => !v)}
					className="group w-full flex items-center justify-center text-main-accent p-3 rounded-xl bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-saturate-150"
				>
					<PiAppWindowDuotone className="w-5 h-5 text-main-accent group-hover:text-hover-tan transition-all duration-300" />
				</button>
			</div>
		</aside>
	);
}


