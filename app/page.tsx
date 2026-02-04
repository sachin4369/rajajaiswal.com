'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Download, Check, MapPin, Calendar, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { HeroSlider } from '@/components/HeroSlider';

// Main product categories - highlighted
const mainCategories = [
  {
    id: 'cafe',
    name: 'Cafe Chairs',
    description: 'Modern and elegant cafe seating',
    image: '/images/cafe-chairs.jpg',
    href: '/products/cafeteria-chairs/cafeteria-chairs',
    featured: true,
  },
  {
    id: 'mesh',
    name: 'Mesh Back',
    description: 'Ergonomic mesh back chairs',
    image: '/images/mesh-back-chairs.jpg',
    href: '/products/chair-parts/mesh-back',
    featured: true,
  },
  {
    id: 'table',
    name: 'Cafeteria Tables',
    description: 'Durable and functional dining tables',
    image: '/images/cafeteria-tables.jpg',
    href: '/products/cafeteria-chairs/cafeteria-tables',
    featured: true,
  },
  {
    id: 'lounge',
    name: 'Lounge Chairs',
    description: 'Comfortable lounge seating solutions',
    image: '/images/lounge-chairs.jpg',
    href: '/products/cafeteria-chairs/lounge-chairs',
    featured: true,
  },
];

// Sub-categories for office chair parts
const productCategories = [
  {
    id: 'base-wheels',
    name: 'Base & Wheels',
    image: '/images/base-wheels.png',
    href: '/products/chair-parts/wheels',
  },
  {
    id: 'armrest',
    name: 'Armrest',
    image: '/images/armrest-handle.png',
    href: '/products/chair-parts/adjustable-handle',
  },
  {
    id: 'shell',
    name: 'Shell',
    image: '/images/shells.png',
    href: '/products/chair-parts/chair-plastic-leg',
  },
  {
    id: 'inner-outer',
    name: 'Inner Outer',
    image: '/images/inner-outer.png',
    href: '/products/chair-parts/inner-outer',
  },
  {
    id: 'fitting-accessories',
    name: 'Fitting & Accessories',
    image: '/images/fitting-accessories.png',
    href: '/products/chair-parts/fitting-accessories',
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
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    async function loadProducts() {
      if (!isMounted) return;
      
      try {
        // Dynamically import API function to avoid blocking compilation
        const { fetchCafeteriaChairs } = await import('@/lib/api');
        
        // For homepage featured products, show only Cafeteria Chairs
        const cafeteria = await fetchCafeteriaChairs();
        
        if (isMounted) {
          setTrendingProducts(cafeteria.slice(0, 8));
        }
      } catch (err: any) {
        // Silently handle errors - don't break the page
        console.error('Homepage: Error loading products:', err);
      }
    }
    
    // Load products after a delay to ensure page renders first
    timeoutId = setTimeout(() => {
      if (isMounted) {
        loadProducts();
      }
    }, 1000);
    
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section with Slider */}
      <HeroSlider />

      {/* Featured Main Categories - Highlighted */}
      <section className="py-20 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Featured Categories
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our premium collection of furniture and seating solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {mainCategories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <Link href={category.href}>
                  <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-teal-500">
                    <div className="relative h-48 md:h-64 w-full overflow-hidden bg-linear-to-br from-teal-50 to-teal-100">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
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
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Chair Parts Sub-Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Office Chair Parts
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive range of office chair parts and components
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {productCategories.map((category, index) => {
              const isHiddenOnMobile = index >= 4;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  className={`group ${isHiddenOnMobile ? 'hidden md:block' : ''}`}
                >
                  <Link href={category.href}>
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
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visit Us at IndexPlus Bengaluru - Highlighted Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-block mb-6"
              >
                <Sparkles className="w-16 h-16 text-yellow-300 drop-shadow-lg" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                Visit Us at{' '}
                <span className="text-yellow-300 drop-shadow-lg">IndexPlus</span>
                <br />
                Bengaluru, 6th Feb - 8th Feb 2026
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl md:text-2xl text-teal-50 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Explore & Discover RJPI's Premium Products and Experience Our Presence at IndexPlus
              </motion.p>
            </motion.div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-300 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-teal-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Location</h3>
                    <p className="text-teal-50 text-lg">
                      IndexPlus Bengaluru - Booth No. F-07
                    </p>
                    <p className="text-teal-100 text-sm mt-1">
                      Explore our exhibition booth
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-yellow-300 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-teal-800" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">What to Expect</h3>
                    <p className="text-teal-50 text-lg">
                      Product Showcase & Live Demonstrations
                    </p>
                    <p className="text-teal-100 text-sm mt-1">
                      Experience our quality firsthand
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-yellow-300 text-teal-800 font-bold text-lg rounded-full shadow-2xl hover:bg-yellow-200 transition-all duration-300 hover:shadow-yellow-300/50"
                >
                  <MapPin className="w-6 h-6 mr-3" />
                  Plan Your Visit
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Link>
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-teal-100 text-sm mt-6"
              >
                We look forward to meeting you and showcasing our premium office furniture solutions
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>


      {/* RJPI as Exhibitors in Expo */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              RJPI as Exhibitors in INDEX PLUS 2025
            </h2>
            <p className="text-lg text-gray-600">
              Watch highlights from RJPI's participation in INDEX PLUS (Furniture | Interior | Design), 2025 at Delhi.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative w-full h-72 md:h-96 overflow-hidden rounded-2xl shadow-xl bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/meqfktc9pto?si=uJHcgg3rphYFyHb5&start=4"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/expo"
              className="inline-flex items-center px-5 py-2 rounded-full border border-teal-600 text-teal-600 font-semibold hover:bg-teal-600 hover:text-white transition-colors"
            >
              View All Expo Videos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Our Vision
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Committed to providing high-quality, reliable, and affordable office furniture solutions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visionFeatures.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <Check className="w-5 h-5 text-teal-600 mr-3 mt-0.5 shrink-0" />
                  <span className="text-gray-900 font-medium">
                    {feature}
                  </span>
                </div>
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
      <section className="pt-16 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Download Our Catalogs
            </h2>
            <p className="text-lg text-gray-600">
              Get detailed information about our products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 1, x: 0 }}
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
                <div className="relative w-full h-40 sm:h-auto sm:w-32 sm:shrink-0 bg-gray-100 overflow-hidden sm:mt-6 sm:aspect-square">
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
              initial={{ opacity: 1, x: 0 }}
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
                <div className="relative w-full h-40 sm:h-auto sm:w-32 sm:shrink-0 bg-gray-100 overflow-hidden sm:mt-6 sm:aspect-square">
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
