import Image from "next/image";

export default function ParallaxBackground() {
  return (
    <div className="fixed bottom-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full translate-y-[40%] scale-90">
        <Image
          src="/background2.png"
          alt="Background"
          width={1920}
          height={800}
          priority
          className="w-full h-auto object-cover opacity-30 parallax-image"
          style={{
            transform: 'translateZ(0)', // Enable hardware acceleration
            willChange: 'transform'
          }}
        />
      </div>
    </div>
  );
}
