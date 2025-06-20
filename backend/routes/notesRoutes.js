import express from "express";

// Importing express to create a router for handling notes-related routes

import { getAllNotes, createNote, updateNote, deleteNote, getNoteById} from "../controllers/notesController.js";
// Importing express to create a router for handling notes-related routes

const router = express.Router();

//This is whats called a controller function
router.get("/", getAllNotes);
router.get("/:id", getNoteById); // Assuming you have a function to get a note by ID
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export  default router;
//The functions getAllNotes, creatNote, updateNote, and deleteNote are
//known as the controller functions for handling the respective HTTP requests.
//These functions are imported from the notesController.js file and are used to handle the logic for each route.