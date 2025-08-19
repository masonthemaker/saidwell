"use client";

import { PiHouseDuotone, PiFolderSimpleDashedDuotone, PiLegoSmileyDuotone } from "react-icons/pi";
import { usePathname } from "next/navigation";
import ProfileSection from "./ProfileSection";

interface SidebarProps {
	isExpanded: boolean;
	setIsExpanded: (expanded: boolean) => void;
}

export default function Sidebar({ isExpanded, setIsExpanded }: SidebarProps) {
	const pathname = usePathname();
	const isHomeActive = pathname === "/";
	const isAgentsActive = pathname === "/agents";
	const isFilesActive = pathname === "/files";
	
	return (
		<aside
			aria-label="Primary navigation"
			className={`fixed left-0 top-0 h-screen ${isExpanded ? "w-48" : "w-16"} transition-all duration-500 ease-out overflow-hidden bg-white/3 backdrop-blur-xl border-r border-white/5 flex flex-col justify-start pt-6 pb-4`}
			onMouseEnter={() => setIsExpanded(true)}
			onMouseLeave={() => setIsExpanded(false)}
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
						</button>
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
					<li>
						<button
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
						</button>
					</li>
					<li>
						<button
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
						</button>
					</li>
				</ul>
			</nav>

			{/* Profile Section */}
			<ProfileSection isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
		</aside>
	);
}
