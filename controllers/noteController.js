const Note = require("../models/Note");
const User = require("../models/User");

// Create Note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const note = await Note.create({
      title,
      content,
      user: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      $or: [
        { user: req.user._id },
        { sharedWith: req.user._id },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Note
const getSingleNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    const isOwner =
      note.user.toString() === req.user._id.toString();

    const isShared =
      note.sharedWith.includes(req.user._id);

    if (!isOwner && !isShared) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Note
const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only owner can update note",
      });
    }

    note.title = title || note.title;
    note.content = content || note.content;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only owner can delete note",
      });
    }

    await note.deleteOne();

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Share Note
const shareNote = async (req, res) => {
  try {
    const { share_with_email } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only owner can share note",
      });
    }

    const userToShare = await User.findOne({
      email: share_with_email,
    });

    if (!userToShare) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!note.sharedWith.includes(userToShare._id)) {
      note.sharedWith.push(userToShare._id);

      await note.save();
    }

    res.status(200).json({
      message: "Note shared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Search Notes
const searchNotes = async (req, res) => {
  try {
    const keyword = req.query.q;

    const notes = await Note.find({
      $and: [
        {
          $or: [
            { user: req.user._id },
            { sharedWith: req.user._id },
          ],
        },

        {
          $or: [
            {
              title: {
                $regex: keyword,
                $options: "i",
              },
            },

            {
              content: {
                $regex: keyword,
                $options: "i",
              },
            },
          ],
        },
      ],
    });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  getSingleNote,
  updateNote,
  deleteNote,
  shareNote,
  searchNotes,
};