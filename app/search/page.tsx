'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Grid, List, Search, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import {
  fetchPlasticChairs,
  fetchCafeteriaChairs,
  fetchCafeChairs,
  fetchMeshBack,
  fetchCafeteriaTables,
  fetchLoungeChairs,
  fetchChairParts,
  fetchAdjustableHandle,
  fetchAremrestPPBase,
  fetchWheels,
  fetchInnerOuter,
  fetchPUMouldedChair,
  fetchPUCushions,
  fetchCafeBarCounterChair,
  fetchSchoolDeskInstituteWritingChair,
  fetchCafePlasticTopShell,
  fetchChairPlasticLeg,
  fetchSchoolDeskPartsComponents,
  fetchSleekChairAccessories,
  fetchChairSeatBackPlasticFibre,
  fetchChairHandleBaseNylon,
  fetchIronBase,
  fetchChairMeshSeries,
  fetchChairMechanism,
  fetchFittingAccessories,
} from '@/lib/api';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    async function loadAllProducts() {
      setLoading(true);
      setError(null);
      try {
        const [
          plastic,
          cafeteria,
          cafe,
          mesh,
          table,
          lounge,
          chairParts,
          adjustableHandle,
          aremrestPPBase,
          wheels,
          innerOuter,
          puMouldedChair,
          puCushions,
          cafeBarCounter,
          schoolDesk,
          cafePlasticShell,
          chairPlasticLeg,
          schoolDeskParts,
          sleekAccessories,
          chairSeatBack,
          chairHandleBase,
          ironBase,
          chairMeshSeries,
          chairMechanism,
          fittingAccessories,
        ] = await Promise.all([
          fetchPlasticChairs(),
          fetchCafeteriaChairs(),
          fetchCafeChairs(),
          fetchMeshBack(),
          fetchCafeteriaTables(),
          fetchLoungeChairs(),
          fetchChairParts(),
          fetchAdjustableHandle(),
          fetchAremrestPPBase(),
          fetchWheels(),
          fetchInnerOuter(),
          fetchPUMouldedChair(),
          fetchPUCushions(),
          fetchCafeBarCounterChair(),
          fetchSchoolDeskInstituteWritingChair(),
          fetchCafePlasticTopShell(),
          fetchChairPlasticLeg(),
          fetchSchoolDeskPartsComponents(),
          fetchSleekChairAccessories(),
          fetchChairSeatBackPlasticFibre(),
          fetchChairHandleBaseNylon(),
          fetchIronBase(),
          fetchChairMeshSeries(),
          fetchChairMechanism(),
          fetchFittingAccessories(),
        ]);

        const combined = [
          ...plastic,
          ...cafeteria,
          ...cafe,
          ...mesh,
          ...table,
          ...lounge,
          ...chairParts,
          ...adjustableHandle,
          ...aremrestPPBase,
          ...wheels,
          ...innerOuter,
          ...puMouldedChair,
          ...puCushions,
          ...cafeBarCounter,
          ...schoolDesk,
          ...cafePlasticShell,
          ...chairPlasticLeg,
          ...schoolDeskParts,
          ...sleekAccessories,
          ...chairSeatBack,
          ...chairHandleBase,
          ...ironBase,
          ...chairMeshSeries,
          ...chairMechanism,
          ...fittingAccessories,
        ];

        console.log(`Total products loaded: ${combined.length}`);
        setAllProducts(combined);
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products. Please try again later.');
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadAllProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    
    const query = searchQuery.toLowerCase().trim();
    return allProducts.filter((product) => {
      const nameMatch = product.name?.toLowerCase().includes(query);
      const descriptionMatch = product.description?.toLowerCase().includes(query);
      return nameMatch || descriptionMatch;
    });
  }, [allProducts, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
    }
    window.history.pushState({}, '', `/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Search Products
            </h1>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products by name or description..."
                  className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-base"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      window.history.pushState({}, '', '/search');
                    }}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  </button>
                )}
              </div>
            </form>

            {/* View Toggle */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-500">View:</span>
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-200 border-t-teal-600"></div>
              <p className="mt-6 text-gray-600 font-medium">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="max-w-2xl mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Error Loading Products
                </h3>
                <p className="text-gray-600 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-md font-medium hover:bg-teal-700 transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          ) : !searchQuery.trim() ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Start Your Search
                </h3>
                <p className="text-gray-600">
                  Enter a search term above to find products across all categories.
                </p>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  Found <span className="font-semibold text-gray-900">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'} for "{searchQuery}"
                </p>
              </div>
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {filteredProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={index}
                      categoryOverride={product.category}
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
                      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
                    >
                      <a href={`/products/${product.category || 'plastic'}/${product.id}`}>
                        <div className="flex flex-col sm:flex-row gap-6 p-6">
                          <div className="relative w-full sm:w-40 h-56 sm:h-40 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-200 group-hover:scale-105 transition-transform duration-300">
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
                              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                                {product.name}
                              </h3>
                              {product.description && (
                                <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                                  {product.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              {product.price && (
                                <div>
                                  <span className="text-2xl font-bold text-gray-900">
                                    ₹{product.price.toLocaleString()}
                                  </span>
                                </div>
                              )}
                              <span className="inline-flex items-center text-sm font-semibold text-teal-600 group-hover:gap-2 transition-all">
                                View Details
                                <svg className="w-4 h-4 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  No products match your search "{searchQuery}". Try a different search term.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    window.history.pushState({}, '', '/search');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md font-medium hover:bg-teal-700 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

