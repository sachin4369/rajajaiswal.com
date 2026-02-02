import { Product } from '@/types';

// Try multiple possible base URLs
const API_BASE_OPTIONS = [
  'https://raw.githubusercontent.com/sachin4369/api/refs/heads/main/chairparts', // Prioritize refs/heads/main
  'https://raw.githubusercontent.com/sachin4369/api/main/chairparts',
  'https://github.com/sachin4369/api/raw/main/chairparts',
  'https://raw.githubusercontent.com/sachin4369/api/master/chairparts', // Try master branch too
];

const API_BASE = API_BASE_OPTIONS[0]; // Use first option as default

// Helper function to normalize a single product - handles different field names
function normalizeProduct(p: any, index: number, category: string): Product | null {
  if (!p || typeof p !== 'object') {
    return null;
  }
  
  // Try to find ID in various possible field names - use stable generation
  const originalId = p.id || p.ID || p._id || p.productId || p.product_id || 
                     p.sku || p.SKU || p.code || p.itemId;
  
  // Generate stable ID based on category, index, and name if no ID exists
  // Use Name field like other pages, but for tables use ModelNo only (remove "Cafeteria Table")
  let name = p.name || p.Name || p.title || p.Title || p.productName || 
             p.product_name || p.itemName || 'Unnamed Product';
  
  // For table products, use ModelNo only (remove "Cafeteria Table" prefix)
  if (category === 'table' && (p.ModelNo || p.modelNo || p.model_no)) {
    const modelNo = p.ModelNo || p.modelNo || p.model_no;
    // Use ModelNo only, not "Cafeteria Table - ModelNo"
    name = modelNo;
  }
  
  const id = originalId || `${category}-${index}-${String(name).toLowerCase().replace(/\s+/g, '-').substring(0, 50)}`;
  
  // Try to find image in various possible field names (check more variations)
  // Use the image URL/name exactly as provided by the API
  // IMPORTANT: Check Url/URL fields - API might use Url for image paths
  let image = p.image || p.img || p.imageUrl || p.image_url || 
              p.photo || p.picture || p.thumbnail || p.thumb ||
              p.Image || p.Img || p.ImageUrl || p.Image_URL ||
              p.Photo || p.Picture || p.Thumbnail || p.Thumb ||
              p.imageName || p.image_name || p.imgName || p.photoName ||
              // Check Url/URL fields - if they contain image paths, use them
              ((p.Url || p.URL) && typeof (p.Url || p.URL) === 'string' && 
               ((p.Url || p.URL).includes('/images/') || 
                (p.Url || p.URL).match(/\.(png|jpg|jpeg|gif|webp|PNG|JPG|JPEG|GIF|WEBP)$/i))) ? (p.Url || p.URL) :
              undefined;
  
  // If not found in common fields, check ALL fields for image-related names
  if (!image) {
    const allKeys = Object.keys(p);
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.PNG', '.JPG', '.JPEG', '.GIF', '.WEBP'];
    
    // Check for any field that might contain image data
    for (const key of allKeys) {
      const lowerKey = key.toLowerCase();
      const value = p[key];
      
      // Skip if not a string
      if (typeof value !== 'string' || !value.trim()) continue;
      
      const trimmedValue = value.trim();
      
      // Check if key contains image-related words OR if value looks like an image path
      if (lowerKey.includes('img') || lowerKey.includes('image') || 
          lowerKey.includes('photo') || lowerKey.includes('picture') ||
          lowerKey.includes('thumb') || lowerKey.includes('pic') ||
          lowerKey === 'url' || lowerKey === 'urls') {
        // If it's a Url/URL field, only use if it contains image path
        if ((lowerKey === 'url' || lowerKey === 'urls') && 
            !trimmedValue.includes('/images/') && 
            !imageExtensions.some(ext => trimmedValue.endsWith(ext))) {
          continue; // Skip Url fields that don't look like images
        }
        image = trimmedValue;
        console.log(`Found image in field "${key}": ${image}`);
        break;
      }
      
      // Also check if value itself looks like an image path (even if field name doesn't)
      if (trimmedValue.includes('/images/') || 
          imageExtensions.some(ext => trimmedValue.endsWith(ext))) {
        image = trimmedValue;
        console.log(`Found image path in field "${key}": ${image}`);
        break;
      }
    }
  }
  
  // For mesh and aremrest-pp-base products, also check ALL string fields that might be image filenames
  // (sometimes APIs use generic field names like "file", "src", "path", etc.)
  if (!image && (category === 'mesh' || category === 'aremrest-pp-base')) {
    const allKeys = Object.keys(p);
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.PNG', '.JPG', '.JPEG', '.GIF', '.WEBP'];
    const excludedKeys = ['name', 'description', 'id', 'price', 'category', 'specifications', 'features', 'url', 'link', 'title', 'desc', 'details'];
    
    // First, check for fields ending with image extensions
    for (const key of allKeys) {
      const lowerKey = key.toLowerCase();
      if (excludedKeys.includes(lowerKey)) continue;
      
      const value = p[key];
      if (typeof value === 'string' && value.trim()) {
        const trimmedValue = value.trim();
        // Priority: fields ending with image extensions
        if (imageExtensions.some(ext => trimmedValue.endsWith(ext))) {
          image = trimmedValue;
          console.log(`Mesh: Found image (by extension) in field "${key}": ${image}`);
          break;
        }
      }
    }
    
    // If still not found, check for any string field that might be an image path
    if (!image) {
      for (const key of allKeys) {
        const lowerKey = key.toLowerCase();
        if (excludedKeys.includes(lowerKey)) continue;
        
        const value = p[key];
        if (typeof value === 'string' && value.trim()) {
          const trimmedValue = value.trim();
          // Check if it contains image-related paths or looks like a filename
          if (trimmedValue.includes('/images/') || 
              trimmedValue.includes('/image') ||
              trimmedValue.startsWith('image') ||
              (trimmedValue.length < 200 && trimmedValue.length > 3 && 
               !trimmedValue.includes(' ') && // No spaces (likely a filename)
               trimmedValue.match(/^[a-zA-Z0-9._-]+$/))) { // Looks like a filename
            image = trimmedValue;
            console.log(`Mesh: Found potential image (by pattern) in field "${key}": ${image}`);
            break;
          }
        }
      }
    }
    
    // Last resort: use ANY string field that's not excluded (except very long ones)
    if (!image) {
      for (const key of allKeys) {
        const lowerKey = key.toLowerCase();
        if (excludedKeys.includes(lowerKey)) continue;
        
        const value = p[key];
        if (typeof value === 'string' && value.trim()) {
          const trimmedValue = value.trim();
          // Use any reasonable-length string that's not obviously text
          if (trimmedValue.length > 3 && trimmedValue.length < 100 && 
              !trimmedValue.includes(' ') && // No spaces
              trimmedValue.match(/^[a-zA-Z0-9._/-]+$/)) { // Looks like a path/filename
            image = trimmedValue;
            console.log(`Mesh: Found potential image (last resort) in field "${key}": ${image}`);
            break;
          }
        }
      }
    }
  }
  
  // Special handling for mesh and aremrest-pp-base categories - log all possible image fields and ALL keys
  if (category === 'mesh' || category === 'aremrest-pp-base') {
    console.log(`${category} product "${name}" - Full product object keys:`, Object.keys(p));
    console.log(`${category} product "${name}" - Checking for image fields:`, {
      image: p.image,
      img: p.img,
      imageUrl: p.imageUrl,
      image_url: p.image_url,
      photo: p.photo,
      picture: p.picture,
      thumbnail: p.thumbnail,
      thumb: p.thumb,
      Url: p.Url,
      URL: p.URL,
      allImageKeys: Object.keys(p).filter(k => {
        const lowerK = k.toLowerCase();
        return lowerK.includes('img') || lowerK.includes('image') || 
               lowerK.includes('photo') || lowerK.includes('picture') ||
               lowerK.includes('thumb') || lowerK.includes('pic');
      }),
      allKeys: Object.keys(p)
    });
    // Log the full product object for debugging (first product only to avoid spam)
    if (index === 0) {
      console.log(`${category} product "${name}" - Full product object (first product):`, JSON.stringify(p, null, 2));
    }
  }
  
  // Use image EXACTLY as provided by API - preserve the URL/path as-is
  let normalizedImage: string | undefined = undefined;
  
  if (image) {
    // Clean up the image path (remove any whitespace)
    const cleanedImage = image.trim();
    
    // If it's already a full URL (http/https), keep it EXACTLY as provided
    if (cleanedImage.startsWith('http://') || cleanedImage.startsWith('https://')) {
      // Keep external URLs exactly as provided from API
      normalizedImage = cleanedImage;
      console.log(`[${category}] Using external URL from API (exact): ${normalizedImage}`);
    }
    // If it starts with /, preserve the path EXACTLY as-is (API knows the correct path)
    else if (cleanedImage.startsWith('/')) {
      // Keep the path exactly as provided by API - don't modify
      normalizedImage = cleanedImage;
      console.log(`[${category}] Using image path from API (exact): ${normalizedImage}`);
    }
    // If it's just a filename (no path), prepend /images/ for local files
    else {
      // Only normalize if it's a plain filename without path
      normalizedImage = `/images/${cleanedImage}`;
      console.log(`[${category}] Normalized plain filename to: ${normalizedImage}`);
    }
  } else {
    // No image found in API - don't set placeholder here, let components handle it
    console.log(`[${category}] No image field found in API for "${name}"`);
  }
  
  // Log final image path for debugging
  if (normalizedImage) {
    console.log(`[${category}] Product "${name}" - Final image path (from API): ${normalizedImage}`);
  }
  
  // Try to find price
  const price = p.price || p.Price || p.cost || p.Cost || p.amount || undefined;
  
  // Try to find description - use same logic as other pages
  let description = p.description || p.Description || p.desc || p.details || undefined;
  
  // For table products, don't auto-generate description - let it be empty or use API description only
  // This matches the user's request to remove the "Table • Wooden • Meta Powder Coated Frame" type descriptions
  
  // Create normalized product with all original fields preserved
  // IMPORTANT: Spread p first, then override with normalized values
  // Only set image if we found one - preserve original API fields for fallback
  const normalized: Product = {
    // Preserve all original fields from API first (including original image fields)
    ...p,
    // Override with normalized values
    id: String(id),
    name: String(name),
    description,
    // Only set normalized image if we found one - otherwise keep original API fields for component fallback
    ...(normalizedImage ? { image: normalizedImage } : {}),
    price: price ? Number(price) : undefined,
    category,
    specifications: p.specifications || p.specs || undefined,
    features: p.features || p.feature || (Array.isArray(p.feature) ? p.feature : undefined),
  };
  
  console.log(`Final image path for "${name}" (category: ${category}):`, normalized.image || 'none (will check original API fields)');
  console.log(`Original image field from API:`, p.image || p.img || p.imageUrl || p.image_url || 'none found');
  
  // For mesh and aremrest-pp-base products, show detailed image extraction info
  if (category === 'mesh' || category === 'aremrest-pp-base') {
    console.log(`✓ ${category} product "${name}" - Final image will be: ${normalized.image || 'none (checking original API fields)'}`);
    if (!normalized.image || normalized.image === '/placeholder.svg') {
      console.warn(`⚠️ WARNING: ${category} product "${name}" has no normalized image! All product keys:`, Object.keys(p));
      console.warn(`   Original API image fields:`, {
        image: p.image,
        img: p.img,
        imageUrl: p.imageUrl,
        image_url: p.image_url,
        Url: p.Url,
        URL: p.URL,
      });
      // Log all string fields that might be images
      const stringFields = Object.entries(p)
        .filter(([k, v]) => typeof v === 'string' && v.trim())
        .map(([k, v]) => `${k}: "${v.substring(0, 50)}${v.length > 50 ? '...' : ''}"`);
      if (stringFields.length > 0) {
        console.warn(`   All string fields in product:`, stringFields);
      }
    }
  }
  
  return normalized;
}

