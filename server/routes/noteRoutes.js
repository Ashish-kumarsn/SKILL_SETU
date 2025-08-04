import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
  createNote,
  getNotesByLecture,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';

const router = express.Router();

// ✅ Apply middleware to protect all routes
router.use(isAuthenticated);

// POST: Create a note
router.post('/', createNote);

// GET: List all notes for a lecture
router.get('/:courseId/:lectureId', getNotesByLecture);

// PUT: Update a note
router.put('/:noteId', updateNote);

// DELETE: Delete a note
router.delete('/:noteId', deleteNote);

export default router;
