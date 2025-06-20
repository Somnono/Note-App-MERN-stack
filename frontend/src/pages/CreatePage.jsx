import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import api from '../components/lib/axios';


const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Remeber we need both title and content to create a note!");
      return;
  }
    setLoading(true);
    try {
       await api.post("/notes", {
       title,
       content,
      });
      toast.success("Note created successfully!");
      navigate("/");
      // Reset form fields
      //setTitle("");
      //setContent("");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>
            <div className="card bg-base-100">
                <div className="card-body">
                  <h2 className="card-title text-2xl font-bold mb-4">Create a New Note</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-control mb-5">
                      <label className="label">
                        <span className="label-text">Title</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered w-full"
                        placeholder="Enter note title"
                        required
                      />
                    </div>

                     <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Content</span>
                      </label>
                      <textarea
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="textarea textarea-bordered h-32"
                        placeholder="Write your note here...."
                        required
                      />
                    </div>
                    <div className="card-actions justify-end">
                          <button type="Submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Creating..." : "Create    Note"}
                          </button>
                    </div>
                  </form>

                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default CreatePage;

