'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { fetchPlasticChairs, fetchCafeteriaChairs, fetchCafeChairs, fetchMeshBack, fetchCafeteriaTables, fetchLoungeChairs } from '@/lib/api';
import { Product } from '@/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, Check } from 'lucide-react';
import Image from 'next/image';
import { HeroSlider } from '@/components/HeroSlider';

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
      // For homepage featured products, show only Cafeteria Chairs
      const cafeteria = await fetchCafeteriaChairs();
      setTrendingProducts(cafeteria.slice(0, 8));
    }
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ backgroundColor: '#ffffff' }}>
      {/* Hero Section with Slider */}
      <HeroSlider />

      {/* Featured Main Categories - Highlighted */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Our Featured Categories
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
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
                      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-teal-500">
                        <div className="relative h-48 md:h-64 w-full overflow-hidden bg-gradient-to-br from-teal-50 to-teal-100">
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full shadow-lg">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="px-6 md:px-8 pt-4 md:pt-5 pb-6 md:pb-6">
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 mb-4 text-base md:text-lg">
                            {category.description}
                          </p>
                          <div className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform">
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
      <section className="py-20 bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-gray-900  mb-4"
            >
              Office Chair Parts
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Explore our comprehensive range of office chair parts and components
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {productCategories.map((category, index) => {
              // Hide items beyond 4 on mobile
              const isHiddenOnMobile = index >= 4;
              // Use URL from category if available, otherwise use href
              const categoryUrl = (category as any).url || (category as any).URL || category.href;
              const isExternalUrl = categoryUrl.startsWith('http://') || categoryUrl.startsWith('https://');
              
              const categoryContent = (
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                  <div className="relative h-32 md:h-40 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
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
                  className={`group ${isHiddenOnMobile ? 'hidden md:block' : ''}`}
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

      {/* RJPI as Exhibitors in Expo */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto mb-6 text-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
              >
                RJPI as Exhibitors in Expo
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-600"
              >
                Watch highlights from RJPI's participation in leading furniture and manufacturing expos.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative w-full h-72 md:h-[22rem] overflow-hidden rounded-2xl shadow-xl bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/VIDEO_ID_HERE"
                title="RJPI as Exhibitors in Expo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex justify-center"
          >
            <Link
              href="/expo"
              className="inline-flex items-center px-5 py-2 rounded-full border border-teal-600 text-teal-600 font-semibold hover:bg-teal-600 hover:text-white transition-colors"
            >
              View All Expo Videos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                  className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <Check className="w-5 h-5 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">
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
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Featured Products
                </h2>
                <p className="text-lg text-gray-600">
                  Our most popular items
                </p>
              </div>
              <Link
                href="/products"
                className="hidden md:flex items-center text-gray-900 font-semibold hover:underline"
              >
                View All
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product, index) => (
                <div key={product.id} className={index >= 4 ? 'hidden md:block' : ''}>
                  <ProductCard product={product} index={index} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Download Section */}
      <section className="pt-16 pb-24 bg-white ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-gray-900  mb-4"
            >
              Download Our Catalogs
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600"
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
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/images/catalogs/partscatalog25.pdf';
                  link.download = 'partscatalog25.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="cursor-pointer group flex flex-col sm:flex-row sm:items-start"
              >
                <div className="relative w-full h-40 sm:h-auto sm:w-32 sm:flex-shrink-0 bg-gray-100 overflow-hidden sm:mt-6 sm:aspect-square">
                  <Image
                    src="/images/catalogs/partscatalog25.jpg"
                    alt="Chair Parts Catalog"
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="128px"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <Download className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>
                </div>
                <div className="px-6 pt-6 pb-6 flex-1 sm:pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Chair Parts Catalog
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm">
                    Complete catalog of all office chair parts and components
                  </p>
                  <div className="flex items-center text-teal-600 font-medium text-sm mb-6">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/images/catalogs/cafecatalog25.pdf';
                  link.download = 'cafecatalog25.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="cursor-pointer group flex flex-col sm:flex-row sm:items-start"
              >
                <div className="relative w-full h-40 sm:h-auto sm:w-32 sm:flex-shrink-0 bg-gray-100 overflow-hidden sm:mt-6 sm:aspect-square">
                  <Image
                    src="/images/catalogs/cafecatalog25.jpg"
                    alt="Cafe Chair Catalog"
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                    sizes="128px"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <Download className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>
                </div>
                <div className="px-6 pt-6 pb-6 flex-1 sm:pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Cafe Chair Catalog
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm">
                    Explore our full range of cafeteria and dining chairs
                  </p>
                  <div className="flex items-center text-teal-600 font-medium text-sm mb-6">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
