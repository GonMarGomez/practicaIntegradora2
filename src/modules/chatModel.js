import mongoose from "mongoose";

const messagesCollection = 'messages';
const messagesSchema = new mongoose.Schema({
user: {
    type: String,
    requierd: true
},
message: {
    type: String,
    requierd: true
}
});
export const messageModel = mongoose.model(messagesCollection, messagesSchema);