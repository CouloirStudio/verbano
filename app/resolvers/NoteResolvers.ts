import {Note} from '../models/Note';
import {AddNoteArgs, DeleteNoteArgs, GetNoteArgs, ResolverContext, UpdateNoteArgs,} from './types';
import {Project} from '../models/Project';

/**
 * Resolvers for querying notes from the database.
 */
export const NoteQueries = {
  /**
   * Retrieve a specific note based on the provided ID.
   * @param _ - Root object (unused in this query).
   * @param args - Arguments for the query, including the ID of the note to retrieve.
   * @param _context - Resolver context (unused in this query).
   * @returns The retrieved note object, or null if no note is found with the provided ID.
   */
  async getNote(_: unknown, args: GetNoteArgs, _context: ResolverContext) {
    const note = await Note.findById(args.id);
    if (!note) {
      console.error(`No note found with ID ${args.id}.`);
      return null;
    }
    return note;
  },

  /**
   * Retrieve a list of all notes from the database.
   * @returns An array of notes, or an empty array if no notes are found.
   */
  async listNotes() {
    const notes = await Note.find();
    if (!notes) {
      console.error('No notes found.');
      return [];
    }

    const finalNotes = notes.map((note) => {
      const objNote = note.toObject();
      objNote.id = objNote._id.toString();
      delete objNote._id;
      return objNote;
    });
    return finalNotes;
  },
};

/**
 * Resolvers for mutating (creating, updating, deleting) notes in the database.
 */
export const NoteMutations = {
  /**
   * Create a new note in the database.
   * @param _ - Root object (unused in this mutation).
   * @param args - Arguments for the mutation, including the details of the note to create.
   * @param _context - Resolver context (unused in this mutation).
   * @returns The created note object.
   */
  async addNote(_: unknown, args: AddNoteArgs, _context: ResolverContext) {
    const note = new Note(args.input);
    const project = await Project.findById(args.input.projectId);
    if (!project) {
      console.error(`No project found with ID ${args.input.projectId}.`);
      return null;
    }

    const savedNote = await note.save();
    project.notes.push(savedNote._id);
    await project.save();
    return savedNote;
  },

  /**
   * Update the details of an existing note in the database.
   * @param _ - Root object (unused in this mutation).
   * @param args - Arguments for the mutation, including the ID of the note to update and the new details.
   * @param _context - Resolver context (unused in this mutation).
   * @returns The updated note object.
   */
  async updateNote(
    _: unknown,
    args: UpdateNoteArgs,
    _context: ResolverContext,
  ) {
    return await Note.findByIdAndUpdate(args.id, args.input, { new: true });
  },

  async moveNoteToProject(
    _: unknown,
    args: { noteId: string; projectId: string },
    _context: ResolverContext,
  ) {
    const note = await Note.findById(args.noteId);
    if (!note) {
      console.error(`No note found with ID ${args.noteId}.`);
      return null;
    }

    const project = await Project.findById(args.projectId);
    if (!project) {
      console.error(`No project found with ID ${args.projectId}.`);
      return null;
    }

    const oldProject = await Project.findById(note.projectId);
    if (!oldProject) {
      console.error(`No project found with ID ${note.projectId}.`);
      return null;
    }

    note.projectId = project.id;
    await note.save();

    const index = oldProject.notes.indexOf(note._id);
    if (index > -1) {
      oldProject.notes.splice(index, 1);
      await oldProject.save();
    }

    project.notes.push(note._id);
    await project.save();

    return note;
  },

  async moveNoteOrder(
    _: unknown,
    args: { noteId: string; order: number },
    _context: ResolverContext,
  ) {
    // Fetch the note
    const note = await Note.findById(args.noteId);
    if (!note) {
      console.error(`No note found with ID ${args.noteId}.`);
      return null;
    }

    // Fetch the associated project
    const project = await Project.findById(note.projectId);
    if (!project) {
      console.error(`No project found with ID ${note.projectId}.`);
      return null;
    }

    // Find the current index of the note within the project
    const index = project.notes.findIndex(
      (noteId) => noteId.toString() === note._id.toString(),
    );

    if (index === -1) {
      console.error(`Note not found within the project's notes array.`);
      return null;
    }

    console.log('Old order:', project.notes);

    // Create a copy of the project's notes array for manipulation
    const newNotesArray = [...project.notes];

    // Remove the note from its current position
    newNotesArray.splice(index, 1);

    // Calculate the new insert position ensuring it's within bounds
    const insertAt = Math.min(newNotesArray.length, Math.max(0, args.order));

    // Insert the note at the new position
    newNotesArray.splice(insertAt, 0, note._id);

    // Assign the manipulated notes array back to the project
    project.notes = newNotesArray;

    // Mark the notes field as modified and save
    project.markModified('notes');
    await project.save();

    console.log('New order:', project.notes);

    return note;
  },

  /**
   * Delete a specific note from the database.
   * @param _ - Root object (unused in this mutation).
   * @param args - Arguments for the mutation, including the ID of the note to delete.
   * @param _context - Resolver context (unused in this mutation).
   * @returns True if the note was successfully deleted, false otherwise.
   */
  async deleteNote(
    _: unknown,
    args: DeleteNoteArgs,
    _context: ResolverContext,
  ) {
    const deleted = await Note.findByIdAndDelete(args.id);
    return !!deleted; // Return true if a note was deleted
  },
};
