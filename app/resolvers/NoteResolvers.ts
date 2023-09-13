import { Note } from '../models/dbModels.mongo';
import { ResolverContext, GetNoteArgs, AddNoteArgs, UpdateNoteArgs, DeleteNoteArgs } from './types';

const NoteResolvers = {
  Query: {
    async getNote(_: any, args: GetNoteArgs, context: ResolverContext) {
      return await Note.findById(args.id);
    },
    async listNotes() {
      return await Note.find();
    }
  },
  Mutation: {
    async addNote(_: any, args: AddNoteArgs, context: ResolverContext) {
      const note = new Note(args.input);
      return await note.save();
    },
    async updateNote(_: any, args: UpdateNoteArgs, context: ResolverContext) {
      return await Note.findByIdAndUpdate(args.id, args.input, { new: true });
    },
    async deleteNote(_: any, args: DeleteNoteArgs, context: ResolverContext) {
      const deleted = await Note.findByIdAndDelete(args.id);
      return !!deleted;  // Return true if a note was deleted
    }
  }
};

export default NoteResolvers;
