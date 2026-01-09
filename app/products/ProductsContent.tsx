'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Grid, List } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { fetchPlasticChairs, fetchCafeteriaChairs, fetchCafeChairs, fetchMeshBack, fetchCafeteriaTables, fetchLoungeChairs, fetchChairParts } from '@/lib/api';
import { Product } from '@/types';

// Component for product image in list view with error handling
function ProductImage({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false);
  
  // Use EXACT image URL from API - check normalized field first, then original API fields
  // IMPORTANT: Also check Url/URL fields if they contain image paths
  const apiImageUrl = (product.image && product.image !== '/placeholder.svg') ? product.image :
                      (product as any).img || 
                      (product as any).imageUrl || 
                      (product as any).image_url ||
                      (product as any).photo ||
                      (product as any).picture ||
                      (product as any).Image ||
                      (product as any).Img ||
                      (product as any).ImageUrl ||
                      // Check Url/URL if it contains image path
                      (((product as any).Url || (product as any).URL) && 
                       typeof ((product as any).Url || (product as any).URL) === 'string' &&
                       (((product as any).Url || (product as any).URL).includes('/images/') || 
                        ((product as any).Url || (product as any).URL).match(/\.(png|jpg|jpeg|gif|webp)$/i))) ? 
                       ((product as any).Url || (product as any).URL) :
                      undefined;
  
  // Determine if we have a valid API image
  const hasApiImage = apiImageUrl && apiImageUrl !== '/placeholder.svg' && !imageError;
  const isExternalImage = apiImageUrl?.startsWith('http://') || apiImageUrl?.startsWith('https://');
  
  return (
    <>
      {!hasApiImage ? (
        <img
          src="/placeholder.svg"
          alt={product.name}
          className="w-full h-full object-contain"
          style={{ padding: '8px', objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <Image
          key={`${product.id}-${apiImageUrl}`}
          src={apiImageUrl}
          alt={product.name}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 100vw, 128px"
          style={{ padding: '8px', objectFit: 'contain' }}
          unoptimized={isExternalImage}
          onError={() => {
            // Silently handle image load errors - fallback to placeholder
            if (!imageError) {
              setImageError(true);
            }
          }}
          onLoad={() => {
            // Reset error state if image loads successfully
            if (imageError) {
              setImageError(false);
            }
          }}
        />
      )}
    </>
  );
}

// Debug utility loaded via useEffect to avoid hydration issues

const categories = [
  {
    id: 'plastic',
    name: 'Plastic Chairs',
    description: 'Premium components for office furniture',
  },
  {
    id: 'cafe',
    name: 'Cafe Chairs',
    description: 'Modern and elegant cafe seating',
  },
  {
    id: 'mesh',
    name: 'Mesh Back',
    description: 'Ergonomic mesh back chairs',
  },
  {
    id: 'table',
    name: 'Cafeteria Tables',
    description: 'Durable and functional dining tables',
  },
  {
    id: 'lounge',
    name: 'Lounge Chairs',
    description: 'Comfortable lounge seating solutions',
  },
  {
    id: 'cafeteria',
    name: 'Cafeteria Chairs',
    description: 'Stylish and comfortable seating solutions',
  },
  {
    id: 'chairparts',
    name: 'Chair Parts',
    description: 'Essential components and parts for chairs',
  },
];

export function ProductsContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'plastic';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load debug utility only on client side to avoid hydration issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/lib/api-debug').then(({ testAPIEndpoint }) => {
        (window as any).testAPI = testAPIEndpoint;
      });
    }
  }, []);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        let fetchedProducts: Product[] = [];
        
        switch (selectedCategory) {
          case 'plastic':
            fetchedProducts = await fetchPlasticChairs();
            break;
          case 'cafe':
            fetchedProducts = await fetchCafeChairs();
            break;
          case 'mesh':
            fetchedProducts = await fetchMeshBack();
            break;
          case 'table':
            fetchedProducts = await fetchCafeteriaTables();
            break;
          case 'lounge':
            fetchedProducts = await fetchLoungeChairs();
            break;
          case 'cafeteria':
            fetchedProducts = await fetchCafeteriaChairs();
            break;
          case 'chairparts':
            fetchedProducts = await fetchChairParts();
            break;
          default:
            fetchedProducts = [];
        }
        
        console.log(`=== Products Loaded for ${selectedCategory} ===`);
        console.log(`Total products: ${fetchedProducts.length}`);
        if (fetchedProducts.length > 0) {
          console.log('Sample product:', fetchedProducts[0]);
          console.log('All product IDs:', fetchedProducts.map(p => p.id).slice(0, 10));
        } else {
          console.warn('⚠️ NO PRODUCTS FOUND!');
          console.warn('This could mean:');
          console.warn('1. API endpoint returned empty array');
          console.warn('2. API endpoint returned data in unexpected format');
          console.warn('3. API endpoint is not accessible');
          console.warn('4. Products were filtered out due to missing required fields (id, name)');
        }
        setProducts(fetchedProducts);
        
        if (fetchedProducts.length === 0) {
          setError(`No products found for category "${selectedCategory}". Please check the browser console (F12) for detailed API response information. The API endpoint may be empty, unavailable, or the data structure may be different than expected.`);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setError(`Failed to load products. Please check the console for details.`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory]);

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <>
      {/* Category Tabs */}
      <section className="sticky top-16 z-40 bg-white dark:bg-black border-b border-gray-200 dark:border-teal-900/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-teal-600 dark:bg-teal-500 text-white shadow-lg ring-2 ring-teal-300 dark:ring-teal-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400 border-2 border-transparent hover:border-teal-300 dark:hover:border-teal-700'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading products...</p>
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
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Debugging Steps:</p>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                    <li>Open browser console (Press F12 or Right-click → Inspect → Console)</li>
                    <li>Look for logs starting with "=== Fetching"</li>
                    <li>Check if API URLs are accessible</li>
                    <li>Verify the data structure matches expected format</li>
                    <li>In console, type: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">testAPI('{selectedCategory}')</code></li>
                  </ol>
                </div>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/products?category=plastic"
                    className="inline-flex items-center px-6 py-3 bg-teal-600 dark:bg-teal-500 text-white rounded-md font-medium hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
                  >
                    Try Plastic Chairs
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center px-6 py-3 bg-gray-600 dark:bg-gray-500 text-white rounded-md font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Category Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentCategory?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentCategory?.description} • {products.length} {products.length === 1 ? 'product' : 'products'}
                </p>
              </motion.div>

              {/* Products Grid/List */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={index}
                      categoryOverride={selectedCategory}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                    >
                      {(() => {
                        // Use URL from API if available, otherwise generate detail page URL
                        const productUrl = product.url || product.URL || product.link || product.href || 
                                         `/products/${selectedCategory}/${product.id}`;
                        const isExternalUrl = productUrl.startsWith('http://') || productUrl.startsWith('https://');
                        
                        const listContent = (
                          <div className="flex flex-col sm:flex-row gap-4 p-4">
                            {/* Image Container - Left Side */}
                            <div className="relative w-full sm:w-32 h-48 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <ProductImage product={product} />
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                  {product.name}
                                </h3>
                                {product.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                    {product.description}
                                  </p>
                                )}
                                {/* Display additional key fields from API */}
                                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-3">
                                  {Object.entries(product)
                                    .filter(([key, value]) => {
                                      const excludedKeys = ['id', 'name', 'description', 'image', 'price', 'category', 'specifications', 'features', 'url', 'URL', 'link', 'href'];
                                      return !excludedKeys.includes(key) && 
                                             value !== undefined && 
                                             value !== null && 
                                             typeof value !== 'object' && 
                                             typeof value !== 'function' &&
                                             String(value).length < 100; // Only show short values
                                    })
                                    .slice(0, 3) // Show max 3 additional fields
                                    .map(([key, value]) => {
                                      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
                                      return (
                                        <div key={key} className="flex gap-2">
                                          <span className="font-medium">{formattedKey}:</span>
                                          <span>{String(value)}</span>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                {product.price && (
                                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    ₹{product.price.toLocaleString()}
                                  </span>
                                )}
                                <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                                  View Details →
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                        
                        return isExternalUrl ? (
                          <a href={productUrl} target="_blank" rel="noopener noreferrer">
                            {listContent}
                          </a>
                        ) : (
                          <Link href={productUrl}>
                            {listContent}
                          </Link>
                        );
                      })()}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
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
                  We couldn't find any products in this category. Please try another category.
                </p>
                <Link
                  href="/products?category=plastic"
                  className="inline-flex items-center px-6 py-3 bg-teal-600 dark:bg-teal-500 text-white rounded-md font-medium hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
                >
                  View Plastic Chairs
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
