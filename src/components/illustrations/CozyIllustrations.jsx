export const CozyCatLogo = ({ className = "w-10 h-10" }) => <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {
  /* Cat Body */
}
    <path d="M 32 88 C 22 88, 20 62, 30 48 C 38 38, 62 38, 70 48 C 80 62, 78 88, 68 88 Z" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="3" />
    
    {
  /* Paws */
}
    <ellipse cx="40" cy="88" rx="8" ry="5" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="2.5" />
    <ellipse cx="60" cy="88" rx="8" ry="5" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="2.5" />
    
    {
  /* Tail curling up right */
}
    <path d="M 68 80 Q 88 78 84 62 Q 80 50 72 58" stroke="#8B5E3C" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    
    {
  /* Cat Head */
}
    <circle cx="50" cy="38" r="24" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="3" />
    
    {
  /* Ears */
}
    <path d="M 32 22 L 22 6 L 42 16 Z" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="2.5" />
    <path d="M 32 20 L 26 10 L 38 16 Z" fill="#FFB7B2" opacity="0.7" />
    
    <path d="M 68 22 L 78 6 L 58 16 Z" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="2.5" />
    <path d="M 68 20 L 74 10 L 62 16 Z" fill="#FFB7B2" opacity="0.7" />
    
    {
  /* Flower on right ear */
}
    <circle cx="72" cy="18" r="4.5" fill="#D88A5C" />
    <circle cx="72" cy="18" r="2" fill="#FFF5EC" />
    
    {
  /* Collar */
}
    <path d="M 36 54 C 44 58, 56 58, 64 54" stroke="#D88A5C" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="50" cy="57" r="3" fill="#E29578" />
    
    {
  /* Sleeping/Happy ^ ^ Eyes */
}
    <path d="M 38 38 Q 43 32 48 38" stroke="#5C3A2E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M 52 38 Q 57 32 62 38" stroke="#5C3A2E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    
    {
  /* Tiny Nose & Mouth */
}
    <path d="M 50 42 L 48 44 L 52 44 Z" fill="#C46E52" />
    <path d="M 47 46 Q 50 48 53 46" stroke="#5C3A2E" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    
    {
  /* Blush Cheeks */
}
    <circle cx="36" cy="42" r="4" fill="#FFB7B2" opacity="0.65" />
    <circle cx="64" cy="42" r="4" fill="#FFB7B2" opacity="0.65" />
    
    {
  /* Whiskers */
}
    <path d="M 28 39 L 18 37" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 28 42 L 18 43" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 72 39 L 82 37" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M 72 42 L 82 43" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
export const CoffeeCupIllustration = ({ className = "w-24 h-24" }) => <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {
  /* Steam paths */
}
    <path d="M75 45 C75 35, 85 30, 80 20" stroke="#D4A373" strokeWidth="3" strokeLinecap="round" opacity="0.6">
      <animate attributeName="d" values="M75 45 C75 35, 85 30, 80 20; M75 45 C65 35, 75 30, 85 20; M75 45 C75 35, 85 30, 80 20" dur="4s" repeatCount="indefinite" />
    </path>
    <path d="M100 40 C100 30, 110 25, 105 15" stroke="#D4A373" strokeWidth="3" strokeLinecap="round" opacity="0.8">
      <animate attributeName="d" values="M100 40 C100 30, 110 25, 105 15; M100 40 C110 30, 100 25, 105 15; M100 40 C100 30, 110 25, 105 15" dur="3.5s" repeatCount="indefinite" />
    </path>
    <path d="M125 45 C125 35, 135 30, 130 20" stroke="#D4A373" strokeWidth="3" strokeLinecap="round" opacity="0.6">
      <animate attributeName="d" values="M125 45 C125 35, 135 30, 130 20; M125 45 C115 35, 125 30, 135 20; M125 45 C125 35, 135 30, 130 20" dur="4.2s" repeatCount="indefinite" />
    </path>

    {
  /* Saucer */
}
    <ellipse cx="100" cy="165" rx="80" ry="16" fill="#E8DDD0" stroke="#C4B09B" strokeWidth="2" />
    <ellipse cx="100" cy="162" rx="65" ry="10" fill="#FAF6F0" />

    {
  /* Cup Handle */
}
    <path d="M150 85 C180 85, 180 135, 145 135" stroke="#D4C3B3" strokeWidth="14" strokeLinecap="round" fill="none" />
    <path d="M150 85 C175 85, 175 135, 145 135" stroke="#FAF6F0" strokeWidth="8" strokeLinecap="round" fill="none" />

    {
  /* Cup Body */
}
    <path d="M50 70 L58 145 C60 155, 140 155, 142 145 L150 70 Z" fill="#FFFBF7" stroke="#D4C3B3" strokeWidth="3" />
    
    {
  /* Coffee Liquid Top Rim */
}
    <ellipse cx="100" cy="70" rx="50" ry="18" fill="#5C3D2E" stroke="#3B281C" strokeWidth="2" />
    <ellipse cx="100" cy="70" rx="46" ry="15" fill="#8B5E3C" />

    {
  /* Latte Art Heart */
}
    <path d="M100 78 C90 68, 80 72, 85 80 C90 86, 100 92, 100 92 C100 92, 110 86, 115 80 C120 72, 110 68, 100 78 Z" fill="#F5EFE6" opacity="0.9" />
    <circle cx="100" cy="70" r="3" fill="#F5EFE6" opacity="0.8" />
  </svg>;
export const MapleLeafIcon = ({
  className = "w-5 h-5",
  color = "#E07A5F"
}) => <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {
  /* Classic 5-Pointed Maple Leaf Silhouette */
}
    <path
  d="M50 8 L54 22 L65 15 L62 28 L75 25 L69 38 L83 43 L72 52 L77 64 L62 58 L58 72 L50 64 L42 72 L38 58 L23 64 L28 52 L17 43 L31 38 L25 25 L38 28 L35 15 L46 22 Z"
  fill={color}
/>
    {
  /* Center Vein & Stem */
}
    <path d="M50 30 L50 92" stroke={color === "#E07A5F" ? "#8B3A22" : "#5D4037"} strokeWidth="3" strokeLinecap="round" />
    <path d="M50 45 L32 35" stroke={color === "#E07A5F" ? "#8B3A22" : "#5D4037"} strokeWidth="2" strokeLinecap="round" />
    <path d="M50 45 L68 35" stroke={color === "#E07A5F" ? "#8B3A22" : "#5D4037"} strokeWidth="2" strokeLinecap="round" />
    <path d="M50 58 L28 52" stroke={color === "#E07A5F" ? "#8B3A22" : "#5D4037"} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M50 58 L72 52" stroke={color === "#E07A5F" ? "#8B3A22" : "#5D4037"} strokeWidth="1.8" strokeLinecap="round" />
  </svg>;
