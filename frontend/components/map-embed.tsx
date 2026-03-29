export function MapEmbed({
  latitude,
  longitude
}: {
  latitude: number;
  longitude: number;
}) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.01}%2C${longitude + 0.01}%2C${latitude + 0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <iframe
      title="Store map"
      src={src}
      className="h-80 w-full rounded-3xl border border-stone-200"
      loading="lazy"
    />
  );
}

