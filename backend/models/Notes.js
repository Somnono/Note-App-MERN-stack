import mongoose from "mongoose";

// Define the schema for a note
const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
   }, 
{ timestamps: true } // Automatically manage createdAt and updatedAt fields)
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
// Export the Note model to be used in other parts of the application