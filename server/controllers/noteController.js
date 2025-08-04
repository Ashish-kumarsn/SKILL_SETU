// controllers/noteController.js

import Note from '../models/Note.js';

// ✅ Create a new note
export const createNote = async (req, res) => {
  try {
    const { courseId, lectureId, content, timestamp } = req.body;

    const newNote = await Note.create({
      user: req.id,  // from auth middleware
      course: courseId,
      lecture: lectureId,
      content,
      timestamp: timestamp || '',
    });

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create note', error });
  }
};

// ✅ Get all notes for a specific lecture
export const getNotesByLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    const notes = await Note.find({
      user: req.id,
      course: courseId,
      lecture: lectureId,
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notes', error });
  }
};

// ✅ Update a note
export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { content, timestamp } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: noteId, user: req.id },
      { content, timestamp },
      { new: true }
    );

    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update note', error });
  }
};

// ✅ Delete a note
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOneAndDelete({
      _id: noteId,
      user: req.id, 
    });

    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note', error });
  }
};
