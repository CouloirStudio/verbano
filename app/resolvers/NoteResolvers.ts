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
