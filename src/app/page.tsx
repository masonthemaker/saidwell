import Sidebar from "@/components/Sidebar";
import ParallaxBackground from "@/components/ParallaxBackground";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-app-bg relative">
      <Sidebar />
      <ParallaxBackground />
    </div>
  );
}
