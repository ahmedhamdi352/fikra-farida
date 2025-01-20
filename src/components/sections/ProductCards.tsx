'use client'

// import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function ProductCards() {
  const t = useTranslations('home')
  // const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const products = [
    {
      image: '/images/products/smart-lock.png',
      title: 'Smart Lock',
      price: '100 KD'
    },
    {
      image: '/images/products/fawry.png',
      title: 'Fawry',
      price: 'Variable'
    },
    {
      image: '/images/products/wallet.png',
      title: 'Digital Wallet',
      price: 'Free'
    }
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t('products.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
            // onMouseEnter={() => setHoveredCard(index)}
            // onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:-translate-y-2">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                  <p className="text-gray-600">{product.price}</p>
                  <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors">
                    {t('products.learnMore')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
