import data from "../../data/products.generated.json";

type Product = {
  name: string;
};

export default function ProductNamesPage() {
  const products = (data as { productsSection: { items: Product[] } }).productsSection.items;

  return (
    <main style={{ padding: "20px" }}>
      <h1>Məhsul adları</h1>

      <ul>
        {products.map((product, index) => (
          <li key={index}>
            {product.name}
          </li>
        ))}
      </ul>
    </main>
  );
}
