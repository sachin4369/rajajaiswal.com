'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const expoVideos = [
  {
    id: 'meqfktc9pto',
    embedUrl: 'https://www.youtube.com/embed/meqfktc9pto?si=uJHcgg3rphYFyHb5&start=4',
    watchUrl: 'https://www.youtube.com/watch?v=meqfktc9pto&t=4',
    title: 'RJPI as Exhibitors in INDEX – Highlights',
    description:
      "Watch highlights from RJPI's participation in INDEX (Furniture | Interior | Design), 2025 at Delhi.",
    duration: '4:36',
  },
  {
    id: '9dz_Gpuy_wM',
    embedUrl: 'https://www.youtube.com/embed/9dz_Gpuy_wM?si=I66b_U0qyiQHeQjw&start=3',
    watchUrl: 'https://www.youtube.com/watch?v=9dz_Gpuy_wM&t=3',
    title: 'RJPI – Aakar Showcase',
    description:
      'Additional highlights showcasing RJPI products and presence at Aakar expos.',
    duration: '3:30',
  },
];

export default function ExpoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-black via-teal-950 to-black py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                RJPI as Exhibitors in Expo
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
                Explore our presence at national and international furniture and manufacturing expos.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center text-sm font-semibold text-teal-200 hover:text-white"
            >
              Back to Home
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Videos grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {expoVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200"
              >
                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    className="w-full h-full"
                    src={video.embedUrl ?? `https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {video.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {video.description}
                  </p>
                  <a
                    href={video.watchUrl ?? `https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-teal-600 hover:text-teal-700"
                  >
                    Watch on YouTube
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


