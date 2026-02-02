'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Product } from '@/types';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index?: number;
  categoryOverride?: string;
}

// Map category values to URL-friendly slugs for detail pages
function getCategorySlug(category: string): string {
  const categoryMap: Record<string, string> = {
    'plastic': 'plastic',
    'office-parts': 'plastic',
    'cafeteria': 'cafeteria',
    'cafeteria-chairs': 'cafeteria',
    'cafe': 'cafe',
    'mesh': 'mesh',
    'mesh-back': 'mesh',
    'table': 'table',
    'lounge': 'lounge',
    'chairparts': 'chairparts',
    'chair-parts': 'chairparts',
    'chair parts': 'chairparts',
    'chair parts & components': 'chairparts',
    'adjustable-handle': 'adjustable-handle',
    'aremrest-pp-base': 'aremrest-pp-base',
    'wheels': 'wheels',
    'inner-outer': 'inner-outer',
    'pu-moulded-chair': 'pu-moulded-chair',
    'pu-cushions': 'pu-cushions',
    'cafe-bar-counter': 'cafe-bar-counter',
    'school-desk': 'school-desk',
    'cafe-plastic-shell': 'cafe-plastic-shell',
    'chair-plastic-leg': 'chair-plastic-leg',
    'school-desk-parts': 'school-desk-parts',
    'sleek-chair-accessories': 'sleek-chair-accessories',
    'chair-seat-back': 'chair-seat-back',
    'chair-handle-base': 'chair-handle-base',
    'iron-base': 'iron-base',
    'chair-mesh-series': 'chair-mesh-series',
    'chair-mechanism': 'chair-mechanism',
    'fitting-accessories': 'fitting-accessories',
  };
  return categoryMap[category.toLowerCase()] || category.toLowerCase();
}

export function ProductCard({ product, index = 0, categoryOverride }: ProductCardProps) {
  const effectiveCategory = (categoryOverride || product.category || '').toLowerCase();
  const categorySlug = categoryOverride || getCategorySlug(product.category);
  const [imageError, setImageError] = useState(false);
  
  // Prioritize loading first 8 images (above the fold), lazy load the rest
  const shouldPrioritize = index < 8;
  
  // Use EXACT image URL from API - check normalized field first, then original API fields
  // Check product.image first (normalized field), then check original API fields
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
  
  // Debug logging for aremrest-pp-base category
  if (effectiveCategory === 'aremrest-pp-base' && index < 3) {
    console.log(`[ProductCard] Product "${product.name || (product as any).ModelNo}" image check:`, {
      apiImageUrl,
      productImage: product.image,
      hasApiImage: !!apiImageUrl,
      allFields: {
        img: (product as any).img,
        imageUrl: (product as any).imageUrl,
        Url: (product as any).Url,
        URL: (product as any).URL,
      }
    });
  }
  
  // Determine the image source - use placeholder if error or no API image
  const imgSrc = imageError ? '/placeholder.svg' : (apiImageUrl || '/placeholder.svg');
  
  // Use URL from API if available, otherwise generate detail page URL
  const productUrl = product.url || product.URL || product.link || product.href || 
                     `/products/${categorySlug}/${product.id}`;
  
  // Handle external URLs vs internal routes
  const isExternalUrl = productUrl.startsWith('http://') || productUrl.startsWith('https://');
  
  const isExternalImage = imgSrc.startsWith('http://') || imgSrc.startsWith('https://');
  const hasApiImage = apiImageUrl && apiImageUrl !== '/placeholder.svg' && !imageError;
  
  // Determine display name
  const modelNo =
    (product as any).ModelNo ||
    (product as any).modelNo ||
    (product as any).model_no ||
    (product as any).MODELNO;

  const displayName =
    effectiveCategory === 'aremrest-pp-base'
      ? modelNo || product.name || 'Unnamed Product'
      : product.name || 'Unnamed Product';
  
  // Common card content
  const cardContent = (
    <>
      {/* Image Container - Left Side */}
      <div className="relative w-full overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
        {!hasApiImage ? (
          <img
            src="/placeholder.svg"
            alt={displayName}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            style={{ padding: '8px', objectFit: 'contain', display: 'block', maxWidth: '100%', maxHeight: '100%' }}
          />
        ) : (
          <Image
            key={`${product.id}-${apiImageUrl}`}
            src={apiImageUrl}
            alt={displayName}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            style={{ padding: '8px', objectFit: 'contain' }}
            unoptimized={isExternalImage || apiImageUrl.startsWith('/images/')}
            priority={shouldPrioritize}
            loading={shouldPrioritize ? 'eager' : 'lazy'}
            onError={(e) => {
              // Log detailed error information for debugging
              console.error(`❌ Image 404 Error for product "${displayName}":`, {
                attemptedUrl: apiImageUrl,
                productId: product.id,
                category: effectiveCategory,
                allImageFields: {
                  image: product.image,
                  img: (product as any).img,
                  imageUrl: (product as any).imageUrl,
                  Url: (product as any).Url,
                  URL: (product as any).URL,
                }
              });
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
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
          {displayName}
        </h3>
        {product.description && (
          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          {product.price && (
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
          )}
          <motion.div
            whileHover={{ x: 3 }}
            className="flex items-center text-teal-600 font-medium text-xs"
          >
            View
            <ArrowRight className="w-3 h-3 ml-1" />
          </motion.div>
        </div>
      </div>
    </>
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '50px' }}
      transition={{ delay: shouldPrioritize ? 0 : index * 0.03 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 w-full"
    >
      {isExternalUrl ? (
        <a 
          href={productUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          {cardContent}
        </a>
      ) : (
        <Link href={productUrl}>
          {cardContent}
        </Link>
      )}
    </motion.div>
  );
}