// Helper function to normalize API response data
function normalizeProducts(data: any): Product[] {
  console.log('normalizeProducts called with:', typeof data, Array.isArray(data) ? `array[${data.length}]` : 'object');
  
  if (!data) {
    console.warn('normalizeProducts: data is null or undefined');
    return [];
  }
  
  if (Array.isArray(data)) {
    console.log('Data is already an array, length:', data.length);
    const filtered = data.filter(item => item && typeof item === 'object');
    console.log('After filtering invalid items:', filtered.length);
    return filtered;
  }
  
  if (data && typeof data === 'object') {
    console.log('Data is an object, checking for array properties...');
    console.log('Object keys:', Object.keys(data));
    
    // Try common property names
    const commonKeys = ['products', 'items', 'data', 'results', 'chairs', 'tables', 'plastic', 'cafe', 'mesh', 'table', 'lounge', 'cafeteria'];
    
    for (const key of commonKeys) {
      if (data[key] && Array.isArray(data[key])) {
        console.log(`✓ Found array in property: ${key}, length: ${data[key].length}`);
        return data[key];
      }
    }
    
    // Find any array property
    const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
    if (arrayKey) {
      console.log(`✓ Found array in property: ${arrayKey}, length: ${data[arrayKey].length}`);
      return data[arrayKey];
    }
    
    console.warn('normalizeProducts: data is an object but no array property found.');
    console.warn('All keys:', Object.keys(data));
    console.warn('Sample values:', Object.keys(data).slice(0, 5).map(k => `${k}: ${typeof data[k]}`));
  }
  
  console.warn('normalizeProducts: unexpected data type:', typeof data);
  return [];
}

