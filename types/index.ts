export interface Product {
  id: string;
  name: string;
  description?: string;
  image: string;
  price?: number;
  category: string;
  specifications?: Record<string, string>;
  features?: string[];
  // Allow additional fields from API
  [key: string]: any;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company?: string;
  message: string;
  rating: number;
  image?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  mobile: string;
  message: string;
}

