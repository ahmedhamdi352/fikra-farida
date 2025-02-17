import { getProducts } from 'app/actions';
import { ProductSlider } from '../ProductSlider';
import { Product } from 'types';
import ProductsHeader from './ProductsHeader';
import { Button } from 'components/ui';

export async function ProductsSection() {
  let products: Product[] = [];
  try {
    products = await getProducts('EG');
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return empty array to show no products state
    products = [];
  }

  return (
    <section className="py-12" id='product-section'>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <ProductsHeader />
        <ProductSlider products={products} />
        <div className="mt-16">
          <Button
            href="/products"
            withArrow
            className="relative group px-8 py-3 text-white rounded-[10px] bg-transparent border-2 border-transparent hover:opacity-100 transition-colors"
            translationKey="products.allProducts"
            translationNamespace="home"
          />
        </div>
      </div>
    </section>
  );
}
