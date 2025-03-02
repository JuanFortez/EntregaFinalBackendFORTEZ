// import mongoose from 'mongoose';

// const collectionName = 'orders';

// const currentSchema = new mongoose.Schema({
//     name: String,
//     size: {
//         type: String,
//         enum: ["small", "medium", "large"],
//         default: "medium"
//     },
//     price: Number,
//     quantity: Number,
//     date: Date
// });

// const ordersModel = mongoose.model(collectionName, currentSchema);
// export default ordersModel;



// product.model.js
import mongoose from "mongoose";
// import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    thumbnails: {
      type: [String],
      default: [],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// // Agregar el plugin de paginación
// productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
