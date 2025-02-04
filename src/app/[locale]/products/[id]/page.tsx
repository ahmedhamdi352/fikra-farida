import { notFound } from 'next/navigation';
import { getProducts } from '../../../actions';
import { ProductDetails } from './ProductDetails';

interface ProductDetailsPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: ProductDetailsPageProps) {
  const resolvedParams = await params;
  const products = await getProducts();
  const product = products?.find(p => p.id === resolvedParams.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
      id: product.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {

  const resolvedParams = await params;
  const products = await getProducts();
  try {
    if (!Array.isArray(products) || products.length === 0) {
      console.error('No products returned from API');
      notFound();
    }

    return <ProductDetails products={products} id={resolvedParams.id} params={resolvedParams} />;
  } catch (error) {
    console.error('Error loading products:', error);
    throw error;
  }
}
