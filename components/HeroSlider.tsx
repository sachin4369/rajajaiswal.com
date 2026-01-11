'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: 'Premium Office Chair Parts & Components',
    description: 'Quality components for comfortable and durable office furniture. Explore our comprehensive range of products designed for modern workplaces.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80',
    gradient: 'from-black via-teal-950 to-black',
    cta1: { text: 'Explore Products', href: '/products', icon: ArrowRight },
    cta2: { text: 'Download Catalog', href: '/catalog', icon: Download },
  },
  {
    id: 2,
    title: 'Modern Cafeteria Chairs & Seating Solutions',
    description: 'Stylish and ergonomic seating solutions for modern workplaces and dining areas. Discover comfort and durability in every design.',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1600&q=80',
    gradient: 'from-teal-950 via-black to-teal-950',
    cta1: { text: 'View Collection', href: '/products/cafeteria-chairs', icon: ArrowRight },
    cta2: { text: 'Download Catalog', href: '/catalog', icon: Download },
  },
  {
    id: 3,
    title: 'Quality You Can Trust',
    description: 'Manufacturing excellence since our inception. We deliver premium office furniture components with unmatched reliability and service.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
    gradient: 'from-black via-gray-900 to-teal-950',
    cta1: { text: 'Learn More', href: '/about', icon: ArrowRight },
    cta2: { text: 'Contact Us', href: '/contact', icon: ArrowRight },
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative w-full h-[450px] md:h-[550px] overflow-hidden max-w-full">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full"
        >
          {/* Background Image with Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${currentSlide.gradient} opacity-90`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage: `url(${currentSlide.image})`,
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-3xl">
              <motion.h1
                key={`title-${currentSlide.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              >
                {currentSlide.title}
              </motion.h1>
              <motion.p
                key={`desc-${currentSlide.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed"
              >
                {currentSlide.description}
              </motion.p>
              <motion.div
                key={`cta-${currentSlide.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href={currentSlide.cta1.href}
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-md hover:bg-gray-100 transition-colors group"
                >
                  {currentSlide.cta1.text}
                  <currentSlide.cta1.icon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={currentSlide.cta2.href}
                  className="inline-flex items-center justify-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-gray-900 transition-colors group"
                >
                  {currentSlide.cta2.icon === Download && (
                    <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  )}
                  {currentSlide.cta2.text}
                  {currentSlide.cta2.icon === ArrowRight && (
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  )}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75 w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

