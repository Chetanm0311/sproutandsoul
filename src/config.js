export const WHATSAPP_NUMBER = '917020853806'
export const INSTAGRAM_HANDLE = 'sproutandsoul.blr'
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`

// From the Sprout & Soul Instagram menu: Rs 180 per 100 g box
export const PRODUCTS = [
  { id: 'mustard', image: '/images/mustard.jpg', name: 'Mustard', emoji: '🌿', tag: 'Peppery', price: 180, unit: '100 g', taste: 'Peppery and bold', benefit: 'Rich in antioxidants', color: '#b5d86a' },
  { id: 'chia', image: '/images/chia.jpg', name: 'Chia', emoji: '🌱', tag: 'Nutrient dense', price: 180, unit: '100 g', taste: 'Mild and crunchy', benefit: 'Nutrient dense', color: '#7fd18b' },
  { id: 'fenugreek', image: '/images/fenugreek.jpg', name: 'Fenugreek', emoji: '🍃', tag: 'Iron rich', price: 180, unit: '100 g', taste: 'Slightly bitter', benefit: 'High in iron', color: '#9bcf53' },
  { id: 'radish', image: '/images/radish.jpg', name: 'Radish', emoji: '🌸', tag: 'Spicy', price: 180, unit: '100 g', taste: 'Spicy, crisp and refreshing', benefit: 'Crisp and refreshing', color: '#f58a9b' },
  { id: 'wheat', image: '/images/wheat.jpg', name: 'Wheat', emoji: '🌾', tag: 'Sweet', price: 180, unit: '100 g', taste: 'Sweet and fresh', benefit: 'Detoxifying', color: '#f6d365' },
]

// Offers from the Instagram poster
export const TRIAL_BOX_PRICE = 850 // all 5 varieties (instead of 900)
export const TRIPLE_PRICE = 500 // any 3 different varieties (instead of 540)

export const PLANS = [
  { id: 'triple', name: 'Any 3 Microgreens', price: 500, was: 540, per: 'order', points: ['Mix and match 3 varieties', 'Save ₹40', 'Applied automatically in your basket'] },
  { id: 'trial', name: 'All 5 Trial Box', price: 850, was: 900, per: 'order', featured: true, points: ['Try all 5 varieties', 'Save ₹50', 'Perfect for first-time buyers'] },
  { id: 'weekly', name: 'Weekly Subscription', price: 800, was: 900, per: '5 boxes', points: ['5 boxes delivered weekly', 'Save ₹100', 'Consistent freshness'] },
]

export const FAQS = [
  ['How fresh are the microgreens?', 'We harvest fresh on order, so your greens arrive live and crisp.'],
  ['Where do you deliver?', 'We deliver across Bangalore, farm to home. Share your pincode on WhatsApp and we will confirm.'],
  ['Are they grown without chemicals?', 'Yes. Our microgreens are grown organically in Bangalore and are chemical-free.'],
  ['How do I pay?', 'Pay by UPI or cash on delivery. We confirm your order on WhatsApp.'],
  ['How do I use microgreens?', 'Add them to salads, smoothies, omelettes, or as a topping on rotis and sandwiches.'],
]

// Photos are from Wikimedia Commons. Replace any file in public/images with your own photo (same name).
export const PHOTO_CREDITS = [
  ['Mustard', 'Goldlocki', 'CC BY-SA 3.0'],
  ['Fenugreek', 'M.Raghu praveera', 'CC BY-SA 4.0'],
  ['Chia', 'Jahra Tasfia Reza', 'CC0'],
  ['Wheat', 'Mokkie', 'CC BY-SA 3.0'],
  ['Radish', 'Teogenesis', 'CC BY-SA 4.0'],
]
