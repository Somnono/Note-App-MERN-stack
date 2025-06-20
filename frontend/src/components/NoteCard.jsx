import { Trash2Icon } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router'
import { formatDate } from './lib/utils';
import { PenSquareIcon } from 'lucide-react';
import api from '../components/lib/axios';
import { toast } from 'react-hot-toast';



const NoteCard = ({ note, setNotes }) => {
    
  const handleDelete = async (e, id) => {
      e.preventDefault(); // Prevent the default link behavior
      if (!window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
        return; // Exit if the user cancels
      }
    try {
      // Call the API to delete the note
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id));
      // Show success message
      toast.success("Note deleted successfully!");
      // Optionally, you can refresh the notes list or redirect
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note. Please try again later.");
    }
  }
  return (
    <Link to={`/note/${note._id}`} className="card bg-base-100 hover:shadow-lg transition-shadow duration-200
    border-t-4 border-solid border-[#00FF9D]">
        <div className="card-body">
            <h3 className="card-title text-base-content">{note.title}</h3>
            <p className="text-base-content/70 line-clamp-3">{note.content}</p>
            <div className="card-actions justify-between mt-4">
                <span className="text-xs text-base-content/50">{formatDate(new Date(note.createdAt))}</span>
                <div className="flex items-center gap-1">
                    <PenSquareIcon className="size-4 text-primary" />
                    <button className="btn btn-ghost btn-xs text-error" onClick={(e) => handleDelete(e, note._id)}>
                       <Trash2Icon className="size-4"/>
                    </button>    
                </div>
            </div> 
        </div>
    </Link>
  );
};

export default NoteCard;
