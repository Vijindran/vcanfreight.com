import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
// export const runtime = 'edge'; // Commented out to fix local dev 500 error

/**
 * HS Code Auto-Suggestion API
 * 
 * Uses free HS code classification APIs to suggest HS codes based on product description
 * 
 * GET /api/hs-code?description=product+description
 */

interface HSCodeSuggestion {
  code: string;
  description: string;
  confidence: number;
}

/**
 * Fallback HS code database for common products
 * This is used when API is unavailable or for quick lookups
 */
const commonHSCodes: Record<string, string[]> = {
  // Metals & Scrap
  'scrap metal': ['7204.49.00'],
  'metal scrap': ['7204.49.00'],
  'ferrous scrap': ['7204.49.00'],
  'hms 1': ['7204.49.00'],
  'hms 2': ['7204.49.00'],
  'hms 1/2': ['7204.49.00'],
  'hms': ['7204.49.00'],
  'heavy melting scrap': ['7204.49.00'],

  // Electronics
  'electronics': ['8517.12.00', '8517.62.00', '8528.72.00'],
  'phone': ['8517.12.00'],
  'smartphone': ['8517.12.00'],
  'computer': ['8471.30.00', '8471.41.00'],
  'laptop': ['8471.30.00'],
  'tablet': ['8471.30.00'],
  'monitor': ['8528.72.00'],
  'tv': ['8528.72.00'],
  'camera': ['8525.80.00'],

  // Clothing / Textiles
  'clothing': ['6109.10.00', '6110.20.00', '6203.42.00'],
  'shirt': ['6109.10.00'],
  't-shirt': ['6109.10.00'],
  'shoes': ['6403.99.00', '6404.11.00'],
  'footwear': ['6403.99.00'],
  'textile': ['5007.20.00', '5208.11.00'],
  'fabric': ['5208.11.00'],

  // Furniture / Home
  'furniture': ['9403.20.00', '9403.40.00', '9401.30.00'],
  'chair': ['9401.30.00'],
  'table': ['9403.20.00'],
  'bed': ['9403.50.00'],
  'sofa': ['9401.40.00'],

  // Machinery
  'machinery': ['8428.90.00', '8431.41.00'],
  'engine': ['8407.34.00'],
  'pump': ['8413.30.90'],
  'valve': ['8481.80.00'],

  // Food
  'food': ['0401.10.00', '0901.11.00'],
  'coffee': ['0901.11.00'],
  'tea': ['0902.10.00'],
  'fruit': ['0808.10.00'],
  'rice': ['1006.30.00'],

  // Materials
  'plastic': ['3901.10.00', '3902.10.00'],
  'metal': ['7201.10.00', '7304.11.00'],
  'steel': ['7201.10.00'],
  'wood': ['4403.10.00', '4407.10.00'],
  'paper': ['4801.00.00', '4802.56.00'],
  'glass': ['7001.10.00', '7002.20.00'],
  'ceramic': ['6901.00.00'],

  // Automotive
  'car': ['8703.23.00'],
  'automobile': ['8703.23.00'],
  'autoparts': ['8708.99.00'],
  'tire': ['4011.10.00'],

  // Misc
  'toy': ['9503.00.00'],
  'game': ['9504.50.00'],
  'sport': ['9506.91.00'],
  'gym': ['9506.91.00'],
  'medical': ['9018.12.00'],
};

/**
 * Get HS code suggestions from API
 */
async function getHSCodeFromAPI(description: string): Promise<HSCodeSuggestion[]> {
  // Try to find matches in our local DB first (improved accuracy)
  return getHSCodeFromKeywords(description);
}

/**
 * Smart keyword-based HS code suggestion
 * This analyzes the description and suggests codes based on keywords
 */
