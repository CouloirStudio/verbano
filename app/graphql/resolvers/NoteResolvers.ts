import {Note} from '../../models/Note';
import {AddNoteArgs, DeleteNoteArgs, GetNoteArgs, ResolverContext, UpdateNoteArgs,} from './types';
import {Project} from '../../models/Project';

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
   *
   * @param _ - Root object (unused in this query).
   * @param args Arguments for the query, including the ID of the note to retrieve.
   * @param _context - Resolver context (unused in this query).
   * @returns The transcription extracted from the note object
   */
  async getTranscription(
    _: unknown,
    args: GetNoteArgs,
    _context: ResolverContext,
  ) {
    const note = await Note.findById(args.id);
    if (!note) {
      console.error(`No note found with ID ${args.id}.`);
      return null;
    }
    return note.transcription;
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

    // Determine the new note's position
    const position = project.notes.length;

    // Add the note to the project's notes array
    project.notes.push({
      note: savedNote._id,
      position: position,
    });

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
    // check if note name is empty
    if (args.input.noteName.trim() === '') {
      throw new Error('Note name cannot be empty');
    }

    return Note.findByIdAndUpdate(args.id, args.input, { new: true });
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

    const projectId = await note.getProjectId();
    if (!projectId) {
      console.error(
        `No associated project found for note with ID ${note._id}.`,
      );
      throw new Error('No associated project found for note.');
    }

    const oldProject = await Project.findById(projectId);
    if (!oldProject) {
      console.error(`No project found with ID ${projectId}.`);
      return null;
    }

    if (oldProject.id.toString() === args.projectId) {
      console.log('Note is already in the target project.');
      return note;
    }

    const newPosition = project.notes.length; // Add it to the end of the list

    // Add the note to the target project's notes array with the specified position
    project.notes.push({
      note: note._id.toString(),
      position: newPosition,
    });

    // Remove the note from the old project's notes array
    const indexInOldProject = oldProject.notes.findIndex(
      (item) => item.note && item.note.toString() === note._id.toString(),
    );
    if (indexInOldProject > -1) {
      oldProject.notes.splice(indexInOldProject, 1);
    }

    // Save the changes to both projects
    await project.save();
    await oldProject.save();

    return note;
  },

  async moveNoteOrder(
    _: unknown,
    args: { noteId: string; order: number },
    _context: ResolverContext,
  ) {
    const note = await Note.findById(args.noteId);
    if (!note) {
      console.error(`No note found with ID ${args.noteId}.`);
      return null;
    }

    const project = await Project.findOne({ 'notes.note': note._id });
    if (!project) {
      console.error(`No project found containing note ID ${args.noteId}.`);
      return null;
    }

    const notePositionObject = project.notes.find(
      (n) => n.note.toString() === note._id.toString(),
    );

    if (!notePositionObject) {
      console.error(`Note not found in project's notes array.`);
      return null;
    }

    const index = project.notes.indexOf(notePositionObject);

    // Remove the note from its current position
    if (index > -1) {
      project.notes.splice(index, 1);
    }

    const newPosition = {
      note: note._id,
      position: args.order,
    };
    project.notes.splice(args.order, 0, newPosition);

    // Adjust positions of other notes
    for (let i = 0; i < project.notes.length; i++) {
      project.notes[i].position = i;
    }

    project.markModified('notes');
    await project.save();

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
    // First, find and delete the note from the 'notes' collection
    const deletedNote = await Note.findByIdAndDelete(args.id);
    if (!deletedNote) {
      return false; // If no note was found and deleted, return false
    }

    // Next, find any projects that reference this note and remove the reference
    await Project.updateMany(
      { 'notes.note': args.id },
      { $pull: { notes: { note: args.id } } },
    );

    // Return true if a note was found and deleted, false otherwise
    return !!deletedNote;
  },
};
