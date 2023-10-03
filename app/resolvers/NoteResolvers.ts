import { Note } from '../models/Note';
import {
  ResolverContext,
  GetNoteArgs,
  AddNoteArgs,
  UpdateNoteArgs,
  DeleteNoteArgs,
} from './types';

const NoteResolvers = {
  Query: {
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
      return notes;
    },
  },
  Mutation: {
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
  },
};

export default NoteResolvers;
