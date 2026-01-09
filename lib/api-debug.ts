// Debug utility to test API endpoints
// This can be called from browser console: window.testAPI('plastic')

export async function testAPIEndpoint(category: string) {
  const fileName = `${category}.json`;
  const baseUrl = 'https://raw.githubusercontent.com/sachin4369/api/main/chairparts';
  const url = `${baseUrl}/${fileName}`;
  
  console.log('=== API Debug Test ===');
  console.log('Category:', category);
  console.log('URL:', url);
  
  try {
    const response = await fetch(url, { cache: 'no-store' });
    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('❌ Response not OK');
      const text = await response.text();
      console.log('Response body (text):', text.substring(0, 500));
      return null;
    }
    
    const text = await response.text();
    console.log('Response body (text, first 1000 chars):', text.substring(0, 1000));
    
    try {
      const json = JSON.parse(text);
      console.log('✅ Valid JSON');
      console.log('JSON type:', typeof json);
      console.log('Is array?', Array.isArray(json));
      
      if (Array.isArray(json)) {
        console.log('Array length:', json.length);
        if (json.length > 0) {
          console.log('First item:', json[0]);
          console.log('First item keys:', Object.keys(json[0]));
        }
      } else if (json && typeof json === 'object') {
        console.log('Object keys:', Object.keys(json));
        for (const key of Object.keys(json)) {
          console.log(`  ${key}:`, typeof json[key], Array.isArray(json[key]) ? `array[${json[key].length}]` : '');
        }
      }
      
      return json;
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.log('Raw text:', text);
      return null;
    }
  } catch (error) {
    console.error('❌ Fetch Error:', error);
    return null;
  }
}

// Make it available globally for browser console testing
// Use useEffect in a client component instead to avoid hydration issues

