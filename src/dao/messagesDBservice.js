import { messageModel } from "../modules/chatModel";
class messagesDBservice {

    async getChats() {
        const chats = await messageModel.find();
        
        if (chats.length < 1) {
            return [];
        }else{
            try {
            return chats;
            } catch (err) {
            console.error('Error al leer el archivo de productos:', err);
            return [];
            }}
        }
}

    export default messagesDBservice;