// Helper function to try multiple API base URLs
async function fetchWithFallback(fileName: string): Promise<Response | null> {
  for (const base of API_BASE_OPTIONS) {
    try {
      const url = `${base}/${fileName}`;
      console.log(`Trying URL: ${url}`);
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log(`✓ Success with URL: ${url}`);
        return response;
      } else {
        console.warn(`✗ Failed with URL: ${url} - Status: ${response.status}`);
      }
    } catch (error) {
      console.warn(`✗ Error with URL: ${base}/${fileName}`, error);
    }
  }
  
  return null;
}

export async function fetchPlasticChairs(): Promise<Product[]> {
  try {
    console.log('=== Fetching Plastic Chairs ===');
    const response = await fetchWithFallback('plastic.json');
    
    if (!response) {
      console.error('All API URL attempts failed for plastic.json');
      return [];
    }
    
    console.log('✅ Response OK, parsing JSON...');
    const text = await response.text();
    console.log('Raw response text (first 500 chars):', text.substring(0, 500));
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.error('Full response text:', text);
      return [];
    }
    
    console.log('✅ JSON parsed successfully');
    console.log('Data type:', typeof data);
    console.log('Is array?', Array.isArray(data));
    
    if (data && typeof data === 'object') {
      console.log('Data keys:', Object.keys(data));
      if (Object.keys(data).length > 0) {
        console.log('First key value type:', typeof data[Object.keys(data)[0]]);
        if (Array.isArray(data[Object.keys(data)[0]])) {
          console.log('First key array length:', data[Object.keys(data)[0]].length);
        }
      }
    }
    
    const products = normalizeProducts(data);
    console.log('After normalization, products count:', products.length);
    
    if (products.length > 0) {
      console.log('✅ First product sample:', JSON.stringify(products[0], null, 2));
      console.log('Product keys:', Object.keys(products[0]));
    } else {
      console.warn('⚠️ No products after normalization');
      console.warn('Raw data structure:', JSON.stringify(data, null, 2).substring(0, 1000));
    }
    
    // Normalize products - handle different field names and generate IDs if needed
    const validProducts = products
      .map((p, index) => normalizeProduct(p, index, 'plastic'))
      .filter((p): p is Product => p !== null);
    
    console.log('✅ Valid products after normalization:', validProducts.length);
    
    if (validProducts.length > 0) {
      console.log('✅ Sample normalized product:', validProducts[0]);
    }
    
    return validProducts;
  } catch (error) {
    console.error('Error fetching plastic chairs:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return [];
  }
}

