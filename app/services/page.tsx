'use client';

import { motion } from 'framer-motion';
import { Package, Truck, Headphones, Settings, Shield, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Package,
    title: 'Custom Manufacturing',
    description: 'We offer custom manufacturing services to meet your specific requirements and design needs.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Efficient logistics and delivery network ensuring timely delivery of your orders.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our dedicated customer support team is available round the clock to assist you.',
  },
  {
    icon: Settings,
    title: 'Quality Assurance',
    description: 'Rigorous quality control processes ensure every product meets our high standards.',
  },
  {
    icon: Shield,
    title: 'Warranty',
    description: 'Comprehensive warranty coverage on all our products for your peace of mind.',
  },
  {
    icon: Zap,
    title: 'Bulk Orders',
    description: 'Special pricing and dedicated support for bulk orders and corporate clients.',
  },
];

export default function ServicesPage() {
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
              Our Services
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Comprehensive solutions for all your office furniture needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-900 dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gray-50 dark:bg-gray-800 p-12 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your requirements and discover how we can help you with your office furniture needs.
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
    </div>
  );
}
