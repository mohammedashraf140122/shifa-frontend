export default function Button({ children }) {
  return (
    <button
      className="w-full bg-gradient-to-r from-primary to-primaryDark 
      hover:from-primaryDark hover:to-primaryDarker
      active:from-primaryDarker active:to-primaryDarker
      text-white 
      p-4 sm:p-3.5 md:p-3 
      rounded-xl 
      transition-all duration-300 
      text-base sm:text-base md:text-lg 
      font-semibold
      shadow-lg hover:shadow-xl active:shadow-lg
      active:scale-[0.97]
      transform
      relative overflow-hidden
      group
      touch-manipulation
      select-none"
    >
      {/* Shine effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent 
        via-white/20 to-transparent 
        translate-x-[-100%] group-hover:translate-x-[100%]
        transition-transform duration-700"></span>
      
      <span className="relative z-10">{children}</span>
    </button>
  );
}
