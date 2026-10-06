const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: __dirname + '/../.env' });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/glowcare_db';
    await mongoose.connect(mongoUri);
    console.log('✨ Connected to MongoDB for seeding GlowCare data...');

    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    console.log('🧹 Purged existing collections.');

    // 1. Seed Users
    const adminUser = await User.create({
      name: 'GlowCare Master Admin',
      email: 'admin@glowcare.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 234-5678',
      skinType: 'Normal'
    });

    const demoUser = await User.create({
      name: 'Emma Watson',
      email: 'user@glowcare.com',
      password: 'user123',
      role: 'user',
      phone: '+1 (555) 876-5432',
      skinType: 'Combination',
      skinConcerns: ['Hydration & Dryness', 'Pores & Texture'],
      addresses: [
        {
          recipientName: 'Emma Watson',
          phone: '+1 (555) 876-5432',
          street: '742 Evergreen Terrace, Apt 4B',
          city: 'Beverly Hills',
          state: 'CA',
          postalCode: '90210',
          country: 'United States',
          isDefault: true
        }
      ]
    });

    const demoUser2 = await User.create({
      name: 'Sophia Reed',
      email: 'sophia@glowcare.com',
      password: 'user123',
      role: 'user',
      phone: '+1 (555) 432-1098',
      skinType: 'Sensitive',
      skinConcerns: ['Redness & Sensitivity']
    });

    console.log('👤 Created Admin & Demo Users:');
    console.log('   Admin: admin@glowcare.com / admin123');
    console.log('   User:  user@glowcare.com / user123');

    // 2. Seed Categories
    const categoriesData = [
      {
        name: 'Cleansers',
        slug: 'cleansers',
        description: 'Melt away makeup, pollution, and excess sebum without stripping the moisture barrier.',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        icon: 'Sparkles',
        displayOrder: 1
      },
      {
        name: 'Face Wash',
        slug: 'face-wash',
        description: 'Purifying foaming and cream gel cleansers for daily morning & night freshness.',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
        icon: 'Droplets',
        displayOrder: 2
      },
      {
        name: 'Moisturizers',
        slug: 'moisturizers',
        description: 'Nourishing barrier creams, lightweight water-gels, and rich lipid replenishers.',
        image: 'https://images.unsplash.com/photo-1608248597359-00977e923e20?auto=format&fit=crop&w=600&q=80',
        icon: 'Heart',
        displayOrder: 3
      },
      {
        name: 'Serums',
        slug: 'serums',
        description: 'Concentrated active formulations targeting hyperpigmentation, fine lines, and texture.',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
        icon: 'Zap',
        displayOrder: 4
      },
      {
        name: 'Sunscreens',
        slug: 'sunscreens',
        description: 'Ultra-sheer mineral and chemical broad-spectrum SPF50+ shields with zero white cast.',
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
        icon: 'Sun',
        displayOrder: 5
      },
      {
        name: 'Toners',
        slug: 'toners',
        description: 'Balancing, pore-refining floral hydrolats and clarifying BHA/PHA liquid elixirs.',
        image: 'https://images.unsplash.com/photo-1567928815116-2917d598bafe?auto=format&fit=crop&w=600&q=80',
        icon: 'Wind',
        displayOrder: 6
      },
      {
        name: 'Face Masks',
        slug: 'face-masks',
        description: 'Detoxifying pink kaolin clay, overnight sleeping packs, and biocellulose hydration sheets.',
        image: 'https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?auto=format&fit=crop&w=600&q=80',
        icon: 'Smile',
        displayOrder: 7
      },
      {
        name: 'Lip Care',
        slug: 'lip-care',
        description: 'Peptide glaze balms, buttery lip sleeping butter, and plumping botanical glosses.',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
        icon: 'Feather',
        displayOrder: 8
      },
      {
        name: 'Eye Creams',
        slug: 'eye-creams',
        description: 'Caffeine and multi-peptide awakeners to de-puff, brighten dark circles, and firm delicate eyelids.',
        image: 'https://images.unsplash.com/photo-1594913785162-e678a0c23cc7?auto=format&fit=crop&w=600&q=80',
        icon: 'Eye',
        displayOrder: 9
      }
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat;
    });
    console.log(`🏷️  Created ${createdCategories.length} Categories.`);

    // 3. Products
    const productsData = [
      {
        name: 'Radiance C-Complex 15% Glow Serum',
        slug: 'radiance-c-complex-15-glow-serum',
        subtitle: 'Advanced THD Vitamin C + Ferulic Acid + Japanese Plum',
        category: categoryMap['serums']._id,
        categoryName: 'Serums',
        price: 42.00,
        compareAtPrice: 52.00,
        stock: 65,
        sku: 'GC-SER-001',
        shortDescription: 'Clinical-strength antioxidant elixir that visibly brightens dark spots and revives dull, tired complexion.',
        description: 'Formulated with 15% high-stability lipid-soluble Vitamin C (Tetrahexyldecyl Ascorbate) and Ferulic Acid, this ultra-light serum delivers intense free-radical protection while penetrating 50x deeper than standard L-ascorbic acid. Infused with Kakadu Plum and Hyaluronic acid to plump fine lines and bestow an ethereal, glassy dewiness.',
        thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1608248597359-00977e923e20?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
        ],
        volume: '30ml / 1.0 fl oz',
        skinTypes: ['All Skin Types', 'Combination', 'Normal', 'Dry'],
        concerns: ['Brightening & Dullness', 'Anti-Aging', 'Sun Protection'],
        routineStep: 'Treat',
        keyIngredients: [
          { name: '15% THD Ascorbate', benefit: 'Stable, deep-penetrating Vitamin C that fades hyperpigmentation.' },
          { name: 'Ferulic Acid 1%', benefit: 'Doubles antioxidant stability and neutralizes UV photo-damage.' },
          { name: 'Kakadu Plum Extract', benefit: 'Superfruit containing 100x more Vitamin C than oranges.' },
          { name: 'Hyaluronic Acid Multi-Weight', benefit: 'Binds moisture at three distinct dermal layers.' }
        ],
        fullIngredients: 'Aqua (Water), Tetrahexyldecyl Ascorbate, Propanediol, Glycerin, Ferulic Acid, Terminalia Ferdinandiana (Kakadu Plum) Fruit Extract, Sodium Hyaluronate, Tocopherol (Vitamin E), Panthenol, Xanthan Gum, Ethylhexylglycerin, Phenoxyethanol.',
        howToUse: [
          'Dispense 3-4 drops onto freshly cleansed, toned fingertips.',
          'Gently press into face, neck, and décolletage every morning.',
          'Follow with moisturizer and broad-spectrum SPF 50 sunscreen.'
        ],
        benefits: [
          'Fades stubborn post-acne dark marks and sun spots in 4 weeks',
          'Boosts natural collagen synthesis for firmer, lifted appearance',
          'Non-sticky, silky slip with fast absorption under makeup',
          'Dermatologist tested & fragrance-free for maximum compatibility'
        ],
        texture: 'Silky Dewy Liquid',
        scent: 'Natural, clean, fragrance-free',
        rating: 4.9,
        numReviews: 24,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false
      },
      {
        name: 'Ceramide Barrier Melt Cleansing Balm',
        slug: 'ceramide-barrier-melt-cleansing-balm',
        subtitle: 'Double-Cleanse Essential with Oat Lipids & Meadowfoam',
        category: categoryMap['cleansers']._id,
        categoryName: 'Cleansers',
        price: 34.00,
        compareAtPrice: 40.00,
        stock: 80,
        sku: 'GC-CLN-002',
        shortDescription: 'Sherbet-textured balm that transforms into a silky oil and milky emulsion to dissolve waterproof makeup effortlessly.',
        description: 'An indulgent, sensorial cleansing balm powered by bio-identical Ceramides NP, AP, and EOP, and cold-pressed Oat Kernel Oil. Melts away stubborn waterproof mascara, SPF, and stubborn sebum without cloudy vision or tight dry skin.',
        thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
        ],
        volume: '100g / 3.5 oz',
        skinTypes: ['Dry', 'Sensitive', 'Normal', 'Combination'],
        concerns: ['Hydration & Dryness', 'Redness & Sensitivity'],
        routineStep: 'Cleanse',
        keyIngredients: [
          { name: 'Ceramides NP & EOP', benefit: 'Restores the epidermal lipid matrix during makeup removal.' },
          { name: 'Colloidal Oat Extract', benefit: 'Calms irritation and reduces flush redness instantly.' },
          { name: 'Meadowfoam Seed Oil', benefit: 'Locks in hydration and mimics skin natural sebum composition.' }
        ],
        fullIngredients: 'Caprylic/Capric Triglyceride, PEG-20 Glyceryl Triisostearate, Cetyl Ethylhexanoate, Ceramide NP, Ceramide AP, Avena Sativa (Oat) Kernel Oil, Limnanthes Alba (Meadowfoam) Seed Oil, Tocopheryl Acetate.',
        howToUse: [
          'Scoop a dime-sized amount with the included spatula onto dry hands.',
          'Massage over dry face in gentle circular motions, focusing on eye makeup.',
          'Add warm water to emulsify into a milky rinse and splash clean.'
        ],
        benefits: [
          'Zero eye stinging and leaves contact lenses residue-free',
          'Rinses 100% clean without leaving any greasy film',
          'Fortifies fragile, compromised skin barriers'
        ],
        texture: 'Velvety Sorbet Balm',
        scent: 'Subtle sweet oat aroma',
        rating: 4.8,
        numReviews: 19,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false
      },
      {
        name: 'Hydra-Cloud Niacinamide 10% Water Gel Face Wash',
        slug: 'hydra-cloud-niacinamide-10-water-gel-face-wash',
        subtitle: 'Pore Clarifying Gentle Foaming Gel with Zinc PCA',
        category: categoryMap['face-wash']._id,
        categoryName: 'Face Wash',
        price: 26.00,
        compareAtPrice: 30.00,
        stock: 95,
        sku: 'GC-WSH-003',
        shortDescription: 'Gentle pH 5.5 daily purifying face wash that removes congestion while preserving optimal hydration.',
        description: 'Formulated with amino-acid surfactants that create a soft, micro-bubble lather. Powered by 10% Niacinamide and 1% Zinc PCA to balance excess shine, unclog pores, and strengthen the epidermal barrier for luminous skin.',
        thumbnail: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
        ],
        volume: '150ml / 5.1 fl oz',
        skinTypes: ['Oily', 'Combination', 'Normal'],
        concerns: ['Acne & Blemishes', 'Pores & Texture'],
        routineStep: 'Cleanse',
        keyIngredients: [
          { name: 'Niacinamide (Vitamin B3)', benefit: 'Regulates oil output, minimizes pore appearance, and soothes.' },
          { name: 'Zinc PCA 1%', benefit: 'Purifies bacterial congestion and calms active blemishes.' },
          { name: 'Apple Amino Acids', benefit: 'Ultra-gentle cleansing base that protects delicate moisture.' }
        ],
        fullIngredients: 'Aqua, Sodium Cocoyl Apple Amino Acids, Niacinamide, Cocamidopropyl Hydroxysultaine, Zinc PCA, Glycerin, Centella Asiatica Extract, Allantoin, Citric Acid, Phenoxyethanol.',
        howToUse: [
          'Pump 1-2 times onto wet hands and work into a rich micro-foam.',
          'Massage onto damp face for 60 seconds.',
          'Rinse thoroughly with lukewarm water.'
        ],
        benefits: [
          'Cleans deep within pores without causing that stripped "squeaky" dryness',
          'Minimizes midday T-zone oiliness',
          'Sulfate-free, SLS-free, and alcohol-free'
        ],
        texture: 'Crystalline Gel Foam',
        scent: 'Crisp green tea leaf',
        rating: 4.7,
        numReviews: 15,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false
      },
      {
        name: 'Peptide Barrier Shield Ceramide Cream',
        slug: 'peptide-barrier-shield-ceramide-cream',
        subtitle: 'Intensive Cushion Moisture with 5 Ceramides & Copper Tripeptide',
        category: categoryMap['moisturizers']._id,
        categoryName: 'Moisturizers',
        price: 48.00,
        compareAtPrice: 58.00,
        stock: 45,
        sku: 'GC-MST-004',
        shortDescription: 'Luxurious restorative cream that locks in 72-hour moisture and repairs dry, peeling, compromised skin.',
        description: 'A comforting blanket of restorative nourishment. Formulated with our proprietary 5-Ceramide Biomimetic Matrix (EOP, NS, NP, AS, AP), Cholesterol, and Free Fatty Acids in the dermatologist-ideal 3:1:1 golden ratio, paired with Copper Tripeptide-1 to accelerate cellular recovery.',
        thumbnail: 'https://images.unsplash.com/photo-1608248597359-00977e923e20?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1608248597359-00977e923e20?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1594913785162-e678a0c23cc7?auto=format&fit=crop&w=800&q=80'
        ],
        volume: '60ml / 2.0 fl oz',
        skinTypes: ['Dry', 'Normal', 'Sensitive', 'Combination'],
        concerns: ['Hydration & Dryness', 'Anti-Aging', 'Redness & Sensitivity'],
        routineStep: 'Moisturize',
        keyIngredients: [
          { name: '5-Ceramide Complex', benefit: 'Replenishes intercellular cement to stop transepidermal water loss.' },
          { name: 'Copper Tripeptide-1', benefit: 'Signals skin renewal, smoothing rough texture and micro-crepiness.' },
          { name: 'Pure Squalane 5%', benefit: 'Weightless olive-derived lipid that delivers velvety softness.' }
        ],
        fullIngredients: 'Aqua, Butyrospermum Parkii (Shea) Butter, Caprylic/Capric Triglyceride, Squalane, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Copper Tripeptide-1, Glycerin, Sodium Hyaluronate.',
        howToUse: [
          'Smooth a nickel-sized amount over face and neck as the last step in your PM routine, or before sunscreen in AM.',
          'Press palms gently against cheeks to enhance thermal absorption.'
        ],
        benefits: [
          'Clinically proven to repair skin barrier integrity in as little as 48 hours',
          'Soothes retinoid dryness, chemical peel flaking, and winter windburn',
          'Non-comedogenic and won’t clog pores'
        ],
        texture: 'Rich Velvet Cushion Cream',
        scent: 'Natural unscented',
        rating: 4.9,
        numReviews: 32,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false
      },
      {
        name: 'Invisible Dew Mineral Sunscreen SPF 50+ PA++++',
        slug: 'invisible-dew-mineral-sunscreen-spf-50-pa',
        subtitle: 'Non-Nano Zinc Oxide with Hyaluronic Acid & Ectoin',
        category: categoryMap['sunscreens']._id,
        categoryName: 'Sunscreens',
        price: 36.00,
        compareAtPrice: 42.00,
        stock: 120,
        sku: 'GC-SPF-005',
        shortDescription: 'Featherlight 100% mineral sunscreen that glides on invisibly with zero white cast and a natural dewy finish.',
        description: 'Engineered with transparent Non-Nano Zinc Oxide (12%) and skin-protective Ectoin, this daily SPF shields against UVA, UVB, blue light, and environmental free radicals without ever feeling heavy, greasy, or chalky.',
        thumbnail: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80'
        ],
        volume: '50ml / 1.7 fl oz',
        skinTypes: ['All Skin Types', 'Sensitive', 'Oily', 'Dry', 'Combination', 'Normal'],
        concerns: ['Sun Protection', 'Anti-Aging', 'Redness & Sensitivity'],
        routineStep: 'Protect',
        keyIngredients: [
          { name: 'Non-Nano Zinc Oxide 12%', benefit: 'Broad-spectrum mineral UVA/UVB filter that will not clog pores.' },
          { name: 'Ectoin 1%', benefit: 'Extremolyte molecule protecting skin cells from blue light and heat stress.' },
          { name: 'Bisabolol & Green Tea', benefit: 'Calms redness, inflammation, and sensitivity under sun exposure.' }
        ],
        fullIngredients: 'Zinc Oxide 12.0%, Water, Isododecane, Caprylic/Capric Triglyceride, Ectoin, Camellia Sinensis (Green Tea) Leaf Extract, Bisabolol, Sodium Hyaluronate, Silica, Polyglyceryl-4 Diisostearate, Tocopherol.',
        howToUse: [
          'Apply generously using the two-finger rule to face and ears as the final step of AM skincare.',
          'Allow 60 seconds to set before applying makeup.',
          'Reapply every 2 hours during prolonged direct sun exposure.'
        ],
        benefits: [
          'Zero chalky white residue on all Fitzpatrick skin tones 1 through 6',
          'Dewy, satin glow that doubles as an incredible makeup primer',
          'Reef-safe, cruelty-free, and waterproof up to 80 minutes'
        ],
        texture: 'Ultralight Fluid Milk',
        scent: 'Unscented / clean',
        rating: 4.9,
        numReviews: 28,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false
      },
      {
        name: 'Centella Asiatica Calming Essence Toner',
        slug: 'centella-asiatica-calming-essence-toner',
        subtitle: '85% Cica Hydrosol + Madecassoside + Panthenol B5',
        category: categoryMap['toners']._id,
        categoryName: 'Toners',
        price: 28.00,
        compareAtPrice: 34.00,
        stock: 75,
        sku: 'GC-TNR-006',
        shortDescription: 'Refreshing multi-tasking toner essence that instantly quenches parched skin and calms redness.',
        description: 'Brewed with 85% Madagascar Centella Asiatica leaf water and soothing Panthenol, this bouncy essence toner balances facial pH, smooths micro-flakiness, and primes skin to absorb succeeding serums with maximum bioavailability.',
        thumbnail: 'https://images.unsplash.com/photo-1567928815116-2917d598bafe?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1567928815116-2917d598bafe?auto=format&fit=crop&w=800&q=80'
        ],
        volume: '200ml / 6.7 fl oz',
        skinTypes: ['Sensitive', 'Combination', 'Oily', 'Normal', 'Dry'],
        concerns: ['Redness & Sensitivity', 'Hydration & Dryness', 'Acne & Blemishes'],
        routineStep: 'Tone',
        keyIngredients: [
          { name: 'Madagascar Centella (85%)', benefit: 'Accelerates wound healing and calms irritation rapidly.' },
          { name: 'Madecassoside & Asiaticoside', benefit: 'Bioactive triterpenoids that strengthen cellular repair.' },
          { name: 'Pro-Vitamin B5 (Panthenol 3%)', benefit: 'Retains deep moisture and relieves tight itchiness.' }
        ],
        fullIngredients: 'Centella Asiatica Leaf Water, Butylene Glycol, Glycerin, 1,2-Hexanediol, Panthenol, Madecassoside, Asiaticoside, Allantoin, Betaine, Disodium EDTA.',
        howToUse: [
          'After cleansing, pour 4-5 drops into palms or onto a reusable cotton pad.',
          'Gently pat across face and neck until fully absorbed.',
          'Layer 2-3 times ("7-skin method") for glass skin plumping.'
        ],
        benefits: [
          'Reduces visible cheek erythema and post-workout flushing within 15 minutes',
          'Alcohol-free, witch-hazel free formula that will not sting eyes',
          'Preps skin for up to 300% better serum penetration'
        ],
        texture: 'Bouncy Water Elixir',
        scent: 'Subtle fresh botanical herb',
        rating: 4.8,
        numReviews: 21,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: false
      },
      {
        name: 'Rose Clay Detox Pore Clarifying Mask',
        slug: 'rose-clay-detox-pore-clarifying-mask',
        subtitle: 'French Pink Kaolin + Hibiscus AHA + Rosehip Oil',
        category: categoryMap['face-masks']._id,
        categoryName: 'Face Masks',
        price: 32.00,
        compareAtPrice: 38.00,
        stock: 50,
        sku: 'GC-MSK-007',
        shortDescription: 'Creamy pink clay treatment that draws out deep impurities, minimizes pores, and polishes dull texture.',
        description: 'Unlike traditional drying clay masks, our Rose Clay formula stays buttery and creamy throughout wear. French Pink Kaolin clay lifts sebum and urban pollutants from clogged pores while gentle hibiscus flower AHAs polish away dead skin cells to reveal baby-soft smoothness.',
        thumbnail: 'https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?auto=format&fit=crop&w=800&q=80'
        ],
        volume: '75ml / 2.5 fl oz',
        skinTypes: ['Oily', 'Combination', 'Normal'],
        concerns: ['Pores & Texture', 'Acne & Blemishes', 'Brightening & Dullness'],
        routineStep: 'Mask & Care',
        keyIngredients: [
          { name: 'French Pink Clay', benefit: 'Gentle mineral adsorbent that decongests pores without drying.' },
          { name: 'Hibiscus Flower Acids', benefit: 'Nature’s Botox flower providing gentle enzymatic smoothing.' },
          { name: 'Organic Rosehip Seed Oil', benefit: 'Rich in linoleic acid to keep skin supple and nourished.' }
        ],
        fullIngredients: 'Kaolin (Pink Clay), Rosa Damascena Flower Water, Glycerin, Caprylic/Capric Triglyceride, Hibiscus Sabdariffa Flower Extract, Rosa Canina (Rosehip) Fruit Oil, Cetearyl Alcohol, Pelargonium Graveolens Flower Oil.',
        howToUse: [
          'Apply an even layer to clean, damp skin avoiding eye area.',
          'Relax for 10-15 minutes until mask turns matte (does not crack).',
          'Rinse away gently with warm water using circular polishing motions.'
        ],
        benefits: [
          'Visibly tightens and refines enlarged pores in one application',
          'Washes off cleanly without messy basin staining',
          'Leaves complexion glowing, never tight or stripped'
        ],
        texture: 'Whipped Mousse Cream',
        scent: 'Natural Damask Rose',
        rating: 4.8,
        numReviews: 17,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true
      },
      {
        name: 'Peptide Glaze Pillow Lip Treatment',
        slug: 'peptide-glaze-pillow-lip-treatment',
        subtitle: 'Volumizing Peptides + Shea Butter + Vanilla Blossom',
        category: categoryMap['lip-care']._id,
        categoryName: 'Lip Care',
        price: 22.00,
        compareAtPrice: 26.00,
        stock: 110,
        sku: 'GC-LIP-008',
        shortDescription: 'High-shine restorative lip treatment that restores dry cracked lips and visibly plumps contours.',
        description: 'A decadent hybrid between a nourishing lip sleeping mask and a high-gloss glaze. Infused with Palmitoyl Tripeptide-38 to stimulate hyaluronic acid synthesis in delicate vermilion borders, leaving lips pillowy soft with a non-sticky glassy finish.',
        thumbnail: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
        ],
        volume: '15ml / 0.5 fl oz',
        skinTypes: ['All Skin Types'],
        concerns: ['Hydration & Dryness', 'Anti-Aging'],
        routineStep: 'Mask & Care',
        keyIngredients: [
          { name: 'Palmitoyl Tripeptide-38', benefit: 'Clinically proven peptide that volumizes lip fullness.' },
          { name: 'Cupuaçu Butter', benefit: 'Superior water-absorption capacity that cures peeling lips.' },
          { name: 'Cold-Pressed Jojoba Esters', benefit: 'Creates a protective moisture seal that lasts through sleep.' }
        ],
        fullIngredients: 'Polyisobutene, Butyrospermum Parkii (Shea) Butter, Simmondsia Chinensis (Jojoba) Seed Oil, Theobroma Grandiflorum Seed Butter, Palmitoyl Tripeptide-38, Vanilla Planifolia Fruit Extract, Tocopherol.',
        howToUse: [
          'Glide onto lips throughout the day for effortless glossy shine.',
          'Slather a thick layer before bed as an intensive overnight lip sleeping mask.'
        ],
        benefits: [
          'Instantly smooths chapped dry lip lines',
          'Never sticky, gooey, or tacky',
          'Soft natural cushion glow'
        ],
        texture: 'Rich Melting Glaze',
        scent: 'Warm subtle Madagascar Vanilla',
        rating: 4.9,
        numReviews: 29,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false
      },
      {
        name: 'Awaken Caffeine & Peptide Eye Elixir',
        slug: 'awaken-caffeine-peptide-eye-elixir',
        subtitle: '5% Green Tea Caffeine + Matrixyl 3000 + Cooling Metal Wand',
        category: categoryMap['eye-creams']._id,
        categoryName: 'Eye Creams',
        price: 38.00,
        compareAtPrice: 46.00,
        stock: 55,
        sku: 'GC-EYE-009',
        shortDescription: 'Targeted cooling eye cream that diminishes dark undereye circles, reduces morning puffiness, and smooths crow’s feet.',
        description: 'Tackle sleepless nights and screen fatigue with this clinical eye therapy. Combines 5% bio-available Caffeine from Green Tea to drain lymphatic stagnation and vasoconstrict capillary dark circles, with Matrixyl 3000 to firm fragile periorbital tissue.',
        thumbnail: 'https://images.unsplash.com/photo-1594913785162-e678a0c23cc7?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1594913785162-e678a0c23cc7?auto=format&fit=crop&w=800&q=80'
        ],
        volume: '15ml / 0.5 fl oz',
        skinTypes: ['All Skin Types', 'Sensitive', 'Normal', 'Dry', 'Combination'],
        concerns: ['Anti-Aging', 'Brightening & Dullness'],
        routineStep: 'Treat',
        keyIngredients: [
          { name: '5% Green Tea Caffeine', benefit: 'Reduces fluid retention puffiness and brightens vascular darkness.' },
          { name: 'Matrixyl 3000 Complex', benefit: 'Dual peptides that stimulate elastin and collagen under eye skin.' },
          { name: 'Niacinamide 2%', benefit: 'Lightens hyperpigmentation shadows and fortifies skin barrier.' }
        ],
        fullIngredients: 'Aqua, Caffeine, Glycerin, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Niacinamide, Camellia Sinensis Leaf Extract, Sodium Hyaluronate, Hesperidin Methyl Chalcone, Carbomer, Phenoxyethanol.',
        howToUse: [
          'Dispense half a pump onto the ring finger.',
          'Gently tap along the orbital bone from inner to outer corner.',
          'Use morning and evening before face creams.'
        ],
        benefits: [
          'Visibly deflates morning undereye bags in 10 minutes',
          'Doesn’t migrate into eyes or pill under concealer',
          'Ophthalmologist and dermatologist tested'
        ],
        texture: 'Silky Cooling Gel-Lotion',
        scent: 'Fragrance-free',
        rating: 4.8,
        numReviews: 22,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false
      },
      {
        name: 'Bakuchiol 2% Retinol Alternative Night Serum',
        slug: 'bakuchiol-2-retinol-alternative-night-serum',
        subtitle: 'Plant-Powered Gentle Collagen Booster with Blue Tansy',
        category: categoryMap['serums']._id,
        categoryName: 'Serums',
        price: 46.00,
        compareAtPrice: 56.00,
        stock: 60,
        sku: 'GC-SER-010',
        shortDescription: 'All the wrinkle-smoothing, pore-refining benefits of traditional retinol with zero peeling, irritation, or sun-sensitivity.',
        description: 'Derived from the seeds of the Psoralea corylifolia plant, 2% high-purity Bakuchiol delivers cellular renewal that rivals traditional prescription tretinoin without the erythema or flaking. Enhanced with Moroccan Blue Tansy essential oil to neutralize inflammation.',
        thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
        ],
        volume: '30ml / 1.0 fl oz',
        skinTypes: ['Sensitive', 'Dry', 'Combination', 'Normal', 'Oily'],
        concerns: ['Anti-Aging', 'Pores & Texture', 'Redness & Sensitivity'],
        routineStep: 'Treat',
        keyIngredients: [
          { name: 'Bakuchiol 2%', benefit: 'Clinically proven natural retinol alternative that firms and smooths wrinkles.' },
          { name: 'Moroccan Blue Tansy', benefit: 'Contains Chamazulene to powerfully soothe reactive, inflamed skin.' },
          { name: 'Olive Squalane 95%', benefit: 'Lightweight biomimetic lipid base delivering deep hydration.' }
        ],
        fullIngredients: 'Squalane, Bakuchiol, Tanacetum Annuum (Blue Tansy) Flower Oil, Helianthus Annuus Seed Oil, Tocopherol, Tetrahexyldecyl Ascorbate.',
        howToUse: [
          'Warm 3-4 deep sapphire drops between fingertips.',
          'Press into face and neck every evening after water-based serums.',
          'Safe for daily use, even during pregnancy and breastfeeding.'
        ],
        benefits: [
          'Softens expression wrinkles and stubborn laugh lines in 6 weeks',
          'Calms cystic redness and blemishes without surface drying',
          'Natural gorgeous indigo tint that absorbs clear into skin'
        ],
        texture: 'Cashmere Dry Facial Oil',
        scent: 'Herbaceous sweet blue tansy',
        rating: 4.9,
        numReviews: 26,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true
      },
      {
        name: 'BHA 2% Salicylic Clarifying Exfoliator Liquid',
        slug: 'bha-2-salicylic-clarifying-exfoliator-liquid',
        subtitle: 'Pore Unclogging Salicylic Acid + Zinc + Licorice Root',
        category: categoryMap['toners']._id,
        categoryName: 'Toners',
        price: 30.00,
        compareAtPrice: 36.00,
        stock: 85,
        sku: 'GC-EXF-011',
        shortDescription: 'Gentle leave-on liquid exfoliant that clears blackheads, shrinks enlarged pores, and dissolves trapped oil.',
        description: 'Featuring 2% Salicylic Acid in an alcohol-free, hydrating base with Licorice Root and Green Tea. Penetrates through stubborn sebum plugs inside the pore lining to dissolve dead skin cells and stop breakouts before they reach the surface.',
        thumbnail: 'https://images.unsplash.com/photo-1567928815116-2917d598bafe?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1567928815116-2917d598bafe?auto=format&fit=crop&w=800&q=80'
        ],
        volume: '120ml / 4.0 fl oz',
        skinTypes: ['Oily', 'Combination', 'Normal'],
        concerns: ['Acne & Blemishes', 'Pores & Texture'],
        routineStep: 'Tone',
        keyIngredients: [
          { name: 'Salicylic Acid 2%', benefit: 'Oil-soluble Beta Hydroxy Acid that clears deep inside pores.' },
          { name: 'Licorice Root Extract', benefit: 'Fades post-inflammatory blemish marks and red spots.' },
          { name: 'Green Tea Epigallocatechin', benefit: 'Provides antioxidant calm and reduces sebum oxidation.' }
        ],
        fullIngredients: 'Water, Methylpropanediol, Butylene Glycol, Salicylic Acid, Polysorbate 20, Camellia Sinensis (Green Tea) Leaf Extract, Glycyrrhiza Glabra (Licorice) Root Extract, Sodium Hydroxide, Tetrasodium EDTA.',
        howToUse: [
          'Dispense onto a cotton pad or directly into palms after cleansing.',
          'Gently sweep over face and neck, avoiding the eye contour.',
          'Do not rinse off. Begin with 2-3 nights per week, building to daily use.'
        ],
        benefits: [
          'Evaporates stubborn blackheads on nose and chin within 14 days',
          'Dramatically refines coarse skin texture',
          'Non-abrasive — no rough microbeads or scrubs required'
        ],
        texture: 'Weightless Water Essence',
        scent: 'Unscented',
        rating: 4.8,
        numReviews: 20,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false
      },
      {
        name: 'Overnight Hyaluronic Cloud Sleeping Mask',
        slug: 'overnight-hyaluronic-cloud-sleeping-mask',
        subtitle: 'Multi-Depth Hyaluronic Acid + Tremella Snow Mushroom',
        category: categoryMap['face-masks']._id,
        categoryName: 'Face Masks',
        price: 38.00,
        compareAtPrice: 44.00,
        stock: 70,
        sku: 'GC-MSK-012',
        shortDescription: 'Pillow-proof jelly mask that drenches dehydrated skin with continuous overnight hydration for morning radiance.',
        description: 'Wake up to the plumpest skin of your life. This weightless memory-gel sleeping pack creates a breathable moisture blanket on your skin surface while Tremella Snow Mushroom extract holds up to 500 times its weight in water to banish dry lines.',
        thumbnail: 'https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?auto=format&fit=crop&w=800&q=80',
        images: [
          'https://images.unsplash.com/photo-1573461160327-b450ce3d8e7f?auto=format&fit=crop&w=800&q=80'
        ],
        volume: '80ml / 2.7 fl oz',
        skinTypes: ['Dry', 'Normal', 'Combination', 'Sensitive'],
        concerns: ['Hydration & Dryness', 'Brightening & Dullness'],
        routineStep: 'Mask & Care',
        keyIngredients: [
          { name: 'Tremella Fuciformis (Snow Mushroom)', benefit: 'Natural alternative to hyaluronic acid with smaller molecular penetration.' },
          { name: '4D Hyaluronic Complex', benefit: 'Targeted continuous hydration over an 8-hour sleep cycle.' },
          { name: 'Centella Asiatica', benefit: 'Deep nocturnal barrier repair and soothes daytime oxidative stress.' }
        ],
        fullIngredients: 'Water, Glycerin, Butylene Glycol, Tremella Fuciformis Extract, Sodium Hyaluronate, Centella Asiatica Extract, Carbomer, Arginine, Betaine, Ethylhexylglycerin.',
        howToUse: [
          'Apply an even layer as the final step of your PM skincare routine.',
          'Allow 5 minutes to absorb into a non-sticky silky film before sleeping.',
          'Rinse off with warm water the next morning.'
        ],
        benefits: [
          'Pillow-safe formula that does not transfer or stick to pillowcases',
          'Eliminates morning dry patches and flaking under makeup',
          'Instantly resets tired jetlagged skin'
        ],
        texture: 'Cooling Jelly Gel',
        scent: 'Natural subtle lavender water',
        rating: 4.9,
        numReviews: 18,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`🌸 Created ${createdProducts.length} Premium Skincare Products.`);

    // 4. Seed Reviews for Products
    const reviewsData = [
      {
        product: createdProducts[0]._id,
        user: demoUser._id,
        userName: 'Emma Watson',
        userSkinType: 'Combination',
        rating: 5,
        title: 'Faded my acne marks in 3 weeks! Holy Grail!',
        comment: 'I have tried every Vitamin C serum on the market from luxury brands to pharmacy staples. GlowCare’s 15% THD serum is by far the most gentle and effective! No stinging, no weird metallic smell, and my skin has that lit-from-within glow.',
        verifiedPurchase: true,
        likes: 12
      },
      {
        product: createdProducts[0]._id,
        user: demoUser2._id,
        userName: 'Sophia Reed',
        userSkinType: 'Sensitive',
        rating: 5,
        title: 'Finally a Vitamin C my sensitive skin loves',
        comment: 'Standard L-ascorbic acid always makes my cheeks flare red. This THD formula is so creamy and calming. Highly recommended!',
        verifiedPurchase: true,
        likes: 8
      },
      {
        product: createdProducts[1]._id,
        user: demoUser._id,
        userName: 'Emma Watson',
        userSkinType: 'Combination',
        rating: 5,
        title: 'Melted waterproof mascara instantly',
        comment: 'Rinses completely clean without leaving a film over my eyes. Smells like comforting oatmeal and leaves skin baby-soft.',
        verifiedPurchase: true,
        likes: 15
      },
      {
        product: createdProducts[3]._id,
        user: demoUser2._id,
        userName: 'Sophia Reed',
        userSkinType: 'Sensitive',
        rating: 5,
        title: 'Saved my damaged barrier!',
        comment: 'I over-exfoliated and my skin was burning with regular water. Two days with this ceramide cream and my redness disappeared completely. This is permanently in my routine.',
        verifiedPurchase: true,
        likes: 21
      },
      {
        product: createdProducts[4]._id,
        user: demoUser._id,
        userName: 'Emma Watson',
        userSkinType: 'Combination',
        rating: 5,
        title: 'ZERO white cast on olive skin!',
        comment: 'Mineral sunscreens usually make me look like a ghost, but this invisible dew SPF blends in 10 seconds flat and leaves a satin finish that looks gorgeous under foundation.',
        verifiedPurchase: true,
        likes: 19
      }
    ];

    await Review.insertMany(reviewsData);
    console.log(`⭐ Created ${reviewsData.length} Verified Customer Reviews.`);

    // 5. Seed Demo Orders for Emma Watson
    const demoOrder1 = await Order.create({
      orderNumber: 'GC-89210-412',
      user: demoUser._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          price: createdProducts[0].price,
          quantity: 1,
          image: createdProducts[0].thumbnail,
          volume: createdProducts[0].volume
        },
        {
          product: createdProducts[4]._id,
          name: createdProducts[4].name,
          price: createdProducts[4].price,
          quantity: 1,
          image: createdProducts[4].thumbnail,
          volume: createdProducts[4].volume
        }
      ],
      shippingAddress: demoUser.addresses[0],
      paymentMethod: 'Credit/Debit Card',
      paymentStatus: 'Paid',
      paymentDetails: {
        transactionId: 'TXN-9018241',
        cardLast4: '4242'
      },
      itemsPrice: 78.00,
      shippingPrice: 0.00,
      discountPrice: 15.60,
      taxPrice: 3.12,
      totalPrice: 65.52,
      couponCode: 'GLOW20',
      orderStatus: 'Delivered',
      trackingNumber: 'TRK-USPS-981240192',
      estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      statusHistory: [
        { status: 'Processing', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), note: 'Payment confirmed. Packaged with eco-friendly honeycomb paper.' },
        { status: 'Shipped', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), note: 'Handed over to carrier USPS Priority.' },
        { status: 'Delivered', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'Delivered to front porch.' }
      ]
    });

    const demoOrder2 = await Order.create({
      orderNumber: 'GC-90412-881',
      user: demoUser._id,
      orderItems: [
        {
          product: createdProducts[1]._id,
          name: createdProducts[1].name,
          price: createdProducts[1].price,
          quantity: 1,
          image: createdProducts[1].thumbnail,
          volume: createdProducts[1].volume
        },
        {
          product: createdProducts[3]._id,
          name: createdProducts[3].name,
          price: createdProducts[3].price,
          quantity: 1,
          image: createdProducts[3].thumbnail,
          volume: createdProducts[3].volume
        }
      ],
      shippingAddress: demoUser.addresses[0],
      paymentMethod: 'Credit/Debit Card',
      paymentStatus: 'Paid',
      paymentDetails: {
        transactionId: 'TXN-9410294',
        cardLast4: '4242'
      },
      itemsPrice: 82.00,
      shippingPrice: 0.00,
      discountPrice: 0.00,
      taxPrice: 4.10,
      totalPrice: 86.10,
      orderStatus: 'Shipped',
      trackingNumber: 'TRK-USPS-887192019',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      statusHistory: [
        { status: 'Processing', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), note: 'Order placed and verified.' },
        { status: 'Shipped', date: new Date(), note: 'In transit to Los Angeles regional distribution hub.' }
      ]
    });

    console.log('📦 Created 2 realistic demo orders.');

    console.log('✅ GlowCare database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