export const AutumnLeafIllustration = ({ className = "w-12 h-12" }) => <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="mapleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E07A5F" />
        <stop offset="50%" stopColor="#E29578" />
        <stop offset="100%" stopColor="#D4A373" />
      </linearGradient>
    </defs>
    {
  /* Main Maple Leaf Shape */
}
    <path
  d="M50 6 L55 22 L67 14 L63 28 L78 26 L71 40 L86 46 L74 56 L80 68 L64 62 L60 76 L50 68 L40 76 L36 62 L20 68 L26 56 L14 46 L29 40 L22 26 L37 28 L33 14 L45 22 Z"
  fill="url(#mapleGrad)"
  stroke="#8B3A22"
  strokeWidth="1.5"
/>
    {
  /* Stem & Veins */
}
    <path d="M50 68 L50 94" stroke="#8B5E3C" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M50 25 L50 68" stroke="#8B3A22" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 40 L30 30" stroke="#8B3A22" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M50 40 L70 30" stroke="#8B3A22" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M50 54 L26 48" stroke="#8B3A22" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M50 54 L74 48" stroke="#8B3A22" strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
export const MapleLeafCluster = ({ className = "w-24 h-24" }) => <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {
  /* Muted Gold Leaf */
}
    <g transform="translate(10, 30) rotate(-25)">
      <path
  d="M40 5 L44 18 L55 12 L51 23 L63 21 L57 32 L70 37 L60 45 L65 55 L52 50 L48 62 L40 55 L32 62 L28 50 L15 55 L20 45 L10 37 L23 32 L17 21 L29 23 L25 12 L36 18 Z"
  fill="#D4A373"
/>
      <path d="M40 55 L40 75" stroke="#8B5E3C" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    {
  /* Soft Amber Leaf */
}
    <g transform="translate(50, 20) rotate(20)">
      <path
  d="M40 5 L44 18 L55 12 L51 23 L63 21 L57 32 L70 37 L60 45 L65 55 L52 50 L48 62 L40 55 L32 62 L28 50 L15 55 L20 45 L10 37 L23 32 L17 21 L29 23 L25 12 L36 18 Z"
  fill="#E29578"
/>
      <path d="M40 55 L40 75" stroke="#A0522D" strokeWidth="2.5" strokeLinecap="round" />
    </g>
    {
  /* Burnt Orange Center Leaf */
}
    <g transform="translate(30, 10)">
      <path
  d="M40 5 L44 18 L55 12 L51 23 L63 21 L57 32 L70 37 L60 45 L65 55 L52 50 L48 62 L40 55 L32 62 L28 50 L15 55 L20 45 L10 37 L23 32 L17 21 L29 23 L25 12 L36 18 Z"
  fill="#E07A5F"
  stroke="#8B3A22"
  strokeWidth="1"
/>
      <path d="M40 55 L40 85" stroke="#8B3A22" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>;
export const MapleLeafDivider = ({ className = "w-full my-6" }) => <div className={`flex items-center justify-center gap-3 ${className}`}>
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#E07A5F]/40 to-[#E07A5F]/10" />
    <MapleLeafIcon className="w-5 h-5 text-[#E07A5F]" />
    <MapleLeafIcon className="w-3.5 h-3.5 text-[#D4A373] -ml-1" />
    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#E07A5F]/40 to-[#E07A5F]/10" />
  </div>;
export const JournalBookIllustration = ({ className = "w-20 h-20" }) => <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {
  /* Book Shadow */
}
    <ellipse cx="80" cy="125" rx="65" ry="10" fill="#3B281C" opacity="0.12" />
    {
  /* Book Cover */
}
    <rect x="20" y="20" width="120" height="95" rx="8" fill="#8B5E3C" stroke="#5C3D2E" strokeWidth="3" />
    {
  /* Pages depth */
}
    <path d="M28 26 H132 V110 H28 Z" fill="#FAF6F0" />
    {
  /* Bookmark ribbon */
}
    <path d="M75 20 V85 L85 75 L95 85 V20 Z" fill="#E07A5F" />
    {
  /* Spine details */
}
    <line x1="28" y1="20" x2="28" y2="115" stroke="#5C3D2E" strokeWidth="4" />
    {
  /* Gold Embossed Symbol */
}
    <circle cx="110" cy="65" r="14" fill="#E6C594" opacity="0.3" />
    <path d="M110 57 C105 62, 105 68, 110 73 C115 68, 115 62, 110 57 Z" fill="#D4A373" />
    {
  /* Fountain Pen laying across */
}
    <g transform="rotate(-25 100 80)">
      <rect x="30" y="75" width="80" height="6" rx="3" fill="#3B281C" />
      <path d="M110 75 L122 78 L110 81 Z" fill="#D4A373" />
    </g>
  </svg>;
export const BotanicalPlantIllustration = ({ className = "w-20 h-24" }) => <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {
  /* Clay Pot */
}
    <path d="M35 100 L42 145 C43 150, 77 150, 78 145 L85 100 Z" fill="#C48B68" stroke="#8B5E3C" strokeWidth="2" />
    <rect x="30" y="92" width="60" height="10" rx="3" fill="#D4A373" stroke="#8B5E3C" strokeWidth="2" />
    
    {
  /* Plant Stems & Leaves */
}
    <path d="M60 92 C60 60, 35 40, 20 30" stroke="#657252" strokeWidth="3" strokeLinecap="round" />
    <path d="M60 92 C60 50, 80 35, 100 25" stroke="#657252" strokeWidth="3" strokeLinecap="round" />
    <path d="M60 92 C60 40, 60 20, 60 10" stroke="#657252" strokeWidth="3" strokeLinecap="round" />

    {
  /* Leaves */
}
    <path d="M20 30 C10 20, 15 5, 30 15 C35 25, 25 35, 20 30 Z" fill="#889868" />
    <path d="M100 25 C110 15, 105 0, 90 10 C85 20, 95 30, 100 25 Z" fill="#889868" />
    <path d="M60 10 C50 -2, 70 -2, 60 10 Z" fill="#99AA77" />
    <path d="M40 50 C25 45, 30 30, 45 40 Z" fill="#889868" />
    <path d="M80 50 C95 45, 90 30, 75 40 Z" fill="#889868" />
  </svg>;