export async function fetchCafeChairs(): Promise<Product[]> {
  try {
    console.log('=== Fetching Cafe Chairs ===');
    const response = await fetchWithFallback('cafe.json');
    
    if (!response) {
      console.error('All API URL attempts failed for cafe.json');
      return [];
    }
    
    console.log('Cafe chairs response status:', response.status, response.statusText);
    const data = await response.json();
    console.log('Cafe chairs raw data type:', typeof data, Array.isArray(data) ? 'array' : 'object');
    console.log('Cafe chairs raw data:', JSON.stringify(data).substring(0, 500));
    
    const products = normalizeProducts(data);
    console.log('Cafe chairs normalized products:', products.length);
    
    if (products.length > 0) {
      console.log('Sample cafe chair product:', products[0]);
    }
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'cafe'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching cafe chairs:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return [];
  }
}

export async function fetchCafeteriaChairs(): Promise<Product[]> {
  try {
    console.log('=== Fetching Cafeteria Chairs ===');
    const response = await fetchWithFallback('cafeteria.json');
    
    if (!response) {
      console.error('All API URL attempts failed for cafeteria.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('Cafeteria chairs loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'cafeteria'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching cafeteria chairs:', error);
    return [];
  }
}

export async function fetchMeshBack(): Promise<Product[]> {
  try {
    console.log('=== Fetching Mesh Back ===');
    const response = await fetchWithFallback('mesh.json');
    
    if (!response) {
      console.error('All API URL attempts failed for mesh.json');
      return [];
    }
    
    console.log('Mesh back response status:', response.status, response.statusText);
    const data = await response.json();
    console.log('Mesh back raw data type:', typeof data, Array.isArray(data) ? 'array' : 'object');
    console.log('Mesh back raw data (first 1000 chars):', JSON.stringify(data).substring(0, 1000));
    
    const products = normalizeProducts(data);
    console.log('Mesh back normalized products:', products.length);
    
    if (products.length > 0) {
      console.log('=== Sample mesh product (BEFORE normalization) ===');
      console.log('Sample mesh product:', JSON.stringify(products[0], null, 2));
      console.log('Sample mesh product keys:', Object.keys(products[0]));
      console.log('Sample mesh product image field:', products[0]?.image);
      // Log ALL string fields
      console.log('All string fields in sample product:');
      Object.keys(products[0]).forEach(key => {
        const value = products[0][key];
        if (typeof value === 'string') {
          console.log(`  - ${key}: "${value}"`);
        }
      });
    }
    
    const normalizedProducts = products
      .map((p, index) => {
        const normalized = normalizeProduct(p, index, 'mesh');
        if (normalized) {
          console.log(`Mesh product ${index} - Name: "${normalized.name}", Image: "${normalized.image}"`);
          if (normalized.image === '/placeholder.svg') {
            console.warn(`⚠️ Product ${index} "${normalized.name}" has NO IMAGE!`);
            console.warn(`   Original product keys:`, Object.keys(p));
            console.warn(`   Original product values:`, Object.entries(p).map(([k, v]) => `${k}: ${typeof v === 'string' ? `"${v}"` : v}`).join(', '));
          }
        }
        return normalized;
      })
      .filter((p): p is Product => p !== null);
    
    console.log('Mesh back final products:', normalizedProducts.length);
    if (normalizedProducts.length > 0) {
      console.log('First mesh product final image:', normalizedProducts[0].image);
      console.log('First mesh product full object:', JSON.stringify(normalizedProducts[0], null, 2));
    }
    
    return normalizedProducts;
  } catch (error) {
    console.error('Error fetching mesh back:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return [];
  }
}

export async function fetchCafeteriaTables(): Promise<Product[]> {
  try {
    console.log('=== Fetching Cafeteria Tables ===');
    // Use the specific endpoint: https://raw.githubusercontent.com/sachin4369/api/refs/heads/main/chairparts/table.json
    const tableUrl = 'https://raw.githubusercontent.com/sachin4369/api/refs/heads/main/chairparts/table.json';
    console.log(`Fetching from: ${tableUrl}`);
    
    const response = await fetch(tableUrl, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch table.json: ${response.status} ${response.statusText}`);
      // Fallback to other URLs
      const fallbackResponse = await fetchWithFallback('table.json');
      if (!fallbackResponse) {
        console.error('All API URL attempts failed for table.json');
        return [];
      }
      const data = await fallbackResponse.json();
      const products = normalizeProducts(data);
      console.log('Cafeteria tables loaded (fallback):', products.length);
      return products
        .map((p, index) => normalizeProduct(p, index, 'table'))
        .filter((p): p is Product => p !== null);
    }
    
    const data = await response.json();
    console.log('Cafeteria tables raw data:', JSON.stringify(data).substring(0, 500));
    const products = normalizeProducts(data);
    console.log('Cafeteria tables loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'table'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching cafeteria tables:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return [];
  }
}

export async function fetchLoungeChairs(): Promise<Product[]> {
  try {
    console.log('=== Fetching Lounge Chairs ===');
    const response = await fetchWithFallback('lounge.json');
    
    if (!response) {
      console.error('All API URL attempts failed for lounge.json');
      return [];
    }
    
    const data = await response.json();
    console.log('Lounge chairs raw data:', JSON.stringify(data).substring(0, 500));
    const products = normalizeProducts(data);
    console.log('Lounge chairs loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'lounge'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching lounge chairs:', error);
    return [];
  }
}

export async function fetchCafeBarCounterChair(): Promise<Product[]> {
  try {
    console.log('=== Fetching Cafe Bar Counter Chair ===');
    const response = await fetchWithFallback('cafe-bar-counter.json');
    
    if (!response) {
      console.error('All API URL attempts failed for cafe-bar-counter.json');
      return [];
    }
    
    const data = await response.json();
    console.log('Cafe bar counter chair raw data:', JSON.stringify(data).substring(0, 500));
    const products = normalizeProducts(data);
    console.log('Cafe bar counter chair loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'cafe-bar-counter'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching cafe bar counter chair:', error);
    return [];
  }
}

export async function fetchSchoolDeskInstituteWritingChair(): Promise<Product[]> {
  try {
    console.log('=== Fetching School Desk & Institute Writing Chair ===');
    const response = await fetchWithFallback('school-desk.json');
    
    if (!response) {
      console.error('All API URL attempts failed for school-desk.json');
      return [];
    }
    
    const data = await response.json();
    console.log('School desk & institute writing chair raw data:', JSON.stringify(data).substring(0, 500));
    const products = normalizeProducts(data);
    console.log('School desk & institute writing chair loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'school-desk'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching school desk & institute writing chair:', error);
    return [];
  }
}

export async function fetchCafePlasticTopShell(): Promise<Product[]> {
  try {
    console.log('=== Fetching Cafe Plastic Top Shell ===');
    const response = await fetchWithFallback('cafe-plastic-shell.json');
    
    if (!response) {
      console.error('All API URL attempts failed for cafe-plastic-shell.json');
      return [];
    }
    
    const data = await response.json();
    console.log('Cafe plastic top shell raw data:', JSON.stringify(data).substring(0, 500));
    const products = normalizeProducts(data);
    console.log('Cafe plastic top shell loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'cafe-plastic-shell'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching cafe plastic top shell:', error);
    return [];
  }
}

export async function fetchChairPlasticLeg(): Promise<Product[]> {
  try {
    console.log('=== Fetching Chair Plastic Leg ===');
    const response = await fetchWithFallback('chair-plastic-leg.json');
    
    if (!response) {
      console.error('All API URL attempts failed for chair-plastic-leg.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('Chair Plastic Leg loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'chair-plastic-leg'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching chair plastic leg:', error);
    return [];
  }
}

export async function fetchSchoolDeskPartsComponents(): Promise<Product[]> {
  try {
    console.log('=== Fetching School Desk Parts Components ===');
    const response = await fetchWithFallback('school-desk-parts.json');
    
    if (!response) {
      console.error('All API URL attempts failed for school-desk-parts.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('School Desk Parts Components loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'school-desk-parts'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching school desk parts components:', error);
    return [];
  }
}

export async function fetchSleekChairAccessories(): Promise<Product[]> {
  try {
    console.log('=== Fetching Sleek Chair Accessories ===');
    const response = await fetchWithFallback('sleek-chair-accessories.json');
    
    if (!response) {
      console.error('All API URL attempts failed for sleek-chair-accessories.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('Sleek Chair Accessories loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'sleek-chair-accessories'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching sleek chair accessories:', error);
    return [];
  }
}

export async function fetchChairSeatBackPlasticFibre(): Promise<Product[]> {
  try {
    console.log('=== Fetching Chair Seat & Back Plastic & Fibre ===');
    const response = await fetchWithFallback('chair-seat-back.json');
    
    if (!response) {
      console.error('All API URL attempts failed for chair-seat-back.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('Chair Seat & Back Plastic & Fibre loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'chair-seat-back'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching chair seat & back plastic & fibre:', error);
    return [];
  }
}

export async function fetchChairHandleBaseNylon(): Promise<Product[]> {
  try {
    console.log('=== Fetching Chair Handle & Base Nylon ===');
    const response = await fetchWithFallback('chair-handle-base.json');
    
    if (!response) {
      console.error('All API URL attempts failed for chair-handle-base.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('Chair Handle & Base Nylon loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'chair-handle-base'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching chair handle & base nylon:', error);
    return [];
  }
}

export async function fetchIronBase(): Promise<Product[]> {
  try {
    console.log('=== Fetching Iron Base ===');
    const response = await fetchWithFallback('iron-base.json');
    
    if (!response) {
      console.error('All API URL attempts failed for iron-base.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('Iron Base loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'iron-base'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching iron base:', error);
    return [];
  }
}

export async function fetchChairMeshSeries(): Promise<Product[]> {
  try {
    console.log('=== Fetching Chair Mesh Series ===');
    const response = await fetchWithFallback('chair-mesh-series.json');
    
    if (!response) {
      console.error('All API URL attempts failed for chair-mesh-series.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('Chair Mesh Series loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'chair-mesh-series'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching chair mesh series:', error);
    return [];
  }
}

export async function fetchChairMechanism(): Promise<Product[]> {
  try {
    console.log('=== Fetching Chair Mechanism ===');
    const response = await fetchWithFallback('chair-mechanism.json');
    
    if (!response) {
      console.error('All API URL attempts failed for chair-mechanism.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('Chair Mechanism loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'chair-mechanism'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching chair mechanism:', error);
    return [];
  }
}

export async function fetchFittingAccessories(): Promise<Product[]> {
  try {
    console.log('=== Fetching Fitting & Accesories ===');
    const response = await fetchWithFallback('fitting-accessories.json');
    
    if (!response) {
      console.error('All API URL attempts failed for fitting-accessories.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('Fitting & Accesories loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'fitting-accessories'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching fitting & accessories:', error);
    return [];
  }
}

export async function fetchChairParts(): Promise<Product[]> {
  try {
    console.log('=== Fetching Chair Parts ===');
    const response = await fetchWithFallback('chairparts.json');
    
    if (!response) {
      console.error('All API URL attempts failed for chairparts.json');
      return [];
    }
    
    const data = await response.json();
    console.log('Chair parts raw data:', JSON.stringify(data).substring(0, 500));
    const products = normalizeProducts(data);
    console.log('Chair parts loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'chairparts'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching chair parts:', error);
    return [];
  }
}

export async function fetchAdjustableHandle(): Promise<Product[]> {
  try {
    console.log('=== Fetching Adjustable Handle ===');
    const response = await fetchWithFallback('adjustable-handle.json');
    
    if (!response) {
      console.error('All API URL attempts failed for adjustable-handle.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('Adjustable Handle loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'adjustable-handle'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching adjustable handle:', error);
    return [];
  }
}

export async function fetchAremrestPPBase(): Promise<Product[]> {
  try {
    console.log('=== Fetching PP Armrest ===');
    
    // Use the specific URL provided
    const specificUrl = 'https://raw.githubusercontent.com/sachin4369/api/refs/heads/main/chairparts/pparms.json';
    
    try {
      console.log(`Trying specific URL: ${specificUrl}`);
      const response = await fetch(specificUrl, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log(`✓ Success with specific URL: ${specificUrl}`);
        const data = await response.json();
        const products = normalizeProducts(data);
        console.log('PP Armrest loaded:', products.length);
        
        return products
          .map((p, index) => normalizeProduct(p, index, 'aremrest-pp-base'))
          .filter((p): p is Product => p !== null);
      } else {
        console.warn(`✗ Failed with specific URL: ${specificUrl} - Status: ${response.status}`);
      }
    } catch (error) {
      console.warn(`✗ Error with specific URL: ${specificUrl}`, error);
    }
    
    // Fallback to original method if specific URL fails
    const response = await fetchWithFallback('aremrest-pp-base.json');
    
    if (!response) {
      console.error('All API URL attempts failed for PP Armrest');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('PP Armrest loaded (fallback):', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'aremrest-pp-base'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching PP Armrest:', error);
    return [];
  }
}

export async function fetchWheels(): Promise<Product[]> {
  try {
    console.log('=== Fetching Wheels ===');
    const response = await fetchWithFallback('wheels.json');
    
    if (!response) {
      console.error('All API URL attempts failed for wheels.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('Wheels loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'wheels'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching wheels:', error);
    return [];
  }
}

export async function fetchInnerOuter(): Promise<Product[]> {
  try {
    console.log('=== Fetching Inner Outer ===');
    
    // Use the specific URL provided
    const specificUrl = 'https://raw.githubusercontent.com/sachin4369/api/refs/heads/main/chairparts/innerouter.json';
    
    try {
      console.log(`Trying specific URL: ${specificUrl}`);
      const response = await fetch(specificUrl, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log(`✓ Success with specific URL: ${specificUrl}`);
        const data = await response.json();
        const products = normalizeProducts(data);
        console.log('Inner Outer loaded:', products.length);
        
        return products
          .map((p, index) => normalizeProduct(p, index, 'inner-outer'))
          .filter((p): p is Product => p !== null);
      } else {
        console.warn(`✗ Failed with specific URL: ${specificUrl} - Status: ${response.status}`);
      }
    } catch (error) {
      console.warn(`✗ Error with specific URL: ${specificUrl}`, error);
    }
    
    // Fallback to original method if specific URL fails
    const response = await fetchWithFallback('inner-outer.json');
    
    if (!response) {
      console.error('All API URL attempts failed for Inner Outer');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('Inner Outer loaded (fallback):', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'inner-outer'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching Inner Outer:', error);
    return [];
  }
}

export async function fetchPUMouldedChair(): Promise<Product[]> {
  try {
    console.log('=== Fetching PU Moulded Chair ===');
    
    // Try multiple URL variations
    const urlVariations = [
      'https://raw.githubusercontent.com/sachin4369/api/refs/heads/main/chairparts/pumoulded.json',
      'https://raw.githubusercontent.com/sachin4369/api/main/chairparts/pumoulded.json',
      'https://raw.githubusercontent.com/sachin4369/api/refs/heads/main/chairparts/pu-moulded.json',
      'https://raw.githubusercontent.com/sachin4369/api/main/chairparts/pu-moulded.json',
    ];
    
    for (const specificUrl of urlVariations) {
      try {
        console.log(`Trying URL: ${specificUrl}`);
        const response = await fetch(specificUrl, {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          console.log(`✓ Success with URL: ${specificUrl}`);
          const data = await response.json();
          const products = normalizeProducts(data);
          console.log('PU Moulded Chair loaded:', products.length);
          
          return products
            .map((p, index) => normalizeProduct(p, index, 'pu-moulded-chair'))
            .filter((p): p is Product => p !== null);
        } else {
          console.warn(`✗ Failed with URL: ${specificUrl} - Status: ${response.status}`);
        }
      } catch (error) {
        console.warn(`✗ Error with URL: ${specificUrl}`, error);
      }
    }
    
    // Fallback to original method if all specific URLs fail
    console.log('Trying fallback methods...');
    
    // Try both filename variations in fallback
    const fallbackFilenames = ['pumoulded.json', 'pu-moulded-chair.json'];
    
    for (const filename of fallbackFilenames) {
      const fallbackResponse = await fetchWithFallback(filename);
      
      if (fallbackResponse) {
        try {
          const data = await fallbackResponse.json();
          const products = normalizeProducts(data);
          console.log(`PU Moulded Chair loaded (fallback: ${filename}):`, products.length);
          
          return products
            .map((p, index) => normalizeProduct(p, index, 'pu-moulded-chair'))
            .filter((p): p is Product => p !== null);
        } catch (error) {
          console.warn(`Failed to parse JSON from fallback ${filename}:`, error);
        }
      }
    }
    
    console.error('All API URL attempts failed for PU Moulded Chair');
    console.error('Tried specific URLs and all fallback methods');
    return [];
  } catch (error) {
    console.error('Error fetching PU Moulded Chair:', error);
    return [];
  }
}

export async function fetchPUCushions(): Promise<Product[]> {
  try {
    console.log('=== Fetching P.U. Cushions ===');
    const response = await fetchWithFallback('pu-cushions.json');
    
    if (!response) {
      console.error('All API URL attempts failed for pu-cushions.json');
      return [];
    }
    
    const data = await response.json();
    const products = normalizeProducts(data);
    console.log('P.U. Cushions loaded:', products.length);
    
    return products
      .map((p, index) => normalizeProduct(p, index, 'pu-cushions'))
      .filter((p): p is Product => p !== null);
  } catch (error) {
    console.error('Error fetching PU cushions:', error);
    return [];
  }
}

export async function fetchProductById(category: string, id: string): Promise<Product | null> {
  try {
    console.log(`=== Fetching Product by ID ===`);
    console.log(`Category: ${category}, ID: ${id}`);
    
    let products: Product[] = [];
    
    switch (category) {
      case 'plastic':
        products = await fetchPlasticChairs();
        break;
      case 'cafe':
        products = await fetchCafeChairs();
        break;
      case 'cafeteria':
        products = await fetchCafeteriaChairs();
        break;
      case 'mesh':
      case 'mesh-back':
        products = await fetchMeshBack();
        break;
      case 'table':
        products = await fetchCafeteriaTables();
        break;
      case 'lounge':
        products = await fetchLoungeChairs();
        break;
      case 'cafe-bar-counter':
        products = await fetchCafeBarCounterChair();
        break;
      case 'school-desk':
        products = await fetchSchoolDeskInstituteWritingChair();
        break;
      case 'cafe-plastic-shell':
        products = await fetchCafePlasticTopShell();
        break;
      case 'chair-plastic-leg':
        products = await fetchChairPlasticLeg();
        break;
      case 'school-desk-parts':
        products = await fetchSchoolDeskPartsComponents();
        break;
      case 'sleek-chair-accessories':
        products = await fetchSleekChairAccessories();
        break;
      case 'chair-seat-back':
        products = await fetchChairSeatBackPlasticFibre();
        break;
      case 'chair-handle-base':
        products = await fetchChairHandleBaseNylon();
        break;
      case 'iron-base':
        products = await fetchIronBase();
        break;
      case 'chair-mesh-series':
        products = await fetchChairMeshSeries();
        break;
      case 'chair-mechanism':
        products = await fetchChairMechanism();
        break;
      case 'fitting-accessories':
        products = await fetchFittingAccessories();
        break;
      case 'chairparts':
        products = await fetchChairParts();
        break;
      case 'adjustable-handle':
        products = await fetchAdjustableHandle();
        break;
      case 'aremrest-pp-base':
        products = await fetchAremrestPPBase();
        break;
      case 'wheels':
        products = await fetchWheels();
        break;
      case 'inner-outer':
        products = await fetchInnerOuter();
        break;
      case 'pu-moulded-chair':
        products = await fetchPUMouldedChair();
        break;
      case 'pu-cushions':
        products = await fetchPUCushions();
        break;
      default:
        console.warn(`Unknown category: ${category}`);
        return null;
    }
    
    console.log(`Total products loaded: ${products.length}`);
    console.log(`Looking for product with ID: ${id}`);
    console.log(`Available product IDs (first 10):`, products.slice(0, 10).map(p => p.id));
    
    // Try exact match first
    let product = products.find(p => p.id === id);
    
    // If not found, try case-insensitive match
    if (!product) {
      product = products.find(p => p.id.toLowerCase() === id.toLowerCase());
    }
    
    // If still not found, try matching by index (if ID is like "category-0-...")
    if (!product && id.includes('-')) {
      const parts = id.split('-');
      if (parts.length >= 2) {
        const index = parseInt(parts[1]);
        if (!isNaN(index) && index >= 0 && index < products.length) {
          product = products[index];
          console.log(`Found product by index: ${index}`);
        }
      }
    }
    
    if (product) {
      console.log(`✅ Product found:`, product.name);
      console.log(`Product details:`, JSON.stringify(product, null, 2));
    } else {
      console.error(`❌ Product not found with ID: ${id}`);
      console.error(`Available products:`, products.map(p => ({ id: p.id, name: p.name })));
    }
    
    return product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return null;
  }
}

// Helper function to fetch all products for a category (for navigation)
export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    let products: Product[] = [];
    
    switch (category) {
      case 'plastic':
        products = await fetchPlasticChairs();
        break;
      case 'cafe':
        products = await fetchCafeChairs();
        break;
      case 'cafeteria':
        products = await fetchCafeteriaChairs();
        break;
      case 'mesh':
      case 'mesh-back':
        products = await fetchMeshBack();
        break;
      case 'table':
        products = await fetchCafeteriaTables();
        break;
      case 'lounge':
        products = await fetchLoungeChairs();
        break;
      case 'cafe-bar-counter':
        products = await fetchCafeBarCounterChair();
        break;
      case 'school-desk':
        products = await fetchSchoolDeskInstituteWritingChair();
        break;
      case 'cafe-plastic-shell':
        products = await fetchCafePlasticTopShell();
        break;
      case 'chair-plastic-leg':
        products = await fetchChairPlasticLeg();
        break;
      case 'school-desk-parts':
        products = await fetchSchoolDeskPartsComponents();
        break;
      case 'sleek-chair-accessories':
        products = await fetchSleekChairAccessories();
        break;
      case 'chair-seat-back':
        products = await fetchChairSeatBackPlasticFibre();
        break;
      case 'chair-handle-base':
        products = await fetchChairHandleBaseNylon();
        break;
      case 'iron-base':
        products = await fetchIronBase();
        break;
      case 'chair-mesh-series':
        products = await fetchChairMeshSeries();
        break;
      case 'chair-mechanism':
        products = await fetchChairMechanism();
        break;
      case 'fitting-accessories':
        products = await fetchFittingAccessories();
        break;
      case 'chairparts':
        products = await fetchChairParts();
        break;
      case 'adjustable-handle':
        products = await fetchAdjustableHandle();
        break;
      case 'aremrest-pp-base':
        products = await fetchAremrestPPBase();
        break;
      case 'wheels':
        products = await fetchWheels();
        break;
      case 'inner-outer':
        products = await fetchInnerOuter();
        break;
      case 'pu-moulded-chair':
        products = await fetchPUMouldedChair();
        break;
      case 'pu-cushions':
        products = await fetchPUCushions();
        break;
      default:
        console.warn(`Unknown category: ${category}`);
        return [];
    }
    
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

