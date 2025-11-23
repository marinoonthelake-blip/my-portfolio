export default function LogoTicker() {
  const logos = ["Google", "YouTube", "CareerBuilder", "E*TRADE", "Oddcast", "Boombox", "AfroReggae"];

  return (
    <div className="w-full border-y border-gray-800 bg-[#050505] py-8 overflow-hidden">
      <div className="flex w-full items-center justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        {logos.map((logo) => (
          <span key={logo} className="text-xl font-sans font-bold text-white tracking-tight">
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}