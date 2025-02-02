import { getProducts } from 'app/actions';
import { ProductsContent } from 'components/views/sections/ProductsContent';


export default async function ProductsPage() {
  const products = await getProducts('EG');

  const totalPages = Math.ceil(products.length / 9); // Maximum items per page

  return (
    <ProductsContent
      products={products}
      totalPages={totalPages}
    />
  );
}