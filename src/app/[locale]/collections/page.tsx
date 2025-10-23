import { getProducts } from 'app/actions';
import { ProductsContent } from 'components/views/sections/ProductsContent';
import { Product } from 'types';

export default async function ProductsPage() {
  let products: Product[] = [];
  try {
    products = await getProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array to show no products state
    products = [];
  }

  const totalPages = Math.ceil(products.length / 20); // Maximum items per page

  return (
    <ProductsContent
      products={products}
      totalPages={totalPages}
    />
  );
}