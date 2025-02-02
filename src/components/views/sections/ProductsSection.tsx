import { getProducts } from 'app/actions';
import { ProductSlider } from './ProductSlider';
import { Button } from 'components';

export async function ProductsSection() {
  const products = await getProducts();

  return (
    <section className="py-12" id='product-section'>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <h2 className="text-h2 font-bold text-center mb-12">
          Make Yourself <span className="text-yellow-500">Special</span> With
          <h1 className="font-bold text-h1"> our Products. </h1>
        </h2>
        <ProductSlider products={products} />

        <div className="mt-16">
          <Button
            href="/products"
            withArrow
            className="relative group px-8 py-3 text-white rounded-[10px] bg-transparent border-2 border-transparent hover:opacity-100 transition-colors"
          >
            All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
