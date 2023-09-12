import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const productCollection = 'products';
const productSchema = new mongoose.Schema({
title: {
    type: String,
    unique:true,
    required: true
},
description: {
    type: String,
    required: true
},
code: {
    type: String,
    unique: true,
    required: true
},
price: {
    type: Number,
    required: true
},
status: {
    type: Boolean,
    required: true
},
stock: {
    type: Number,
    required: true
},
category: {
    type: String,
    required: true
},
thumbnails: {
    type: Array,
}
});
productSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model(productCollection, productSchema);