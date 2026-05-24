interface Props { name: string; material: string; price: number; imagePlaceholder: string; }

export default function ProductCard({ name, material, price, imagePlaceholder }: Props) {
  return (
    <div className="group p-4">
      <div className="aspect-square bg-stone-200 mb-4 rounded-xl flex items-center justify-center">
        {imagePlaceholder}
      </div>
      <h3 className="text-lg font-medium">{name}</h3>
      <p className="text-stone-500 text-sm">{material}</p>
      <p className="font-bold mt-2">{price.toFixed(2)} €</p>
    </div>
  );
}