'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Grid, List, ArrowLeft, Search, X } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { fetchFittingAccessories } from '@/lib/api';
import { Product } from '@/types';

export default function FittingAccessoriesSubcategoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const fetchedProducts = await fetchFittingAccessories();
        console.log(`Fitting & Accesories loaded: ${fetchedProducts.length}`);
        setProducts(fetchedProducts);
        
        if (fetchedProducts.length === 0) {
          setError('No products found. Please check the browser console for details.');
        }
      } catch (error) {
        console.error('Error loading fitting & accessories:', error);
        setError('Failed to load products. Please check the console for details.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return products.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(query);
      const descriptionMatch = product.description?.toLowerCase().includes(query);
      return nameMatch || descriptionMatch;
    });
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <section className="sticky top-16 z-40 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <nav>
              <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link href="/products" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                    Products
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link
                    href="/products/chair-parts"
                    className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    Chair Parts & Components
                  </Link>
                </li>
                <li>/</li>
                <li className="font-medium text-gray-900 dark:text-gray-100">Fitting & Accesories</li>
              </ol>
            </nav>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">View:</span>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Fitting & Accesories
                </h1>
                {!loading && (
                  <span className="px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800 text-sm font-semibold text-teal-700 dark:text-teal-300">
                    {searchQuery ? (
                      <>
                        {filteredProducts.length} of {products.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
                      </>
                    ) : (
                      <>
                        {products.length} {products.length === 1 ? 'Product' : 'Products'}
                      </>
                    )}
                  </span>
                )}
                {loading && (
                  <span className="inline-block w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></span>
                )}
              </div>
              
              <div className="relative w-full sm:w-auto sm:min-w-[300px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  </button>
                )}
              </div>
            </div>
            
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
              Fittings and accessories for chairs.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-200 dark:border-teal-800 border-t-teal-600 dark:border-t-teal-400"></div>
              <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="max-w-2xl mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Error Loading Products
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-6 py-3 bg-teal-600 dark:bg-teal-500 text-white rounded-md font-medium hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {filteredProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={index}
                      categoryOverride="fitting-accessories"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index < 5 ? index * 0.02 : 0 }}
                      className="group bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <Link href={`/products/fitting-accessories/${product.id}`}>
                        <div className="flex flex-col sm:flex-row gap-6 p-6">
                          <div className="relative w-full sm:w-40 h-56 sm:h-40 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border border-gray-200 dark:border-gray-700 group-hover:scale-105 transition-transform duration-300">
                            {product.image && product.image !== '/placeholder.svg' ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain p-4"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <img
                                src="/placeholder.svg"
                                alt={product.name}
                                className="w-full h-full object-contain p-4 opacity-50"
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                                {product.name}
                              </h3>
                              {product.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                                  {product.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                              {product.price && (
                                <div>
                                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ₹{product.price.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              <span className="inline-flex items-center text-sm font-semibold text-teal-600 dark:text-teal-400 group-hover:gap-2 transition-all">
                                View Details
                                <ArrowLeft className="w-4 h-4 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : searchQuery ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  No products match your search "{searchQuery}". Try a different search term.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center px-4 py-2 bg-teal-600 dark:bg-teal-500 text-white rounded-md font-medium hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We couldn't find any products in this category.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

