export default function ProductFilter() {
  return (
    <div className="flex gap-4 mb-8 justify-center">
      <button className="px-6 py-2 border border-stone-300 rounded-full hover:bg-stone-100">Tous</button>
      <button className="px-6 py-2 border border-stone-300 rounded-full hover:bg-stone-100">Vases</button>
      <button className="px-6 py-2 border border-stone-300 rounded-full hover:bg-stone-100">Luminaires</button>
    </div>
  );
}