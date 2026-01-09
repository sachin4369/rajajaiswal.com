'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { fetchPlasticChairs, fetchCafeteriaChairs, fetchCafeChairs, fetchMeshBack, fetchCafeteriaTables, fetchLoungeChairs } from '@/lib/api';
import { Product } from '@/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, Check } from 'lucide-react';
import Image from 'next/image';

// Main product categories - highlighted
const mainCategories = [
  {
    id: 'cafe',
    name: 'Cafe Chairs',
    description: 'Modern and elegant cafe seating',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    href: '/products?category=cafe',
    featured: true,
  },
  {
    id: 'mesh',
    name: 'Mesh Back',
    description: 'Ergonomic mesh back chairs',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    href: '/products?category=mesh',
    featured: true,
  },
  {
    id: 'table',
    name: 'Cafeteria Tables',
    description: 'Durable and functional dining tables',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    href: '/products?category=table',
    featured: true,
  },
  {
    id: 'lounge',
    name: 'Lounge Chairs',
    description: 'Comfortable lounge seating solutions',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80',
    href: '/products?category=lounge',
    featured: true,
  },
];

// Sub-categories for office chair parts
const productCategories = [
  {
    id: 'base-wheels',
    name: 'Base & Wheels',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
    href: '/products?category=plastic&filter=base-wheels',
  },
  {
    id: 'armrest',
    name: 'Armrest',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80',
    href: '/products?category=plastic&filter=armrest',
  },
  {
    id: 'shell',
    name: 'Shell',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
    href: '/products?category=plastic&filter=shell',
  },
  {
    id: 'inner-outer',
    name: 'Inner Outer',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80',
    href: '/products?category=plastic&filter=inner-outer',
  },
  {
    id: 'fitting-accessories',
    name: 'Fitting & Accessories',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
    href: '/products?category=plastic&filter=fitting-accessories',
  },
];

const visionFeatures = [
  'High-Quality Design',
  'Reliability',
  'Affordability',
  'Customization',
  'Customer Support',
];

export default function Home() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const [plastic, cafeteria, cafe, mesh, table, lounge] = await Promise.all([
        fetchPlasticChairs(),
        fetchCafeteriaChairs(),
        fetchCafeChairs(),
        fetchMeshBack(),
        fetchCafeteriaTables(),
        fetchLoungeChairs(),
      ]);
      
      const allProducts = [...plastic, ...cafeteria, ...cafe, ...mesh, ...table, ...lounge];
      setTrendingProducts(allProducts.slice(0, 8));
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative w-full h-[450px] md:h-[550px] bg-gradient-to-r from-black via-teal-950 to-black">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80)',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Premium Office Chair Parts & Cafeteria Chairs
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed"
            >
              Quality components for comfortable and durable office furniture. Explore our comprehensive range of products designed for modern workplaces.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-md hover:bg-gray-100 transition-colors"
              >
                Explore Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-gray-900 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Catalog
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Main Categories - Highlighted */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Our Featured Categories
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Discover our premium collection of furniture and seating solutions
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {mainCategories.map((category, index) => {
              // Use URL from category if available, otherwise use href
              const categoryUrl = (category as any).url || (category as any).URL || category.href;
              const isExternalUrl = categoryUrl.startsWith('http://') || categoryUrl.startsWith('https://');
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  {(() => {
                    const categoryContent = (
                      <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-teal-500 dark:hover:border-teal-400">
                        <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-black">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-teal-600 dark:bg-teal-500 text-white text-xs font-bold rounded-full shadow-lg">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="p-6 md:p-8">
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 text-base md:text-lg">
                            {category.description}
                          </p>
                          <div className="flex items-center text-teal-600 dark:text-teal-400 font-semibold group-hover:translate-x-2 transition-transform">
                            Explore Collection
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </div>
                        </div>
                      </div>
                    );
                    
                    return isExternalUrl ? (
                      <a href={categoryUrl} target="_blank" rel="noopener noreferrer">
                        {categoryContent}
                      </a>
                    ) : (
                      <Link href={categoryUrl}>
                        {categoryContent}
                      </Link>
                    );
                  })()}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Office Chair Parts Sub-Categories */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Office Chair Parts
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Explore our comprehensive range of office chair parts and components
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {productCategories.map((category, index) => {
              // Use URL from category if available, otherwise use href
              const categoryUrl = (category as any).url || (category as any).URL || category.href;
              const isExternalUrl = categoryUrl.startsWith('http://') || categoryUrl.startsWith('https://');
              
              const categoryContent = (
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
                  <div className="relative h-32 md:h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>
              );
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  {isExternalUrl ? (
                    <a href={categoryUrl} target="_blank" rel="noopener noreferrer">
                      {categoryContent}
                    </a>
                  ) : (
                    <Link href={categoryUrl}>
                      {categoryContent}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Download Our Catalogs
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-400"
            >
              Get detailed information about our products
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <Link href="/catalog">
                <div className="relative h-56 bg-gray-100 dark:bg-gray-800">
                  <Image
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80"
                    alt="Office Chair Parts Catalog"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Chair Parts Catalog
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Complete catalog of all office chair parts and components
                  </p>
                  <div className="flex items-center text-teal-600 dark:text-teal-400 font-medium text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
            >
              <Link href="/catalog">
                <div className="relative h-56 bg-gray-100 dark:bg-gray-800">
                  <Image
                    src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80"
                    alt="Cafeteria Chairs Catalog"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Cafe Chair Catalog
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Explore our full range of cafeteria and dining chairs
                  </p>
                  <div className="flex items-center text-teal-600 dark:text-teal-400 font-medium text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Committed to providing high-quality, reliable, and affordable office furniture solutions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visionFeatures.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <Check className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {trendingProducts.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Featured Products
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Our most popular items
                </p>
              </div>
              <Link
                href="/products"
                className="hidden md:flex items-center text-gray-900 dark:text-white font-semibold hover:underline"
              >
                View All
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
