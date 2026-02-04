'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Products Section */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-teal-400">
              Products
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=plastic" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Office Chair Parts
                </Link>
              </li>
              <li>
                <Link href="/products?category=cafe" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Cafe Chairs
                </Link>
              </li>
              <li>
                <Link href="/products?category=mesh" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Mesh Back
                </Link>
              </li>
              <li>
                <Link href="/products?category=table" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Cafeteria Tables
                </Link>
              </li>
              <li>
                <Link href="/products?category=lounge" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Lounge Chairs
                </Link>
              </li>
              <li>
                <Link href="/products?category=cafeteria" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Cafeteria Chairs
                </Link>
              </li>
            </ul>
          </div>

          {/* Download Section */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-teal-400">
              Download
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Chair Parts Catalog
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Cafe Chair Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Terms Section */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-teal-400">
              Terms
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-teal-400">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-teal-400 transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li className="flex items-start text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Location: Plot no. 70, Ground floor, Furniture Block, Kirti Nagar, New Delhi-110015</span>
              </li>
            </ul>
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <a href="mailto:sachinchohi@gmail.com" className="hover:text-teal-400 transition-colors">
                  rajajaiswal2000@gmail.com
                </a>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>+91 9810087153</span>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-3 text-teal-400">
                Follow Us
              </h4>
              <div className="flex items-center space-x-3">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-teal-600 flex items-center justify-center transition-colors group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-teal-600 flex items-center justify-center transition-colors group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-teal-600 flex items-center justify-center transition-colors group"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-teal-600 flex items-center justify-center transition-colors group"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-teal-600 flex items-center justify-center transition-colors group"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-teal-900/30 mt-12 pt-8 text-center">
          <p className="text-sm text-teal-400/80">
            &copy; {currentYear} Raja Jaiswal Plastic Industries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
