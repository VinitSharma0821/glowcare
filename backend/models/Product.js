const mongoose = require('mongoose');

const keyIngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  benefit: { type: String, required: true }
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    categoryName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    compareAtPrice: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: 0,
      default: 50
    },
    sku: {
      type: String,
      default: ''
    },
    shortDescription: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    images: [{
      type: String
    }],
    thumbnail: {
      type: String,
      required: true
    },
    volume: {
      type: String,
      default: '50ml / 1.7 fl oz'
    },
    skinTypes: [{
      type: String,
      enum: ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive', 'All Skin Types']
    }],
    concerns: [{
      type: String
    }],
    routineStep: {
      type: String,
      enum: ['Cleanse', 'Tone', 'Treat', 'Moisturize', 'Protect', 'Mask & Care'],
      default: 'Treat'
    },
    keyIngredients: [keyIngredientSchema],
    fullIngredients: {
      type: String,
      default: ''
    },
    howToUse: [{
      type: String
    }],
    benefits: [{
      type: String
    }],
    texture: {
      type: String,
      default: 'Lightweight Gel-Cream'
    },
    scent: {
      type: String,
      default: 'Fragrance-free / Natural subtle floral'
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    numReviews: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isBestSeller: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    isOrganicVegan: {
      type: Boolean,
      default: true
    },
    dermatologistTested: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ name: 'text', description: 'text', categoryName: 'text', fullIngredients: 'text' });

module.exports = mongoose.model('Product', productSchema);
