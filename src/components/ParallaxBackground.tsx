import Image from "next/image";

interface ParallaxBackgroundProps {
  variant?: 'default' | 'login' | 'signup';
}

const backgroundImages = {
  default: '/background.png',
  login: '/background2.png',
  signup: '/background3.png'
};

export default function ParallaxBackground({ variant = 'default' }: ParallaxBackgroundProps) {
  const backgroundSrc = backgroundImages[variant];
  const isAuthPage = variant === 'login' || variant === 'signup';

  if (isAuthPage) {
    // Full-size styling for auth pages
    return (
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute inset-0 w-full h-full translate-y-[20%] scale-110">
          <Image
            src={backgroundSrc}
            alt="Background"
            width={1920}
            height={800}
            priority
            className="w-full h-full object-cover opacity-30 parallax-image"
            style={{
              transform: 'translateZ(0)', // Enable hardware acceleration
              willChange: 'transform',
              minWidth: '100vw',
              minHeight: '100vh'
            }}
          />
        </div>
      </div>
    );
  }

  // Original styling for non-auth pages
  return (
    <div className="fixed bottom-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full translate-y-[40%] scale-90">
        <Image
          src={backgroundSrc}
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
