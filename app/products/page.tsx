'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
const categories = [
  {
    id: 'chair-parts',
    name: 'Chair Parts & Components',
    description: 'Essential components and parts for office chairs',
    slug: 'chairparts',
    image: '/images/chair-parts-components.jpg',
  },
  {
    id: 'cafeteria-chairs',
    name: 'Cafeteria Chairs & Components',
    description: 'Stylish and comfortable seating solutions for cafeterias',
    slug: 'cafeteria',
    image: '/images/chafe-parts-components.jpg',
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <section className="relative bg-gradient-to-r from-black via-teal-950 to-black py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Our Products
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Explore our comprehensive range of high-quality office chair parts and cafeteria chairs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Cards */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link href={`/products/${category.id}`}>
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                            />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Content */}
                    <div className="p-8 flex-1 flex flex-col">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {category.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1">
                        {category.description}
                      </p>
                      <div className="flex items-center text-teal-600 dark:text-teal-400 font-semibold group-hover:gap-3 transition-all">
                        <span>View Products</span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            </div>
          </div>
        </section>
    </div>
  );
}
