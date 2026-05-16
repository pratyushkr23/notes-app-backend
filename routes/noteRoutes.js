const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createNote,
  getNotes,
  getSingleNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
} = require("../controllers/noteController");

const router = express.Router();

router.use(protect);

router.get("/search", searchNotes);

router.route("/notes")
  .post(createNote)
  .get(getNotes);

router.route("/notes/:id")
  .get(getSingleNote)
  .put(updateNote)
  .delete(deleteNote);

router.post("/notes/:id/share", shareNote);

module.exports = router;