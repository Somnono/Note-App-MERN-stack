import Note from '../models/Notes.js';

export async function getAllNotes(req, res) {
  try { 
    const notes = await Note.find().sort({ createdAt: -1 }); // Fetch all notes from the database and sort them by creation date in descending order
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getNoteById(req, res) {
  try { 
    const note = await Note.findById(req.params.id);
    if (!note) 
      return res.status(404).json({ message: "Note not found" });
    // If the note is not found, return a 404 error
    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching that spesific note by ID:", error);
    // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function createNote(req, res) {
 try { 
    const {title,content} = req.body;
    const newNote = new Note({
      title,
      content
    });
    const savedNote = await newNote.save();
    // Save the new note to the database
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote controller:", error);
    // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
 try { 
    const {title,content} = req.body;
    const updateNote = await Note.findByIdAndUpdate(
      req.params.id, 
      { title, content },
      { new: true, }

    );
    if (!updateNote) 
      return res.status(404).json({ message: "Note not found" });
    // If the note is not found, return a 404 error
    res.status(200).json(updateNote);
      
  } catch (error) {
    console.error("Error updateNote controller:", error);
    // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function deleteNote(req, res) {
 try { 
        const deletedNote = await Note.findByIdAndDelete(
      req.params.id, 
      { title, content },
      { new: true, }
    );
    if (!deletedNote) 
      return res.status(404).json({ message: "Note not found" });
    // If the note is not found, return a 404 error
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleteNote controller:", error);
    // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error" });
  }
}
