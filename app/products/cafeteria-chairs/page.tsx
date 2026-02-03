'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchProductsByCategory } from '@/lib/api';
import Image from 'next/image';

const subcategories = [
  {
    id: 'cafeteria-chairs',
    name: 'Cafeteria Chairs',
    description: 'Stylish and comfortable seating solutions for cafeterias',
    slug: 'cafeteria',
    apiCategory: 'cafeteria',
    icon: '🪑',
  },
  {
    id: 'cafeteria-tables',
    name: 'Cafeteria Tables',
    description: 'Durable and functional dining tables',
    slug: 'table',
    apiCategory: 'table',
    icon: '🪑',
  },
  {
    id: 'plastic-chairs',
    name: 'Plastic Chairs',
    description: 'Premium components for office furniture',
    slug: 'plastic',
    apiCategory: 'plastic',
    icon: '🪑',
  },
  {
    id: 'lounge-chairs',
    name: 'Public Waiting Lounge Seater',
    description: 'Comfortable lounge seating solutions',
    slug: 'lounge',
    apiCategory: 'lounge',
    icon: '🪑',
  },
  {
    id: 'cafe-bar-counter-chair',
    name: 'Cafe Bar Counter Chair',
    description: 'Stylish bar counter seating solutions',
    slug: 'cafe-bar-counter',
    apiCategory: 'cafe-bar-counter',
    icon: '🪑',
  },
  {
    id: 'school-desk-institute-writing-chair',
    name: 'School Desk & Institute Writing Chair',
    description: 'Ergonomic seating for educational institutions',
    slug: 'school-desk',
    apiCategory: 'school-desk',
    icon: '🪑',
  },
  {
    id: 'cafe-plastic-top-shell',
    name: 'Cafe Plastic Top Shell',
    description: 'Durable plastic shell seating options',
    slug: 'cafe-plastic-shell',
    apiCategory: 'cafe-plastic-shell',
    icon: '🪑',
  },
];

export default function CafeteriaChairsPage() {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadCategoryImages() {
      const images: Record<string, string> = {};
      
      // Fetch first product image for each category
      for (const subcategory of subcategories) {
        try {
          const products = await fetchProductsByCategory(subcategory.apiCategory);
          if (products && products.length > 0) {
            const firstProduct = products[0];
            // Get image from product - check multiple possible fields
            const productImage = firstProduct.image ||
              (firstProduct as any).img ||
              (firstProduct as any).imageUrl ||
              (firstProduct as any).image_url ||
              (firstProduct as any).photo ||
              (firstProduct as any).picture ||
              (firstProduct as any).Image ||
              (firstProduct as any).Img ||
              (firstProduct as any).ImageUrl ||
              (((firstProduct as any).Url || (firstProduct as any).URL) &&
               typeof ((firstProduct as any).Url || (firstProduct as any).URL) === 'string' &&
               (((firstProduct as any).Url || (firstProduct as any).URL).includes('/images/') ||
                ((firstProduct as any).Url || (firstProduct as any).URL).match(/\.(png|jpg|jpeg|gif|webp)$/i))) ?
               ((firstProduct as any).Url || (firstProduct as any).URL) :
              undefined;
            
            if (productImage && productImage !== '/placeholder.svg') {
              images[subcategory.id] = productImage;
            }
          }
        } catch (error) {
          console.error(`Error loading image for ${subcategory.apiCategory}:`, error);
        }
      }
      
      setCategoryImages(images);
    }
    
    loadCategoryImages();
  }, []);

  const handleImageError = (categoryId: string) => {
    setImageErrors(prev => ({ ...prev, [categoryId]: true }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Compact Header with Breadcrumbs */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Products
                </Link>
              </li>
              <li className="text-gray-400 dark:text-gray-600">
                <ChevronRight className="w-4 h-4" />
              </li>
              <li className="text-gray-900 dark:text-white font-medium">
                Cafeteria Chairs & Components
              </li>
            </ol>
          </nav>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Cafeteria Chairs & Components
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore our comprehensive range of cafeteria furniture and components
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subcategory Cards - Different Layout */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subcategories.map((subcategory, index) => (
              <motion.div
                key={subcategory.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group"
              >
                <Link href={`/products/cafeteria-chairs/${subcategory.id}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-teal-500 dark:hover:border-teal-500 h-full flex flex-col relative">
                    {/* Top Accent Bar */}
                    <div className="h-1.5 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500"></div>
                    
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Icon/Image Area */}
                      <div className="mb-2">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-100/10 to-teal-200/10 dark:from-teal-900/30 dark:to-teal-800/30 border-2 border-gray-200 dark:border-gray-700 group-hover:border-teal-500 dark:group-hover:border-teal-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                          {categoryImages[subcategory.id] && !imageErrors[subcategory.id] ? (
                            <Image
                              src={categoryImages[subcategory.id]}
                              alt={subcategory.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-contain p-2"
                              onError={() => handleImageError(subcategory.id)}
                              unoptimized
                            />
                          ) : (
                            <svg
                              className="w-8 h-8 text-teal-600 dark:text-teal-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {subcategory.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex-1 leading-relaxed">
                        {subcategory.description}
                      </p>
                      
                      {/* CTA */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                        <span className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                          Explore
                        </span>
                        <ArrowRight className="w-4 h-4 text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    
                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-teal-500/0 group-hover:from-teal-500/5 group-hover:to-teal-500/10 transition-all duration-300 pointer-events-none rounded-2xl"></div>
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

