import { Product } from '../types/product';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_venice_gold',
    slug: 'venice-gold',
    title: 'Venice Gold Master Suite',
    tagline: 'Warm golden hour cinema tones calibrated for Sony FX3/FX6 and ARRI LogC',
    description:
      'Engineered for narrative cinematography and prestige commercial productions. Venice Gold maps high-dynamic range Log recordings into smooth filmic skin tones, rich golden highlights, and clean rolloff inspired by modern Hollywood master prints.',
    price: 49,
    originalPrice: 79,
    category: 'Cinema',
    supportedCameras: ['Sony S-Log3', 'ARRI LogC', 'Apple Log'],
    lutCount: 12,
    badge: 'BEST SELLER',
    isFeatured: true,
    rating: 4.9,
    reviewsCount: 142,
    beforeImageUrl:
      'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1200&q=80',
    afterImageUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    techSpecs: {
      cameraCurves: ['Sony S-Log3 / S-Gamut3.Cine', 'ARRI LogC3 / LogC4', 'Apple Log Rec.709'],
      colorSpace: 'Rec.709 & DCI-P3 Target',
      fileFormats: ['.CUBE (33x33x33 & 65x65x65)'],
      packageSize: '148 MB',
      lutCount: 12,
    },
  },
  {
    id: 'prod_tokyo_neon',
    slug: 'tokyo-neon',
    title: 'Tokyo Neon Cyber Grade',
    tagline: 'Vibrant high-contrast cyberpunk grade with teal and magenta shadows',
    description:
      'Designed for nighttime urban shoots, music videos, and fashion films. Tokyo Neon separates sodium vapor street lighting and LED signs while preserving natural skin tones under complex colored lighting environments.',
    price: 39,
    originalPrice: 59,
    category: 'Sci-Fi',
    supportedCameras: ['Sony S-Log3', 'RED IPP2', 'Apple Log'],
    lutCount: 8,
    badge: 'NEW',
    isFeatured: true,
    rating: 4.8,
    reviewsCount: 98,
    beforeImageUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    afterImageUrl:
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80',
    techSpecs: {
      cameraCurves: ['Sony S-Log3', 'RED IPP2 Wide Gamut', 'Apple Log'],
      colorSpace: 'Rec.709 Cinema Standard',
      fileFormats: ['.CUBE', '.VLT'],
      packageSize: '95 MB',
      lutCount: 8,
    },
  },
  {
    id: 'prod_nordic_mood',
    slug: 'nordic-mood',
    title: 'Nordic Mood & Melancholy',
    tagline: 'Desaturated cold cyan undertones and clean highlights for narrative storytelling',
    description:
      'Subtle, moody, and deeply evocative. Nordic Mood pulls back harsh saturation and replaces digital warmth with atmospheric steel blues and Scandinavian cinema grade tones.',
    price: 45,
    originalPrice: 65,
    category: 'Cinema',
    supportedCameras: ['ARRI LogC', 'BMPCC Gen 5', 'RED IPP2'],
    lutCount: 10,
    badge: 'STAFF PICK',
    isFeatured: false,
    rating: 4.9,
    reviewsCount: 112,
    beforeImageUrl:
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80',
    afterImageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    techSpecs: {
      cameraCurves: ['ARRI LogC3/C4', 'Blackmagic Film Gen 5', 'RED IPP2'],
      colorSpace: 'Rec.709 Gamma 2.4',
      fileFormats: ['.CUBE 33x'],
      packageSize: '110 MB',
      lutCount: 10,
    },
  },
  {
    id: 'prod_desert_nomad',
    slug: 'desert-nomad',
    title: 'Desert Nomad Kodak 2383',
    tagline: 'Authentic Kodak 2383 film stock emulation with organic grain response',
    description:
      'Meticulously profiled against original 35mm motion picture print stock. Delivers the signature warm split-toning, deep shadow contrast, and creamy highlights of classic cinema photochemical processing.',
    price: 55,
    originalPrice: 85,
    category: 'Vintage',
    supportedCameras: ['Sony S-Log3', 'ARRI LogC', 'BMPCC Gen 5', 'Apple Log'],
    lutCount: 16,
    badge: 'PRO PACK',
    isFeatured: true,
    rating: 5.0,
    reviewsCount: 230,
    beforeImageUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    afterImageUrl:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    techSpecs: {
      cameraCurves: ['All major Log profiles', 'Linear / Rec.709 conversion'],
      colorSpace: 'DCI-P3 & Rec.709',
      fileFormats: ['.CUBE', '.LOOK'],
      packageSize: '190 MB',
      lutCount: 16,
    },
  },
  {
    id: 'prod_matrix_monochrome',
    slug: 'matrix-monochrome',
    title: 'Silver Halide Monochrome',
    tagline: 'High dynamic range black and white film simulation for cinematic drama',
    description:
      'Not a simple desaturation filter. Silver Halide calculates optical spectral curves to mimic panchromatic silver gelatin emulsions, retaining rich shadow detail and crisp contrast.',
    price: 35,
    originalPrice: 49,
    category: 'Vintage',
    supportedCameras: ['All'],
    lutCount: 6,
    badge: undefined,
    isFeatured: false,
    rating: 4.7,
    reviewsCount: 76,
    beforeImageUrl:
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    afterImageUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
    techSpecs: {
      cameraCurves: ['Universal Log to B&W Curve'],
      colorSpace: 'Monochrome Grayscale / Rec.709',
      fileFormats: ['.CUBE'],
      packageSize: '65 MB',
      lutCount: 6,
    },
  },
  {
    id: 'prod_pacific_teal',
    slug: 'pacific-teal',
    title: 'Pacific Coast Commercial',
    tagline: 'Clean editorial skin tones with deep ocean teal skies for commercial & travel',
    description:
      'The modern commercial standard. Gives outdoor, lifestyle, and automotive cinematography the sun-drenched look of high-end global advertising campaigns.',
    price: 42,
    originalPrice: 60,
    category: 'Commercial',
    supportedCameras: ['Sony S-Log3', 'Apple Log', 'Canon C-Log2'],
    lutCount: 9,
    badge: 'POPULAR',
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 154,
    beforeImageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    afterImageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    techSpecs: {
      cameraCurves: ['Sony S-Log3', 'Canon C-Log2/C-Log3', 'Apple Log'],
      colorSpace: 'Rec.709 Standard',
      fileFormats: ['.CUBE (33x & 65x)'],
      packageSize: '105 MB',
      lutCount: 9,
    },
  },
  {
    id: 'prod_havana_sunset',
    slug: 'havana-sunset',
    title: 'Havana Sunset Analog',
    tagline: 'Warm street photography palette with saturated amber highlights and dusty greens',
    description:
      'Inspired by vintage Caribbean travel photography. Enhances golden hour sunsets, retro architectural textures, and natural skin tones with warmth and charm.',
    price: 39,
    originalPrice: 55,
    category: 'Vintage',
    supportedCameras: ['Sony S-Log3', 'BMPCC Gen 5', 'Apple Log'],
    lutCount: 8,
    badge: undefined,
    isFeatured: false,
    rating: 4.8,
    reviewsCount: 88,
    beforeImageUrl:
      'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1200&q=80',
    afterImageUrl:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    techSpecs: {
      cameraCurves: ['Universal Rec.709 & Log'],
      colorSpace: 'Rec.709',
      fileFormats: ['.CUBE'],
      packageSize: '82 MB',
      lutCount: 8,
    },
  },
  {
    id: 'prod_cyberpunk_2088',
    slug: 'cyberpunk-2088',
    title: 'Neo Noir Night Grade',
    tagline: 'Blade Runner aesthetic with emerald shadows and burning neon signage highlights',
    description:
      'High-impact sci-fi aesthetic for dark, rain-soaked cityscapes and night portraits. Dramatic contrast curve with lifted black levels and vivid complementary cyan/amber tonality.',
    price: 49,
    originalPrice: 69,
    category: 'Sci-Fi',
    supportedCameras: ['RED IPP2', 'ARRI LogC', 'Sony S-Log3'],
    lutCount: 14,
    badge: 'PRO PACK',
    isFeatured: false,
    rating: 4.9,
    reviewsCount: 165,
    beforeImageUrl:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    afterImageUrl:
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80',
    techSpecs: {
      cameraCurves: ['RED Wide Gamut RGB', 'ARRI LogC3/LogC4', 'Sony S-Log3'],
      colorSpace: 'DCI-P3 Target',
      fileFormats: ['.CUBE (65x)'],
      packageSize: '160 MB',
      lutCount: 14,
    },
  },
];
