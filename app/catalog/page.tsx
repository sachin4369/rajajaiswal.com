'use client';

import { motion } from 'framer-motion';
import { Download, FileText, FileDown, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const catalogs = [
  {
    id: 'office-parts',
    title: 'Chair Parts Catalog',
    subtitle: 'Office Chair Parts',
    description: 'Complete catalog of all our office chair parts and components. Browse through our extensive collection of bases, wheels, armrests, shells, mesh backs, and more.',
    fileUrl: '/images/catalogs/partscatalog25.pdf',
    image: '/images/catalogs/partscatalog25.jpg',
    size: '5.2 MB',
    pages: '24 pages',
  },
  {
    id: 'cafeteria',
    title: 'Cafe Chair Catalog',
    subtitle: 'Cafeteria Chairs',
    description: 'Explore our full range of cafeteria and dining chairs. Discover stylish and comfortable seating solutions for modern workplaces and dining areas.',
    fileUrl: '/images/catalogs/cafecatalog25.pdf',
    image: '/images/catalogs/cafecatalog25.jpg',
    size: '4.8 MB',
    pages: '18 pages',
  },
];

export default function CatalogPage() {
  const handleDownload = (catalog: typeof catalogs[0]) => {
    // Create a link element to download the PDF file
    const link = document.createElement('a');
    link.href = catalog.fileUrl;
    link.download = catalog.fileUrl.split('/').pop() || `${catalog.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black via-teal-950 to-black py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Product Catalogs
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Download our comprehensive product catalogs to explore our complete range of office chair parts and cafeteria chairs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Catalogs Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {catalogs.map((catalog, index) => (
              <motion.div
                key={catalog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                      {catalog.subtitle}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {catalog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                    {catalog.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-6 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <FileDown className="w-4 h-4 mr-1" />
                      {catalog.size}
                    </span>
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {catalog.pages}
                    </span>
                  </div>
                  
                  {/* Catalog Image - Clickable */}
                  <div 
                    onClick={() => handleDownload(catalog)}
                    className="relative h-96 md:h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg mb-6 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <Image
                      src={catalog.image}
                      alt={catalog.title}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-lg">
                      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                        <Download className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => handleDownload(catalog)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center px-6 py-3 bg-teal-600 dark:bg-teal-500 text-white rounded-md font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Need More Information?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              If you need additional details about our products, have specific requirements, or would like to discuss custom solutions, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 bg-teal-600 dark:bg-teal-500 text-white rounded-md font-semibold hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors"
              >
                Contact Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-teal-600 dark:border-teal-400 text-teal-600 dark:text-teal-400 rounded-md font-semibold hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white transition-colors"
              >
                Browse Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              href="/products?category=plastic"
              className="group p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white transition-colors"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Office Chair Parts
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse our collection of office chair components
              </p>
            </Link>
            
            <Link
              href="/products?category=cafeteria"
              className="group p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white transition-colors"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Cafeteria Chairs
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Explore our range of cafeteria seating solutions
              </p>
            </Link>
            
            <Link
              href="/contact"
              className="group p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white transition-colors"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                Get in Touch
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Contact us for inquiries and support
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