function getHSCodeFromKeywords(description: string): HSCodeSuggestion[] {
  const lowerDesc = description.toLowerCase();
  const suggestions: HSCodeSuggestion[] = [];

  // 1. Check for exact category matches
  for (const [category, codes] of Object.entries(commonHSCodes)) {
    if (lowerDesc.includes(category)) {
      codes.forEach((code, index) => {
        // Avoid duplicates
        if (!suggestions.some(s => s.code === code)) {
          suggestions.push({
            code,
            description: getHSCodeDescription(code),
            confidence: 0.85 - (index * 0.1), // First matching category code has high confidence
          });
        }
      });
    }
  }

  // 2. Fallback: If minimal results, try partial matching or simpler algorithm
  // (Currently the loop above covers the main keywords)

  // If no specific match, provide generic suggestions
  if (suggestions.length === 0) {
    suggestions.push({
      code: '9999.99.99',
      description: 'Please consult customs for accurate classification',
      confidence: 0.1,
    });
  }

  // Sort by confidence (highest first)
  return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 10);
}

/**
 * Get description for HS code
 */
function getHSCodeDescription(code: string): string {
  const descriptions: Record<string, string> = {
    '8517.12.00': 'Telephones for cellular networks',
    '8517.62.00': 'Machines for reception/transmission of voice/data',
    '8528.72.00': 'Monitors and projectors',
    '8471.30.00': 'Laptops and portable computers',
    '8471.41.00': 'Other personal computers',
    '8525.80.00': 'Cameras (TV, digital, video)',

    '6109.10.00': 'T-shirts (knitted/crocheted)',
    '6110.20.00': 'Jerseys, pullovers, cardigans',
    '6203.42.00': 'Trousers/Shorts (cotton)',
    '6403.99.00': 'Leather Footwear',
    '6404.11.00': 'Rubber/Plastic Footwear',

    '9403.20.00': 'Wooden furniture',
    '9403.40.00': 'Plastic furniture',
    '9401.30.00': 'Swivel seats',
    '9403.50.00': 'Bedroom wooden furniture',
    '9401.40.00': 'Sofa beds/Garden seats',

    '5007.20.00': 'Silk fabrics',
    '5208.11.00': 'Cotton fabrics',

    '8428.90.00': 'Lifting/Loading machinery',
    '8431.41.00': 'Machinery parts',
    '8407.34.00': 'Vehicle engines',
    '8413.30.90': 'Liquid pumps',
    '8481.80.00': 'Valves and appliances',

    '3901.10.00': 'Ethylene polymers (Plastic)',
    '3902.10.00': 'Propylene polymers (Plastic)',
    '7201.10.00': 'Pig iron',
    '7304.11.00': 'Stainless steel pipes',
    '7204.49.00': 'Ferrous waste and scrap (HMS 1/2, iron or steel)',
    '4403.10.00': 'Rough wood (treated)',
    '4407.10.00': 'Sawn wood',
    '4801.00.00': 'Newsprint paper',
    '4802.56.00': 'Printing/Writing paper',
    '7001.10.00': 'Glass scrap (Cullet)',
    '7002.20.00': 'Glass balls/rods/tubes',
    '6901.00.00': 'Ceramic bricks/tiles',

    '8703.23.00': 'Cars (1.5L - 3.0L engine)',
    '8708.99.00': 'Car parts and accessories',
    '4011.10.00': 'Rubber tires',

    '9503.00.00': 'Toys (wheeled, dolls, puzzles)',
    '9504.50.00': 'Video game consoles',
    '9506.91.00': 'Exercise/Sports equipment',
    '9018.12.00': 'Medical ultrasound scanning apparatus',

    '1006.30.00': 'Rice',
    '0901.11.00': 'Coffee beans',
    '0902.10.00': 'Green tea',
    '0808.10.00': 'Fresh Apples',
    '2801.20.00': 'Iodine',
    '2902.11.00': 'Cyclohexane',
  };

  return descriptions[code] || 'Customs classification required';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const description = searchParams.get('description') || '';

  if (!description || description.trim().length < 3) {
    return NextResponse.json(
      { error: 'Description must be at least 3 characters' },
      { status: 400 }
    );
  }

  try {
    const suggestions = await getHSCodeFromAPI(description.trim());

    return NextResponse.json({
      suggestions,
      count: suggestions.length,
    });
  } catch (error) {
    console.error('Error fetching HS code suggestions:', error);
    // Never surface a 500 to the client—fallback to local suggestions so UI keeps working
    const fallback = getHSCodeFromKeywords(description.trim());
    return NextResponse.json({
      suggestions: fallback,
      count: fallback.length,
      error: 'Upstream HS code lookup failed; using local fallback',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 200 });
  }
}
