export default function HeroVideo() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0 bg-stone-900/40 z-10" />
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="relative z-20 flex items-center justify-center h-full text-white">
        <h1 className="text-6xl font-serif">L'élégance naturelle</h1>
      </div>
    </section>
  );
}