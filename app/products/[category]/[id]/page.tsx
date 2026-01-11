'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProductById, fetchProductsByCategory } from '@/lib/api';
import { Product } from '@/types';
import { ArrowLeft, Check, Share2, Copy, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

// Component for product detail image with error handling - displays in left container
function ProductDetailImage({ product }: { product: Product }) {
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
          style={{ padding: '16px', objectFit: 'contain', display: 'block', maxWidth: '100%', maxHeight: '100%' }}
        />
      ) : (
        <Image
          key={`${product.id}-${apiImageUrl}`}
          src={apiImageUrl}
          alt={product.name}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 50vw"
          style={{ padding: '16px', objectFit: 'contain' }}
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

// Share buttons component
function ShareButtons({ product, category, id }: { product: Product; category: string; id: string }) {
  const [copied, setCopied] = useState(false);
  const [shareType, setShareType] = useState<'page' | 'image' | null>(null);

  const getImageUrl = () => {
    const apiImageUrl = (product.image && product.image !== '/placeholder.svg') ? product.image :
                        (product as any).img || 
                        (product as any).imageUrl || 
                        (product as any).image_url ||
                        (product as any).photo ||
                        (product as any).picture ||
                        (product as any).Image ||
                        (product as any).Img ||
                        (product as any).ImageUrl ||
                        (((product as any).Url || (product as any).URL) && 
                         typeof ((product as any).Url || (product as any).URL) === 'string' &&
                         (((product as any).Url || (product as any).URL).includes('/images/') || 
                          ((product as any).Url || (product as any).URL).match(/\.(png|jpg|jpeg|gif|webp)$/i))) ? 
                         ((product as any).Url || (product as any).URL) :
                        undefined;
    
    if (apiImageUrl && (apiImageUrl.startsWith('http://') || apiImageUrl.startsWith('https://'))) {
      return apiImageUrl;
    }
    if (apiImageUrl && apiImageUrl.startsWith('/')) {
      return typeof window !== 'undefined' ? `${window.location.origin}${apiImageUrl}` : apiImageUrl;
    }
    return undefined;
  };

  const getPageUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const sharePage = async () => {
    const url = getPageUrl();
    const title = product.name;
    const text = product.description || `Check out ${product.name}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
        setShareType('page');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(url);
        setShareType('page');
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          setShareType(null);
        }, 2000);
      }
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(url);
          setShareType('page');
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
            setShareType(null);
          }, 2000);
        } catch (clipboardError) {
          console.error('Failed to copy URL:', clipboardError);
        }
      }
    }
  };

  const shareImage = async () => {
    const imageUrl = getImageUrl();
    
    if (!imageUrl) {
      alert('Image URL not available');
      return;
    }

    try {
      // Fetch the image as a blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `${product.name.replace(/\s+/g, '-')}.jpg`, { type: blob.type });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name}`,
          files: [file],
        });
        setShareType('image');
      } else {
        // Fallback: Copy image URL to clipboard
        await navigator.clipboard.writeText(imageUrl);
        setShareType('image');
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          setShareType(null);
        }, 2000);
      }
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        // Fallback: Copy image URL to clipboard
        try {
          await navigator.clipboard.writeText(imageUrl);
          setShareType('image');
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
            setShareType(null);
          }, 2000);
        } catch (clipboardError) {
          console.error('Failed to copy image URL:', clipboardError);
          alert('Failed to share image. Please try again.');
        }
      }
    }
  };

  return (
    <div className="flex gap-3 mt-4 justify-center">
      <motion.button
        onClick={sharePage}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
      >
        {shareType === 'page' && copied ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span>Share Page</span>
          </>
        )}
      </motion.button>
      
      <motion.button
        onClick={shareImage}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
      >
        {shareType === 'image' && copied ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            <span>Share Image</span>
          </>
        )}
      </motion.button>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextProduct, setNextProduct] = useState<Product | null>(null);
  const [prevProduct, setPrevProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      console.log(`=== Loading Product Detail ===`);
      console.log(`Category: ${category}, ID: ${id}`);
      try {
        // Fetch all products for navigation
        const allProducts = await fetchProductsByCategory(category);
        
        // Find current product
        let currentProduct = allProducts.find(p => p.id === id);
        if (!currentProduct) {
          currentProduct = allProducts.find(p => p.id.toLowerCase() === id.toLowerCase());
        }
        if (!currentProduct && id.includes('-')) {
          const parts = id.split('-');
          if (parts.length >= 2) {
            const index = parseInt(parts[1]);
            if (!isNaN(index) && index >= 0 && index < allProducts.length) {
              currentProduct = allProducts[index];
            }
          }
        }
        
        if (currentProduct) {
          console.log(`✅ Product loaded successfully:`, currentProduct.name);
          setProduct(currentProduct);
          
          // Find current product index
          const currentIndex = allProducts.findIndex(p => p.id === currentProduct!.id);
          
          // Get next and previous products
          if (currentIndex >= 0) {
            const next = currentIndex < allProducts.length - 1 ? allProducts[currentIndex + 1] : null;
            const prev = currentIndex > 0 ? allProducts[currentIndex - 1] : null;
            setNextProduct(next);
            setPrevProduct(prev);
          }
        } else {
          console.error(`❌ Product not found for category: ${category}, id: ${id}`);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message, error.stack);
        }
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [category, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The product you're looking for doesn't exist or couldn't be loaded.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Debug Info:</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Category: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{category}</code>
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              ID: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{id}</code>
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Check the browser console (F12) for detailed error information.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link
              href={`/products?category=${category}`}
              className="inline-flex items-center px-6 py-3 bg-teal-600 dark:bg-teal-500 text-white rounded-md font-medium hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
            >
              Back to {category} Products
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-gray-600 dark:bg-gray-500 text-white rounded-md font-medium hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8">
      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </motion.button>
      </div>

      {/* Product Details */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image - Left Container */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative flex flex-col items-center justify-center"
            >
              <div className="relative aspect-square w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800">
                <ProductDetailImage product={product} />
              </div>
              <ShareButtons product={product} category={category} id={id} />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  {product.name}
                </h1>
                {product.price && (
                  <p className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-4">
                    ₹{product.price.toLocaleString()}
                  </p>
                )}
                {product.description && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Key Features
                  </h2>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-start"
                      >
                        <Check className="w-5 h-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    Specifications
                  </h2>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <dl className="space-y-3">
                      {Object.entries(product.specifications)
                        .filter(([key]) => {
                          // Exclude Id, Tag, and Url fields from specifications
                          const excludedKeys = [
                            'id', 'Id', 'ID', '_id',
                            'url', 'URL', 'Url', 'link', 'href',
                            'tag', 'Tag', 'TAG', 'tags', 'Tags', 'TAGS'
                          ];
                          return !excludedKeys.includes(key);
                        })
                        .map(([key, value], index) => {
                          // Check if this is a color-related field
                          const isColorField = key.toLowerCase().includes('color') || 
                                             key.toLowerCase().includes('colour');
                          
                          // Helper function to get color value (hex, rgb, or color name)
                          const getColorValue = (colorStr: string): string => {
                            const str = colorStr.trim();
                            // Check if it's a hex color
                            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str)) {
                              return str;
                            }
                            // Check if it's rgb/rgba
                            if (/^rgba?\(/.test(str)) {
                              return str;
                            }
                            // Map common color names to hex values
                            const colorMap: Record<string, string> = {
                              'red': '#ef4444',
                              'blue': '#3b82f6',
                              'green': '#10b981',
                              'yellow': '#fbbf24',
                              'orange': '#f97316',
                              'purple': '#a855f7',
                              'pink': '#ec4899',
                              'black': '#000000',
                              'white': '#ffffff',
                              'gray': '#6b7280',
                              'grey': '#6b7280',
                              'brown': '#92400e',
                              'beige': '#f5f5dc',
                              'navy': '#1e3a8a',
                              'teal': '#14b8a6',
                              'cyan': '#06b6d4',
                              'lime': '#84cc16',
                              'amber': '#f59e0b',
                              'indigo': '#6366f1',
                              'violet': '#8b5cf6',
                              'silver': '#c0c0c0',
                              'gold': '#ffd700',
                            };
                            const lowerStr = str.toLowerCase();
                            return colorMap[lowerStr] || '#6b7280'; // Default gray if not found
                          };
                          
                          const valueStr = String(value);
                          const colorValues = isColorField ? valueStr.split(',').map(c => c.trim()).filter(c => c) : [];
                          
                          return (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + index * 0.05 }}
                              className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2"
                            >
                              <dt className="font-medium text-gray-700 dark:text-gray-300">
                                {key}:
                              </dt>
                              <dd className="text-gray-900 dark:text-white">
                                {isColorField && colorValues.length > 0 ? (
                                  <div className="flex flex-wrap items-center gap-2">
                                    {colorValues.map((color, colorIndex) => {
                                      const colorValue = getColorValue(color);
                                      return (
                                        <div
                                          key={colorIndex}
                                          className="w-5 h-5 rounded border border-gray-300 shadow-sm"
                                          style={{ backgroundColor: colorValue }}
                                          title={color}
                                        />
                                      );
                                    })}
                                  </div>
                                ) : (
                                  valueStr
                                )}
                              </dd>
                            </motion.div>
                          );
                        })}
                    </dl>
                  </div>
                </div>
              )}

              {/* All Product Details - Display all API fields */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Product Details
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <dl className="space-y-3">
                    {Object.entries(product)
                      .filter(([key]) => {
                        // Exclude already displayed fields, internal fields, and URL fields
                        const excludedKeys = [
                          'id', 'Id', 'ID', '_id',
                          'name', 'description', 'image', 'price', 'category', 
                          'specifications', 'features', 
                          'url', 'URL', 'Url', 'link', 'href',
                          'tag', 'Tag', 'TAG', 'tags', 'Tags', 'TAGS'
                        ];
                        return !excludedKeys.includes(key);
                      })
                      .map(([key, value], index) => {
                        // Skip functions and undefined/null values
                        if (typeof value === 'function' || value === undefined || value === null) {
                          return null;
                        }
                        
                        // Format the key name (convert camelCase to Title Case)
                        const formattedKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())
                          .trim();
                        
                        // Check if this is a color-related field
                        const isColorField = key.toLowerCase().includes('color') || 
                                           key.toLowerCase().includes('colour') ||
                                           formattedKey.toLowerCase().includes('color') ||
                                           formattedKey.toLowerCase().includes('colour');
                        
                        // Format the value based on type
                        let displayValue: string;
                        let colorValues: string[] = [];
                        
                        if (Array.isArray(value)) {
                          displayValue = value.join(', ');
                          colorValues = value.map(v => String(v));
                        } else if (typeof value === 'object') {
                          displayValue = JSON.stringify(value, null, 2);
                        } else {
                          displayValue = String(value);
                          // Try to parse comma-separated colors
                          if (isColorField) {
                            colorValues = String(value).split(',').map(c => c.trim()).filter(c => c);
                          }
                        }
                        
                        // Helper function to get color value (hex, rgb, or color name)
                        const getColorValue = (colorStr: string): string => {
                          const str = colorStr.trim();
                          // Check if it's a hex color
                          if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str)) {
                            return str;
                          }
                          // Check if it's rgb/rgba
                          if (/^rgba?\(/.test(str)) {
                            return str;
                          }
                          // Map common color names to hex values
                          const colorMap: Record<string, string> = {
                            'red': '#ef4444',
                            'blue': '#3b82f6',
                            'green': '#10b981',
                            'yellow': '#fbbf24',
                            'orange': '#f97316',
                            'purple': '#a855f7',
                            'pink': '#ec4899',
                            'black': '#000000',
                            'white': '#ffffff',
                            'gray': '#6b7280',
                            'grey': '#6b7280',
                            'brown': '#92400e',
                            'beige': '#f5f5dc',
                            'navy': '#1e3a8a',
                            'teal': '#14b8a6',
                            'cyan': '#06b6d4',
                            'lime': '#84cc16',
                            'amber': '#f59e0b',
                            'indigo': '#6366f1',
                            'violet': '#8b5cf6',
                            'silver': '#c0c0c0',
                            'gold': '#ffd700',
                          };
                          const lowerStr = str.toLowerCase();
                          return colorMap[lowerStr] || '#6b7280'; // Default gray if not found
                        };
                        
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 dark:border-gray-700 pb-3 gap-2"
                          >
                            <dt className="font-medium text-gray-700 dark:text-gray-300 min-w-[150px]">
                              {formattedKey}:
                            </dt>
                            <dd className="text-gray-900 dark:text-white flex-1 break-words">
                              {isColorField && colorValues.length > 0 ? (
                                <div className="flex flex-wrap items-center gap-2">
                                  {colorValues.map((color, colorIndex) => {
                                    const colorValue = getColorValue(color);
                                    return (
                                      <div
                                        key={colorIndex}
                                        className="w-5 h-5 rounded border border-gray-300 shadow-sm"
                                        style={{ backgroundColor: colorValue }}
                                        title={color}
                                      />
                                    );
                                  })}
                                </div>
                              ) : (
                                displayValue
                              )}
                            </dd>
                          </motion.div>
                        );
                      })}
                  </dl>
                </div>
              </div>

              {/* Contact CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-6"
              >
                <Link
                  href={`/contact?product=${encodeURIComponent(product.name)}`}
                  className="inline-block w-full text-center px-8 py-4 bg-teal-600 text-white rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors"
                >
                  Contact Us for Inquiry
                </Link>
              </motion.div>

              {/* Next/Previous Navigation */}
              {(prevProduct || nextProduct) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="pt-6 border-t border-gray-200 mt-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    {prevProduct ? (
                      <Link
                        href={`/products/${category}/${prevProduct.id}`}
                        className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex-1"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-gray-500">Previous</span>
                          <span className="text-sm font-semibold truncate max-w-[200px]">{prevProduct.name}</span>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex-1"></div>
                    )}
                    
                    {nextProduct ? (
                      <Link
                        href={`/products/${category}/${nextProduct.id}`}
                        className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex-1 justify-end"
                      >
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500">Next</span>
                          <span className="text-sm font-semibold truncate max-w-[200px]">{nextProduct.name}</span>
                        </div>
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    ) : (
                      <div className="flex-1"></div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

