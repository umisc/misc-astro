type SponsorGlitchLogoProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const imageClass = 'h-full w-full object-contain';

export default function SponsorGlitchLogo({
  src,
  alt,
  width,
  height,
}: SponsorGlitchLogoProps) {
  return (
    <span className="relative flex h-20 w-full items-center justify-center group-hover:animate-sponsor-glitch motion-reduce:group-hover:animate-none">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        className={`relative z-10 ${imageClass}`}
      />
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        aria-hidden
        loading="lazy"
        className={`pointer-events-none absolute inset-0 opacity-80 [clip-path:polygon(0_0,100%_0,100%_33%,0_33%)] group-hover:animate-sponsor-glitch-top motion-reduce:group-hover:animate-none ${imageClass}`}
      />
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        aria-hidden
        loading="lazy"
        className={`pointer-events-none absolute inset-0 opacity-80 [clip-path:polygon(0_67%,100%_67%,100%_100%,0_100%)] group-hover:animate-sponsor-glitch-bottom motion-reduce:group-hover:animate-none ${imageClass}`}
      />
    </span>
  );
}