export const BloomBotAvatar = ({ className = "w-10 h-10", isBlinking = false }) => <div className={`rounded-full bg-[#F5EBE1] border border-[#E2CEBC] flex items-center justify-center p-0.5 shadow-2xs overflow-hidden ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {
  /* Background Soft Glow */
}
      <circle cx="50" cy="50" r="48" fill="#FAF5EF" />

      {
  /* Cat Outer Ears */
}
      <path d="M 22 42 L 12 18 C 10 14, 18 12, 28 22 Z" fill="#E8C8B0" stroke="#8B5E3C" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 78 42 L 88 18 C 90 14, 82 12, 72 22 Z" fill="#E8C8B0" stroke="#8B5E3C" strokeWidth="2.5" strokeLinejoin="round" />
      {
  /* Inner Pink Ears */
}
      <path d="M 22 38 L 15 22 C 14 19, 19 18, 25 25 Z" fill="#FFB7B2" />
      <path d="M 78 38 L 85 22 C 86 19, 81 18, 75 25 Z" fill="#FFB7B2" />

      {
  /* Cat Head */
}
      <ellipse cx="50" cy="55" rx="38" ry="32" fill="#FFFDF7" stroke="#8B5E3C" strokeWidth="3" />
      
      {
  /* Fur Markings on forehead */
}
      <path d="M 44 26 C 47 23, 53 23, 56 26 C 53 32, 47 32, 44 26 Z" fill="#E8C8B0" />

      {
  /* Cheerful Pink Blush Cheeks */
}
      <circle cx="28" cy="60" r="7" fill="#FFB7B2" opacity="0.65" />
      <circle cx="72" cy="60" r="7" fill="#FFB7B2" opacity="0.65" />

      {
  /* Eyes (Happy arcs or gentle blink) */
}
      {isBlinking ? <>
          <path d="M 31 54 Q 37 58 43 54" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 57 54 Q 63 58 69 54" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" fill="none" />
        </> : <>
          <path d="M 31 54 Q 37 45 43 54" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 57 54 Q 63 45 69 54" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>}

      {
  /* Cat Nose & Cute Smile */
}
      <path d="M 48 58 L 52 58 L 50 61 Z" fill="#E07A5F" />
      <path d="M 44 65 Q 50 69 50 63 Q 50 69 56 65" stroke="#5D4037" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {
  /* Whiskers */
}
      <path d="M 22 56 L 12 54" stroke="#A07855" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 22 62 L 14 63" stroke="#A07855" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 78 56 L 88 54" stroke="#A07855" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 78 62 L 86 63" stroke="#A07855" strokeWidth="1.5" strokeLinecap="round" />

      {
  /* Small Pink Flower Tucked Behind Ear */
}
      <circle cx="28" cy="28" r="4" fill="#FFB7B2" />
      <circle cx="22" cy="28" r="4" fill="#FFB7B2" />
      <circle cx="25" cy="23" r="4" fill="#FFB7B2" />
      <circle cx="25" cy="33" r="4" fill="#FFB7B2" />
      <circle cx="25" cy="28" r="3" fill="#FFE5A3" />
    </svg>
  </div>;
export const BloomBotCatMascot = ({
  className = "w-48 h-48",
  showPlant = true
}) => <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 240 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
      {
  /* Soft Cozy Floor Shadow */
}
      <ellipse cx="120" cy="195" rx="90" ry="14" fill="#EADCCF" opacity="0.6" />

      {
  /* Potted Plant beside cat */
}
      {showPlant && <g transform="translate(160, 100)">
          {
  /* Clay Pot */
}
          <path d="M 20 50 L 25 80 C 26 84, 49 84, 50 80 L 55 50 Z" fill="#D4A373" stroke="#8B5E3C" strokeWidth="2" />
          <rect x="17" y="44" width="41" height="8" rx="3" fill="#E8C8B0" stroke="#8B5E3C" strokeWidth="2" />
          {
  /* Plant Stems & Leaves */
}
          <path d="M 37 44 Q 30 20 15 10" stroke="#657252" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 37 44 Q 45 15 60 8" stroke="#657252" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 37 44 L 37 5" stroke="#657252" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {
  /* Leaves */
}
          <path d="M 15 10 C 8 2, 10 -6, 22 2 C 26 8, 18 16, 15 10 Z" fill="#889868" />
          <path d="M 60 8 C 68 -2, 70 -6, 52 2 C 48 8, 56 16, 60 8 Z" fill="#889868" />
          <path d="M 37 5 C 30 -5, 44 -5, 37 5 Z" fill="#A2B382" />
          {
  /* Small Bloom Flower */
}
          <circle cx="37" cy="22" r="4" fill="#FFB7B2" />
          <circle cx="37" cy="22" r="1.5" fill="#FFE5A3" />
        </g>}

      {
  /* Cat Tail curled behind */
}
      <path d="M 65 160 C 35 150, 30 180, 50 185 C 60 188, 68 180, 68 170" stroke="#8B5E3C" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M 65 160 C 35 150, 30 180, 50 185 C 60 188, 68 180, 68 170" stroke="#FFFDF7" strokeWidth="7" strokeLinecap="round" fill="none" />

      {
  /* Cat Body */
}
      <path d="M 70 115 C 65 145, 68 185, 130 185 C 150 185, 152 145, 142 115 Z" fill="#FFFDF7" stroke="#8B5E3C" strokeWidth="3" />

      {
  /* Cat Paws (front feet) */
}
      <ellipse cx="92" cy="184" rx="10" ry="7" fill="#F5EBE1" stroke="#8B5E3C" strokeWidth="2" />
      <ellipse cx="118" cy="184" rx="10" ry="7" fill="#F5EBE1" stroke="#8B5E3C" strokeWidth="2" />

      {
  /* Cat Head */
}
      <g transform="translate(2, 0)">
        {
  /* Outer Ears */
}
        <path d="M 62 70 L 45 35 C 42 28, 55 25, 72 40 Z" fill="#E8C8B0" stroke="#8B5E3C" strokeWidth="3" strokeLinejoin="round" />
        <path d="M 148 70 L 165 35 C 168 28, 155 25, 138 40 Z" fill="#E8C8B0" stroke="#8B5E3C" strokeWidth="3" strokeLinejoin="round" />
        {
  /* Inner Pink Ears */
}
        <path d="M 62 65 L 50 42 C 48 37, 56 35, 68 45 Z" fill="#FFB7B2" />
        <path d="M 148 65 L 160 42 C 162 37, 154 35, 142 45 Z" fill="#FFB7B2" />

        {
  /* Head Circle */
}
        <ellipse cx="105" cy="85" rx="50" ry="42" fill="#FFFDF7" stroke="#8B5E3C" strokeWidth="3" />

        {
  /* Forehead Patch */
}
        <path d="M 97 45 C 102 40, 108 40, 113 45 C 108 52, 102 52, 97 45 Z" fill="#E8C8B0" />

        {
  /* Cheerful Pink Blush Cheeks */
}
        <circle cx="72" cy="92" r="9" fill="#FFB7B2" opacity="0.6" />
        <circle cx="138" cy="92" r="9" fill="#FFB7B2" opacity="0.6" />

        {
  /* Happy Eyes ^ ^ */
}
        <path d="M 78 84 Q 86 72 94 84" stroke="#5D4037" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M 116 84 Q 124 72 132 84" stroke="#5D4037" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {
  /* Nose & Cute Mouth */
}
        <path d="M 103 89 L 107 89 L 105 93 Z" fill="#E07A5F" />
        <path d="M 97 97 Q 105 102 105 95 Q 105 102 113 97" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" fill="none" />

        {
  /* Whiskers */
}
        <path d="M 65 88 L 50 85" stroke="#A07855" strokeWidth="2" strokeLinecap="round" />
        <path d="M 65 96 L 52 98" stroke="#A07855" strokeWidth="2" strokeLinecap="round" />
        <path d="M 145 88 L 160 85" stroke="#A07855" strokeWidth="2" strokeLinecap="round" />
        <path d="M 145 96 L 158 98" stroke="#A07855" strokeWidth="2" strokeLinecap="round" />

        {
  /* Pink Flower Bloom behind ear */
}
        <g transform="translate(68, 42)">
          <circle cx="0" cy="0" r="6" fill="#FFB7B2" />
          <circle cx="-6" cy="0" r="5" fill="#FFB7B2" />
          <circle cx="6" cy="0" r="5" fill="#FFB7B2" />
          <circle cx="0" cy="-6" r="5" fill="#FFB7B2" />
          <circle cx="0" cy="6" r="5" fill="#FFB7B2" />
          <circle cx="0" cy="0" r="4" fill="#FFE5A3" />
        </g>
      </g>
    </svg>
  </div>;
export const CozyHeroIllustration = ({ className = "w-full max-w-md" }) => <div className={`relative flex items-center justify-center ${className}`}>
    {
  /* Soft Painterly Ambient Sunlight Glow */
}
    <div className="absolute w-88 h-88 md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-tr from-[#FDE8D7] via-[#F5D5BF]/80 to-[#FFF8F1] -z-10 blur-3xl opacity-90 animate-pulse" style={{ animationDuration: "8s" }} />

    <svg viewBox="0 0 480 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto filter drop-shadow-[0_16px_32px_rgba(139,94,60,0.14)]">
      <defs>
        {
  /* Soft Watercolor & Painterly Gradients */
}
        <linearGradient id="windowBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFDF9" />
          <stop offset="50%" stopColor="#FAF0E4" />
          <stop offset="100%" stopColor="#F2E3D3" />
        </linearGradient>

        <linearGradient id="sunbeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEACC" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FAD8B6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFF8F1" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="hairGrad" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#5A3A2B" />
          <stop offset="50%" stopColor="#42271C" />
          <stop offset="100%" stopColor="#2D1910" />
        </linearGradient>

        <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8C5C42" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#5A3A2B" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="skinGrad" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#FFF2E8" />
          <stop offset="55%" stopColor="#F8DAC8" />
          <stop offset="100%" stopColor="#ECC6B0" />
        </linearGradient>

        <linearGradient id="sweaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E29A6C" />
          <stop offset="45%" stopColor="#CD8554" />
          <stop offset="100%" stopColor="#A86237" />
        </linearGradient>

        <linearGradient id="sweaterHighlight" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#F0B892" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#CD8554" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="tableWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E5D5" />
          <stop offset="50%" stopColor="#E6D0BC" />
          <stop offset="100%" stopColor="#D5B79F" />
        </linearGradient>

        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFEBB8" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#FFD899" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFD899" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="cushionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC785D" />
          <stop offset="60%" stopColor="#C55B40" />
          <stop offset="100%" stopColor="#A03F26" />
        </linearGradient>

        <radialGradient id="softBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E98D74" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#E98D74" stopOpacity="0" />
        </radialGradient>

        <filter id="softGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="painterlyBlur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#5C3A2E" floodOpacity="0.12" />
        </filter>
      </defs>

      {
  /* --- BACKGROUND ARCHED CAFE WINDOW WITH WARM LIGHT --- */
}
      <g>
        {
  /* Soft Window Outer Frame */
}
        <path d="M130 395 C130 110, 175 40, 280 40 C385 40, 430 110, 430 395 Z" fill="url(#windowBgGrad)" />
        
        {
  /* Window Glass Ambient Glow */
}
        <path d="M135 390 C135 115, 178 48, 280 48 C382 48, 425 115, 425 390 Z" fill="url(#sunbeamGrad)" opacity="0.85" />

        {
  /* Soft Outdoor Foliage Silhouettes in Background */
}
        <path d="M360 210 C385 170, 415 185, 405 230 C395 260, 370 240, 360 210 Z" fill="#DFC9B5" opacity="0.5" filter="url(#painterlyBlur)" />
        <path d="M150 230 C135 190, 165 175, 175 220 C180 250, 160 260, 150 230 Z" fill="#E2CCB8" opacity="0.45" filter="url(#painterlyBlur)" />

        {
  /* Soft Window Frame Dividers */
}
        <path d="M280 40 L280 395" stroke="#E5CEB9" strokeWidth="2" strokeDasharray="8 6" opacity="0.75" />
        <path d="M133 215 Q280 205 427 215" stroke="#E5CEB9" strokeWidth="2" opacity="0.65" />

        {
  /* Hanging Warm Pendant Lamp */
}
        <path d="M280 40 L280 95" stroke="#8C6D58" strokeWidth="1.5" />
        <path d="M268 95 C268 88, 292 88, 292 95 L298 108 C298 112, 262 112, 262 108 Z" fill="#D4A373" />
        {
  /* Lamp Bulb Glow */
}
        <circle cx="280" cy="112" r="6" fill="#FFF2D6" />
        <circle cx="280" cy="112" r="28" fill="url(#lampGlow)" />
      </g>

      {
  /* --- COZY WOODEN TABLE SURFACE WITH PAINTERLY GRAIN & SHADOWS --- */
}
      <g>
        {
  /* Table Cast Shadow */
}
        <ellipse cx="275" cy="405" rx="195" ry="18" fill="#4A3225" opacity="0.08" filter="url(#painterlyBlur)" />
        
        {
  /* Main Oval Tabletop */
}
        <ellipse cx="275" cy="392" rx="192" ry="26" fill="url(#tableWoodGrad)" />
        
        {
  /* Soft Wood Grain Lines */
}
        <path d="M110 392 Q275 382 440 392" stroke="#B89B82" strokeWidth="1" opacity="0.4" />
        <path d="M140 396 Q275 387 410 396" stroke="#D1B8A3" strokeWidth="1.2" opacity="0.55" />
      </g>

      {
  /* --- YOUNG WOMAN DIGITAL STORYBOOK CHARACTER --- */
}
      <g>
        {
  /* Body Shadow on Table */
}
        <ellipse cx="275" cy="390" rx="95" ry="14" fill="#3D261A" opacity="0.15" filter="url(#painterlyBlur)" />

        {
  /* Back Layer Hair (Voluminous, soft painterly curves) */
}
        <path d="M190 220 C175 125, 225 82, 278 82 C330 82, 380 125, 360 245 C348 290, 342 340, 340 385 L210 385 C210 340, 202 280, 190 220 Z" fill="url(#hairGrad)" />

        {
  /* Hair Shading & Soft Texture Lines */
}
        <path d="M210 130 C200 180, 205 250, 215 320" stroke="#21120B" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
        <path d="M345 140 C352 190, 348 260, 338 330" stroke="#21120B" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
        {
  /* Soft Hair Highlights */
}
        <path d="M240 92 C270 86, 300 88, 320 98" stroke="url(#hairHighlight)" strokeWidth="10" strokeLinecap="round" />

        {
  /* Neck & Shoulder Base */
}
        <path d="M258 220 C258 245, 292 245, 292 220 Z" fill="#E8C3AC" />
        <path d="M258 228 C268 238, 282 238, 292 228" stroke="#D4A185" strokeWidth="1.8" opacity="0.5" />

        {
  /* Face Contour */
}
        <path d="M242 152 C242 128, 308 128, 308 152 C308 195, 294 216, 275 222 C256 216, 242 195, 242 152 Z" fill="url(#skinGrad)" />

        {
  /* Soft Rosy Cheeks */
}
        <circle cx="254" cy="176" r="13" fill="url(#softBlush)" />
        <circle cx="296" cy="176" r="13" fill="url(#softBlush)" />

        {
  /* Gentle Eyes (Peacefully closed in reflection) */
}
        <path d="M252 165 C257 171, 265 171, 270 165" stroke="#4A2F23" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M280 165 C285 171, 293 171, 298 165" stroke="#4A2F23" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {
  /* Delicate Eyelashes */
}
        <path d="M250 164 L247 161" stroke="#4A2F23" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M300 164 L303 161" stroke="#4A2F23" strokeWidth="1.5" strokeLinecap="round" />

        {
  /* Soft Nose Bridge Highlight & Contour */
}
        <path d="M275 160 C273 170, 272 176, 276 178" stroke="#DCA285" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />

        {
  /* Soft Watercolor Lip Tint */
}
        <path d="M267 190 C271 194, 279 194, 283 190" stroke="#C86750" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse cx="275" cy="192" rx="4" ry="1.8" fill="#E2816B" opacity="0.7" />

        {
  /* Front Hair Framing Strands & Soft Bangs */
}
        <path d="M238 145 C255 152, 270 144, 275 140 C280 144, 295 152, 312 145 C302 122, 248 122, 238 145 Z" fill="url(#hairGrad)" />
        <path d="M222 170 C216 220, 225 285, 238 335 L218 342 C206 290, 202 220, 208 170 Z" fill="url(#hairGrad)" />
        <path d="M328 170 C334 220, 325 285, 312 335 L332 342 C344 290, 348 220, 342 170 Z" fill="url(#hairGrad)" />

        {
  /* Cozy Chunky Knit Caramel Turtleneck Sweater */
}
        <path d="M175 385 C175 272, 210 240, 275 240 C340 240, 375 272, 375 385 Z" fill="url(#sweaterGrad)" />
        
        {
  /* Sweater Ribbed Turtleneck Collar */
}
        <path d="M246 240 C246 268, 304 268, 304 240 Z" fill="#DC9566" />
        {
  /* Collar Ribbing Detail */
}
        <path d="M256 244 L256 262" stroke="#B87346" strokeWidth="1.5" />
        <path d="M266 246 L266 265" stroke="#B87346" strokeWidth="1.5" />
        <path d="M275 247 L275 266" stroke="#B87346" strokeWidth="1.5" />
        <path d="M284 246 L284 265" stroke="#B87346" strokeWidth="1.5" />
        <path d="M294 244 L294 262" stroke="#B87346" strokeWidth="1.5" />

        {
  /* Sweater Soft Fabric Folds & Shading */
}
        <path d="M205 320 C225 300, 245 310, 260 330" stroke="#8A4A23" strokeWidth="2" opacity="0.45" strokeLinecap="round" fill="none" />
        <path d="M345 320 C325 300, 305 310, 290 330" stroke="#8A4A23" strokeWidth="2" opacity="0.45" strokeLinecap="round" fill="none" />
        <path d="M230 260 C250 250, 300 250, 320 260" stroke="url(#sweaterHighlight)" strokeWidth="6" strokeLinecap="round" />

        {
  /* Hands Cupping Handmade Ceramic Tea Mug */
}
        {
  /* Soft Skin Hands */
}
        <path d="M245 308 C240 300, 250 288, 258 296 C262 302, 258 312, 248 312 Z" fill="#F0C8B2" />
        <path d="M305 308 C310 300, 300 288, 292 296 C288 302, 292 312, 302 312 Z" fill="#F0C8B2" />

        {
  /* Ceramic Mug */
}
        <ellipse cx="275" cy="302" rx="28" ry="19" fill="#FFFDF8" filter="url(#softShadow)" />
        <ellipse cx="275" cy="302" rx="22" ry="13" fill="#8B572A" />
        {
  /* Warm Golden Tea Liquid Surface & Rim Light */
}
        <ellipse cx="275" cy="302" rx="16" ry="9" fill="#B27438" opacity="0.85" />
        <ellipse cx="273" cy="300" rx="6" ry="3" fill="#FFE0B2" opacity="0.6" />

        {
  /* Gentle Steam Rising with Warm Sparkles */
}
        <g>
          <path d="M275 278 C268 258, 282 246, 275 228" stroke="#E0A37A" strokeWidth="2.2" strokeLinecap="round" opacity="0.65" fill="none">
            <animate attributeName="d" values="M275 278 C268 258, 282 246, 275 228; M275 278 C282 258, 268 246, 275 228; M275 278 C268 258, 282 246, 275 228" dur="4s" repeatCount="indefinite" />
          </path>
          <path d="M282 274 C288 258, 278 244, 284 232" stroke="#F5C4A3" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" fill="none">
            <animate attributeName="d" values="M282 274 C288 258, 278 244, 284 232; M282 274 C276 258, 286 244, 284 232; M282 274 C288 258, 278 244, 284 232" dur="3.5s" repeatCount="indefinite" />
          </path>
        </g>
      </g>

      {
  /* --- BLOOMBOT THE CREAM CAT ON CUSHION --- */
}
      <g transform="translate(325, 270)">
        {
  /* Cushion Shadow */
}
        <ellipse cx="45" cy="98" rx="42" ry="12" fill="#3D261A" opacity="0.15" filter="url(#painterlyBlur)" />

        {
  /* Quilted Terracotta Cushion with Tassels */
}
        <ellipse cx="45" cy="92" rx="42" ry="18" fill="url(#cushionGrad)" />
        {
  /* Cushion Button & Tufting Folds */
}
        <circle cx="45" cy="92" r="3" fill="#6B2110" />
        <path d="M25 92 Q45 88 65 92" stroke="#872E18" strokeWidth="1" opacity="0.5" />
        <path d="M45 78 Q45 92 45 104" stroke="#872E18" strokeWidth="1" opacity="0.5" />
        {
  /* Corner Tassels */
}
        <circle cx="5" cy="92" r="3" fill="#D4A373" />
        <circle cx="85" cy="92" r="3" fill="#D4A373" />

        {
  /* Cat Shadow on Cushion */
}
        <ellipse cx="42" cy="74" rx="28" ry="8" fill="#522415" opacity="0.18" />

        {
  /* Cat Body (Curled up asleep) */
}
        <ellipse cx="45" cy="58" rx="28" ry="20" fill="#FFF2E5" />
        {
  /* Cat Soft Back Shading */
}
        <path d="M25 58 C25 45, 60 42, 68 58 Z" fill="#FCEADB" opacity="0.9" />

        {
  /* Cat Tail Curled Around Body */
}
        <path d="M 68 62 Q 82 55 78 72 Q 72 82 60 78" stroke="#C8A68C" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {
  /* Cat Head */
}
        <circle cx="26" cy="46" r="18" fill="#FFF2E5" />

        {
  /* Ears */
}
        <path d="M 12 34 L 20 22 L 28 34 Z" fill="#FFF2E5" />
        <path d="M 15 33 L 20 25 L 25 33 Z" fill="#F7D4C8" />
        <path d="M 26 34 L 34 22 L 40 34 Z" fill="#FFF2E5" />
        <path d="M 28 33 L 33 25 L 38 33 Z" fill="#F7D4C8" />

        {
  /* Sleeping Eyes ^ ^ */
}
        <path d="M 16 46 Q 21 41 26 46" stroke="#6C4A3C" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M 28 46 Q 33 41 38 46" stroke="#6C4A3C" strokeWidth="1.8" strokeLinecap="round" fill="none" />

        {
  /* Cute Nose & Smile */
}
        <path d="M 26 49 L 28 49 L 27 51 Z" fill="#E29578" />

        {
  /* Rosy Cheeks */
}
        <circle cx="14" cy="49" r="3" fill="#E88A72" opacity="0.45" />
        <circle cx="38" cy="49" r="3" fill="#E88A72" opacity="0.45" />

        {
  /* Blossom Flower Behind Ear */
}
        <circle cx="36" cy="24" r="3.5" fill="#E2816B" />
        <circle cx="36" cy="24" r="1.5" fill="#FFF2D6" />
      </g>

      {
  /* --- OPEN JOURNAL & PEN ON TABLE --- */
}
      <g transform="translate(222, 335)">
        {
  /* Journal Shadow */
}
        <rect x="2" y="4" width="76" height="42" rx="4" fill="#3D261A" opacity="0.12" transform="rotate(-7)" />
        
        {
  /* Cover */
}
        <rect x="0" y="0" width="76" height="42" rx="4" fill="#A85B38" transform="rotate(-7)" />
        
        {
  /* Inner Pages */
}
        <rect x="3" y="3" width="70" height="36" rx="3" fill="#FFFDF8" transform="rotate(-7)" />
        
        {
  /* Subtle Journal Lines */
}
        <path d="M12 12 L40 12 M12 18 L55 18 M12 24 L50 24 M12 30 L35 30" stroke="#D1C0B0" strokeWidth="1" strokeLinecap="round" transform="rotate(-7)" />

        {
  /* Bookmark Ribbon */
}
        <path d="M26 3 L26 44 L30 39 L34 44 L34 3 Z" fill="#DB8B57" transform="rotate(-7)" />

        {
  /* Pressed Autumn Maple Leaf on Journal Page */
}
        <path d="M52 16 L54 20 L58 18 L55 22 L60 25 L55 27 L54 32 L51 29 L48 31 L49 27 L45 25 L49 22 L46 18 L50 20 Z" fill="#C86A4B" opacity="0.85" transform="rotate(-7)" />

        {
  /* Wooden Pen Beside Journal */
}
        <rect x="74" y="20" width="46" height="4" rx="2" fill="#523223" transform="rotate(16 74 20)" />
        <polygon points="118,21 123,22 118,23" fill="#3B2014" transform="rotate(16 74 20)" />
      </g>

      {
  /* --- POTTED BOTANICAL PLANT ON TABLE --- */
}
      <g transform="translate(125, 248)">
        {
  /* Plant Pot Shadow */
}
        <ellipse cx="28" cy="120" rx="22" ry="6" fill="#3D261A" opacity="0.12" filter="url(#painterlyBlur)" />

        {
  /* Ceramic Pot */
}
        <path d="M 12 82 L 17 116 C 18 120, 38 120, 39 116 L 44 82 Z" fill="#E5C3A6" />
        <rect x="10" y="76" width="36" height="8" rx="2" fill="#FFF8F1" />
        {
  /* Heart Detail on Pot */
}
        <path d="M26 95 C26 92, 23 90, 21 93 C19 90, 16 92, 16 95 C16 100, 21 103, 21 103 C21 103, 26 100, 26 95 Z" fill="#C87355" opacity="0.75" />

        {
  /* Stems & Leaves with Rich Painterly Tones */
}
        <path d="M 28 76 Q 14 45 4 34" stroke="#4A5836" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 28 76 Q 38 40 52 26" stroke="#4A5836" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 28 76 L 28 18" stroke="#4A5836" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {
  /* Organic Shaded Leaves */
}
        <path d="M 4 34 C -4 20, 2 10, 18 20 C 24 28, 10 38, 4 34 Z" fill="#657A4A" />
        <path d="M 7 24 C 11 22, 15 25, 12 30" stroke="#8CA36C" strokeWidth="1" strokeLinecap="round" fill="none" />

        <path d="M 52 26 C 60 12, 64 8, 46 16 C 39 22, 47 32, 52 26 Z" fill="#576B3E" />
        <path d="M 48 18 C 50 16, 54 18, 51 22" stroke="#8CA36C" strokeWidth="1" strokeLinecap="round" fill="none" />

        <path d="M 28 18 C 16 5, 40 5, 28 18 Z" fill="#788F58" />
      </g>
    </svg>
  </div>;
export const MapleTreeBranchCornerRight = ({
  className = "w-48 sm:w-64 md:w-80"
}) => <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="leafGradOrange" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D88A5C" />
        <stop offset="100%" stopColor="#C46E52" />
      </linearGradient>
      <linearGradient id="leafGradAmber" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E29578" />
        <stop offset="100%" stopColor="#D88A5C" />
      </linearGradient>
      <linearGradient id="leafGradGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4A373" />
        <stop offset="100%" stopColor="#C48B52" />
      </linearGradient>
    </defs>

    {
  /* Main Wooden Branch Lines coming from top right corner */
}
    <path d="M 280 0 C 230 18, 180 32, 120 55 C 80 70, 50 95, 20 130" stroke="#5C3A2E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M 210 25 C 160 45, 120 80, 80 120" stroke="#5C3A2E" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M 150 48 C 120 70, 95 98, 65 140" stroke="#5C3A2E" strokeWidth="1.8" strokeLinecap="round" fill="none" />

    {
  /* Compact Maple Leaves staying near branch */
}
    <g transform="translate(15, 115) scale(0.48) rotate(-20)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="url(#leafGradOrange)" stroke="#4A2E24" strokeWidth="1" />
    </g>

    <g transform="translate(55, 80) scale(0.52) rotate(15)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="url(#leafGradAmber)" />
    </g>

    <g transform="translate(100, 45) scale(0.55) rotate(-10)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="url(#leafGradGold)" />
    </g>

    <g transform="translate(145, 20) scale(0.58) rotate(25)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="url(#leafGradOrange)" stroke="#4A2E24" strokeWidth="1" />
    </g>

    <g transform="translate(200, 8) scale(0.52) rotate(-15)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="url(#leafGradAmber)" />
    </g>
  </svg>;
export const MapleTreeBranchCornerLeft = ({
  className = "w-48 sm:w-64 md:w-80"
}) => <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {
  /* Wooden Branch Lines coming from top left corner */
}
    <path d="M 0 0 C 50 18, 100 32, 160 55 C 200 70, 230 95, 260 130" stroke="#5C3A2E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M 70 25 C 120 45, 160 80, 200 120" stroke="#5C3A2E" strokeWidth="2.2" strokeLinecap="round" fill="none" />

    {
  /* Compact Maple Leaves */
}
    <g transform="translate(225, 115) scale(0.48) rotate(20)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="#D88A5C" />
    </g>
    <g transform="translate(170, 80) scale(0.52) rotate(-15)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="#E29578" />
    </g>
    <g transform="translate(110, 45) scale(0.55) rotate(10)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="#D4A373" />
    </g>
    <g transform="translate(50, 15) scale(0.52) rotate(-10)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="#D88A5C" />
    </g>
  </svg>;
export const MapleBranchBottomLeft = ({
  className = "w-48 sm:w-64"
}) => <svg viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {
  /* Wooden Branch Line rising from bottom left */
}
    <path d="M 0 220 C 40 180, 80 130, 140 80 C 180 50, 210 30, 240 10" stroke="#5C3A2E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M 60 150 C 100 110, 130 90, 170 60" stroke="#5C3A2E" strokeWidth="2.2" strokeLinecap="round" fill="none" />

    {
  /* Leaves */
}
    <g transform="translate(200, 15) scale(0.65) rotate(-25)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="#D88A5C" />
      <path d="M40 60 L40 80" stroke="#5C3A2E" strokeWidth="2" strokeLinecap="round" />
    </g>
    <g transform="translate(130, 65) scale(0.6) rotate(15)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="#E29578" />
      <path d="M40 60 L40 80" stroke="#5C3A2E" strokeWidth="2" strokeLinecap="round" />
    </g>
    <g transform="translate(150, 40) scale(0.55) rotate(-35)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="#D4A373" />
    </g>
    <g transform="translate(50, 130) scale(0.65) rotate(-10)">
      <path d="M40 5 L45 20 L58 12 L52 25 L66 22 L58 35 L72 40 L60 50 L66 62 L52 56 L48 70 L40 60 L32 70 L28 56 L14 62 L20 50 L8 40 L22 35 L14 22 L28 25 L22 12 L35 20 Z" fill="#D88A5C" />
    </g>
  </svg>;

export const BloomBotWritingIllustration = ({ className = "w-36 h-36" }) => (
  <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Desk / Shadow Base */}
    <ellipse cx="100" cy="158" rx="85" ry="14" fill="#EAD8C7" opacity="0.6" />
    <ellipse cx="100" cy="156" rx="70" ry="10" fill="#FAF0E6" opacity="0.8" />

    {/* Open Journal / Notebook on desk */}
    <g transform="translate(18, 105)">
      {/* Journal Cover */}
      <rect x="0" y="0" width="85" height="52" rx="4" fill="#8B5E3C" stroke="#5C3D2E" strokeWidth="2" />
      {/* Journal Left Page */}
      <path d="M 4 3 L 40 5 L 40 48 L 4 46 Z" fill="#FFFBF7" stroke="#E6DCCD" strokeWidth="1" />
      {/* Journal Right Page */}
      <path d="M 42 5 L 81 3 L 81 46 L 42 48 Z" fill="#FAF6F0" stroke="#E6DCCD" strokeWidth="1" />
      {/* Journal Spine */}
      <line x1="41" y1="4" x2="41" y2="48" stroke="#D4A373" strokeWidth="2.5" />
      {/* Page Lines */}
      <line x1="10" y1="14" x2="34" y2="15" stroke="#D8C8B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="22" x2="34" y2="23" stroke="#D8C8B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="30" x2="30" y2="31" stroke="#D8C8B8" strokeWidth="1.5" strokeLinecap="round" />

      <line x1="48" y1="15" x2="72" y2="14" stroke="#D8C8B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="23" x2="72" y2="22" stroke="#D8C8B8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="48" y1="31" x2="68" y2="30" stroke="#D8C8B8" strokeWidth="1.5" strokeLinecap="round" />

      {/* Ribbon Bookmark */}
      <path d="M 41 48 Q 45 56 40 62" stroke="#E07A5F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Little leaf on page */}
      <circle cx="28" cy="38" r="2.5" fill="#889868" />
    </g>

    {/* BloomBot Cat Body (Sitting gracefully beside notebook) */}
    <g transform="translate(60, 10)">
      {/* Tail curling */}
      <path d="M 82 120 Q 102 118 98 102 Q 94 90 86 98" stroke="#8B5E3C" strokeWidth="4.5" strokeLinecap="round" fill="none" />

      {/* Body */}
      <path d="M 38 128 C 26 128, 22 92, 34 72 C 44 58, 72 58, 82 72 C 92 92, 88 128, 76 128 Z" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="3" />

      {/* Paws */}
      <ellipse cx="44" cy="128" rx="9" ry="5.5" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="2.5" />
      <ellipse cx="70" cy="128" rx="9" ry="5.5" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="2.5" />

      {/* Cat Head */}
      <circle cx="58" cy="52" r="26" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="3" />

      {/* Ears */}
      <path d="M 38 34 L 27 16 L 48 27 Z" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="2.5" />
      <path d="M 38 32 L 31 20 L 44 27 Z" fill="#FFB7B2" opacity="0.75" />

      <path d="M 78 34 L 89 16 L 68 27 Z" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="2.5" />
      <path d="M 78 32 L 85 20 L 72 27 Z" fill="#FFB7B2" opacity="0.75" />

      {/* Flower on Ear */}
      <circle cx="82" cy="28" r="5" fill="#E07A5F" />
      <circle cx="82" cy="28" r="2" fill="#FFF5EC" />

      {/* Collar */}
      <path d="M 42 70 C 52 75, 64 75, 74 70" stroke="#E07A5F" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="58" cy="74" r="3.5" fill="#E29578" />

      {/* Smiling Eyes ^ ^ with warm gentle look */}
      <path d="M 44 52 Q 50 45 56 52" stroke="#5C3A2E" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M 60 52 Q 66 45 72 52" stroke="#5C3A2E" strokeWidth="2.8" strokeLinecap="round" fill="none" />

      {/* Tiny Nose & Gentle Smiling Mouth */}
      <path d="M 58 56 L 56 58 L 60 58 Z" fill="#C46E52" />
      <path d="M 54 60 Q 58 64 62 60" stroke="#5C3A2E" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Blush Cheeks */}
      <circle cx="42" cy="57" r="4.5" fill="#FFB7B2" opacity="0.75" />
      <circle cx="74" cy="57" r="4.5" fill="#FFB7B2" opacity="0.75" />

      {/* Whiskers */}
      <path d="M 34 53 L 22 51" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 34 57 L 22 58" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 82 53 L 94 51" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 82 57 L 94 58" stroke="#8B5E3C" strokeWidth="1.5" strokeLinecap="round" />

      {/* Paw Holding Pen / Quill pointing toward journal */}
      <g transform="translate(10, 92) rotate(-35)">
        <rect x="0" y="0" width="30" height="4" rx="1.5" fill="#5C3D2E" />
        <path d="M -5 2 L 0 0 L 0 4 Z" fill="#E07A5F" />
        <path d="M 28 2 C 34 -4, 40 2, 38 8 Q 30 6 28 2 Z" fill="#EAD8C7" stroke="#8B5E3C" strokeWidth="1" />
      </g>
    </g>

    {/* Floating Sparkles */}
    <path d="M 25 30 L 27 34 L 31 36 L 27 38 L 25 42 L 23 38 L 19 36 L 23 34 Z" fill="#E07A5F" opacity="0.8" />
    <path d="M 175 45 L 176.5 48 L 179.5 49.5 L 176.5 51 L 175 54 L 173.5 51 L 170.5 49.5 L 173.5 48 Z" fill="#D4A373" opacity="0.8" />
  </svg>
);

/* Storyteller Mascot - Dedicated exclusively for Stories of Hope & Bloom Stories */
export const StorytellerCatIllustration = ({ className = "w-36 h-36" }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Pastel Background Aura */}
    <circle cx="100" cy="110" r="75" fill="#FAF0E6" opacity="0.7" />

    {/* Floating Hearts and Sparkles */}
    <path d="M 32 46 C 32 40, 40 38, 43 43 C 46 38, 54 40, 54 46 C 54 54, 43 60, 43 62 C 43 60, 32 54, 32 46 Z" fill="#E07A5F" opacity="0.85" />
    <path d="M 152 48 C 152 43, 159 41, 162 46 C 165 41, 172 43, 172 48 C 172 55, 162 61, 162 63 C 162 61, 152 55, 152 48 Z" fill="#E8A598" opacity="0.8" />
    
    {/* Sparkles */}
    <path d="M 28 92 L 31 96 L 35 98 L 31 100 L 28 104 L 25 100 L 21 98 L 25 96 Z" fill="#F4A261" opacity="0.9" />
    <path d="M 172 102 L 174.5 106 L 179 108 L 174.5 110 L 172 114 L 169.5 110 L 165 108 L 169.5 106 Z" fill="#E07A5F" opacity="0.85" />
    <path d="M 100 14 L 102 18 L 106 20 L 102 22 L 100 26 L 98 22 L 94 20 L 98 18 Z" fill="#E29578" opacity="0.9" />

    {/* Curled Tail */}
    <path d="M 142 155 Q 178 148 174 122 Q 170 102 154 114" stroke="#8B5E3C" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M 142 155 Q 178 148 174 122 Q 170 102 154 114" stroke="#FFE8D6" strokeWidth="3" strokeLinecap="round" fill="none" />

    {/* Cat Body (Sitting comfortably) */}
    <path d="M 62 175 C 48 175, 42 125, 58 100 C 72 82, 128 82, 142 100 C 158 125, 152 175, 138 175 Z" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="3.5" />
    <path d="M 78 175 C 72 145, 128 145, 122 175 Z" fill="#FFF5EC" />

    {/* Sitting Paw Bases */}
    <ellipse cx="72" cy="173" rx="11" ry="6" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="2.5" />
    <ellipse cx="128" cy="173" rx="11" ry="6" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="2.5" />

    {/* Left Arm holding Handwritten Journal / Letter */}
    <g transform="translate(38, 114) rotate(-10)">
      {/* Journal Page */}
      <rect x="0" y="0" width="40" height="50" rx="5" fill="#FAF3EA" stroke="#8B5E3C" strokeWidth="2.2" />
      {/* Written Lines & Heart */}
      <line x1="8" y1="12" x2="32" y2="12" stroke="#B09E91" strokeWidth="1.8" strokeDasharray="3 2" />
      <line x1="8" y1="20" x2="32" y2="20" stroke="#B09E91" strokeWidth="1.8" strokeDasharray="3 2" />
      <line x1="8" y1="28" x2="24" y2="28" stroke="#B09E91" strokeWidth="1.8" strokeDasharray="3 2" />
      <path d="M 22 36 C 22 34, 25 33, 26.5 35 C 28 33, 31 34, 31 36 C 31 39, 26.5 42, 26.5 43 C 26.5 42, 22 39, 22 36 Z" fill="#E07A5F" />
    </g>
    {/* Left Paw */}
    <ellipse cx="62" cy="138" rx="8" ry="6" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="2.5" transform="rotate(-10 62 138)" />

    {/* Right Arm holding Fountain Pen */}
    <g transform="translate(136, 108) rotate(-42)">
      {/* Pen Barrel */}
      <rect x="0" y="0" width="36" height="6" rx="3" fill="#5C3D2E" stroke="#3B281C" strokeWidth="1.5" />
      {/* Gold Nib */}
      <path d="M -8 3 L 0 0 L 0 6 Z" fill="#D4A373" stroke="#8B5E3C" strokeWidth="1" />
      {/* Nib Ink Tip */}
      <path d="M -8 3 L -5 1.8 L -5 4.2 Z" fill="#3B281C" />
      {/* Terracotta Band Accent */}
      <rect x="22" y="0" width="8" height="6" fill="#E07A5F" />
    </g>
    {/* Right Paw */}
    <ellipse cx="130" cy="128" rx="8" ry="6" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="2.5" transform="rotate(-42 130 128)" />

    {/* Cat Head */}
    <circle cx="100" cy="72" r="34" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="3.5" />

    {/* Ears */}
    <path d="M 72 48 L 56 22 L 84 38 Z" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="3" />
    <path d="M 72 45 L 62 28 L 80 38 Z" fill="#FFB7B2" opacity="0.75" />

    <path d="M 128 48 L 144 22 L 116 38 Z" fill="#FFE8D6" stroke="#8B5E3C" strokeWidth="3" />
    <path d="M 128 45 L 138 28 L 120 38 Z" fill="#FFB7B2" opacity="0.75" />

    {/* Writer's Beret (Cozy Terracotta tilted beret with stem) */}
    <g transform="rotate(-8 96 36)">
      <ellipse cx="96" cy="36" rx="34" ry="14" fill="#E07A5F" stroke="#8B5E3C" strokeWidth="3" />
      <path d="M 66 40 C 80 45, 112 43, 124 36" stroke="#B8543B" strokeWidth="3" strokeLinecap="round" />
      <path d="M 96 22 C 96 17, 100 15, 98 10" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>

    {/* Happy Closed Eyes (^ ^ shape) */}
    <path d="M 80 72 Q 87 62 94 72" stroke="#5C3A2E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    <path d="M 106 72 Q 113 62 120 72" stroke="#5C3A2E" strokeWidth="3.2" strokeLinecap="round" fill="none" />

    {/* Soft Rosy Cheeks */}
    <ellipse cx="76" cy="78" rx="6.5" ry="4.5" fill="#FFB7B2" opacity="0.8" />
    <ellipse cx="124" cy="78" rx="6.5" ry="4.5" fill="#FFB7B2" opacity="0.8" />

    {/* Nose & Gentle W-Smile */}
    <path d="M 100 76 L 97 79 L 103 79 Z" fill="#C46E52" />
    <path d="M 93 82 Q 100 88 100 82 Q 100 88 107 82" stroke="#5C3A2E" strokeWidth="2.5" strokeLinecap="round" fill="none" />

    {/* Whiskers */}
    <line x1="68" y1="74" x2="52" y2="71" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="68" y1="79" x2="52" y2="80" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="132" y1="74" x2="148" y2="71" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="132" y1="79" x2="148" y2="80" stroke="#8B5E3C" strokeWidth="1.8" strokeLinecap="round" />

    {/* Collar Ribbon Accent */}
    <path d="M 78 98 C 90 105, 110 105, 122 98" stroke="#E07A5F" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="100" cy="103" r="3.5" fill="#D4A373" />
  </svg>
);

