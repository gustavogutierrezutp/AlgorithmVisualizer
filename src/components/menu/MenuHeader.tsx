import { Layers } from "lucide-react";

export interface MenuHeaderProps {
  scrollProgress: number;
}

export const MenuHeader = ({ scrollProgress }: MenuHeaderProps) => {
  // Cálculos de animación
  const headerHeight = 64 - scrollProgress * 26;
  const fontSize = 1.125 - scrollProgress * 0.35;
  const logoScale = 1 - scrollProgress * 0.4;
  const logoRotate = scrollProgress * 90;
  const textOpacity = 1 - scrollProgress * 0.5;
  const borderOpacity = scrollProgress * 0.6;

  return (
    <>
      <div
        className="sticky top-0 z-20 px-5 flex items-center gap-3 bg-gradient-to-b from-gray-50 to-gray-50/95 transition-all duration-300 ease-out"
        style={{
          height: `${headerHeight}px`,
          borderBottom: `1px solid rgba(229, 231, 235, ${borderOpacity})`,
          boxShadow:
            scrollProgress > 0
              ? `0 4px 12px rgba(0, 0, 0, ${scrollProgress * 0.08})`
              : "none",
        }}
      >
        <div
          className="relative flex items-center justify-center transition-all duration-300 ease-out"
          style={{
            transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
            opacity: 1 - scrollProgress * 0.3,
          }}
        >
          <div
            className="absolute inset-0 bg-blue-500/20 rounded-lg blur-md"
            style={{ opacity: scrollProgress }}
          ></div>

          <div
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center relative z-10 shadow-lg"
            style={{
              boxShadow: `0 0 ${scrollProgress * 20}px rgba(59, 130, 246, ${
                scrollProgress * 0.6
              })`,
            }}
          >
            <Layers size={16} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <h2
            className="font-bold text-gray-800 transition-all duration-300 ease-out whitespace-nowrap"
            style={{
              fontSize: `${fontSize}rem`,
              opacity: textOpacity,
              transform: `translateY(${scrollProgress * -2}px)`,
              letterSpacing: scrollProgress > 0.5 ? "0.05em" : "0",
            }}
          >
            Sections
          </h2>
        </div>

        <div
          className="w-[.2rem] h-3 bg-gradient-to-b from-blue-500 to-blue-300 rounded-full transition-all duration-300"
          style={{
            opacity: scrollProgress,
            transform: `scaleY(${scrollProgress})`,
          }}
        ></div>
      </div>

      <div
        className="sticky z-20 h-1 bg-gray-200/50"
        style={{ top: `${headerHeight}px` }}
      >
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 transition-all duration-150 ease-out shadow-lg"
          style={{
            width: `${scrollProgress * 100}%`,
            boxShadow:
              scrollProgress > 0
                ? `0 0 10px rgba(59, 130, 246, ${scrollProgress * 0.6})`
                : "none",
          }}
        ></div>
      </div>
    </>
  );
};
