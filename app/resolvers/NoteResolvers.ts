import { Note } from '../models/Note';
import {
  AddNoteArgs,
  DeleteNoteArgs,
  GetNoteArgs,
  ResolverContext,
  UpdateNoteArgs,
} from './types';

export const NoteQueries = {
  async getNote(_: unknown, args: GetNoteArgs, _context: ResolverContext) {
    const note = await Note.findById(args.id);
    if (!note) {
      console.error(`No note found with ID ${args.id}.`);
      return null;
    }
    return note;
  },
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
    console.log('Returning notes:', finalNotes); // Added log
    return finalNotes;
  },
};

export const NoteMutations = {
  async addNote(_: unknown, args: AddNoteArgs, _context: ResolverContext) {
    const note = new Note(args.input);
    return await note.save();
  },
  async updateNote(
    _: unknown,
    args: UpdateNoteArgs,
    _context: ResolverContext,
  ) {
    return await Note.findByIdAndUpdate(args.id, args.input, { new: true });
  },
  async deleteNote(
    _: unknown,
    args: DeleteNoteArgs,
    _context: ResolverContext,
  ) {
    const deleted = await Note.findByIdAndDelete(args.id);
    return !!deleted; // Return true if a note was deleted
  },
};
