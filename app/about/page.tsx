'use client';

import { motion } from 'framer-motion';
import { Award, Users, Target, Heart, Check } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Quality Excellence',
    description: 'We maintain the highest standards in manufacturing and quality control.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our experienced team ensures every product meets your expectations.',
  },
  {
    icon: Target,
    title: 'Customer Focus',
    description: 'Your satisfaction is our top priority in everything we do.',
  },
  {
    icon: Heart,
    title: 'Innovation',
    description: 'We continuously innovate to bring you the best products.',
  },
];

export default function AboutPage() {
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
              Profile
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Raja Jaiswal Plastic Industries - Leading the industry with quality and innovation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p className="text-lg">
                Raja Jaiswal Plastic Industries has been a trusted name in the manufacturing
                industry, specializing in high-quality office chair parts and cafeteria chairs.
                With years of experience and dedication to excellence, we have built a reputation
                for delivering products that combine durability, comfort, and style.
              </p>
              <p className="text-lg">
                Our commitment to quality and customer satisfaction has made us a preferred
                supplier for businesses across the country. We continuously invest in modern
                manufacturing techniques and quality control processes to ensure every product
                meets the highest standards.
              </p>
              <p className="text-lg">
                At Raja Jaiswal Plastic Industries, we believe in building long-term relationships
                with our clients by providing exceptional products and service. Our team of
                skilled professionals works tirelessly to meet your needs and exceed your
                expectations.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              What sets us apart from the competition
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 text-center"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
                    <Icon className="w-7 h-7 text-gray-900 dark:text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To provide high-quality, innovative products that enhance workplace comfort and
                productivity while maintaining the highest standards of manufacturing excellence
                and customer service.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To become the leading manufacturer and supplier of office furniture components
                in the industry, recognized for innovation, quality, and customer satisfaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
