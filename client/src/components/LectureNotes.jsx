// src/components/LectureNotes.jsx

import React, { useState } from "react";
import {
  useGetLectureNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} from "@/features/api/noteApi";

const LectureNotes = ({ courseId, lectureId }) => {
  const [noteText, setNoteText] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [editingId, setEditingId] = useState(null);

  const { data: notes = [], isLoading, isError } = useGetLectureNotesQuery({ courseId, lectureId });
  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    try {
      if (editingId) {
        await updateNote({ noteId: editingId, content: noteText, timestamp });
      } else {
        await createNote({ courseId, lectureId, content: noteText, timestamp });
      }

      setNoteText("");
      setTimestamp("");
      setEditingId(null);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleEdit = (note) => {
    setNoteText(note.content);
    setTimestamp(note.timestamp || "");
    setEditingId(note._id);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this note?")) {
      await deleteNote(id);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Lecture Notes</h3>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <textarea
          rows={4}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder="Write your note..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Optional timestamp (e.g., 03:12)"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          {editingId ? "Update Note" : "Add Note"}
        </button>
      </form>

      {/* Notes List */}
      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading notes...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to load notes.</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No notes yet.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note._id}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-4 rounded-md"
            >
              <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{note.content}</p>
              {note.timestamp && (
                <p className="text-sm text-purple-500 mt-1">⏱️ {note.timestamp}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span>
                  {new Date(note.createdAt).toLocaleString()}
                </span>
                <div className="space-x-3">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LectureNotes;
