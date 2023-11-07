import {INote, Note} from '../../models/Note';
import {ISummary} from '../../models/Summary';
import {IProject, Project} from '../../models/Project';
import {ApolloError} from 'apollo-server-express';
import {User} from '../../models/User';

/**
 * Resolvers for querying projects from the database.
 */
export const ProjectQueries = {
  /**
   * Retrieve a list of all projects from the database.
   * @throws ApolloError - Throws an error if no projects are found.
   * @returns An array of projects.
   */
  async listProjects(
    _: unknown,
    __: unknown,
    context: any,
  ): Promise<IProject[]> {
    if (!context.getUser()) {
      throw new Error('User not authenticated.');
    }

    const user = await User.findById(context.getUser()._id);
    if (!user) {
      throw new Error('User not found.');
    }
    const projectIds = user.projectIds;

    const projects = await Project.find({
      _id: { $in: projectIds },
    }).populate('notes.note');

    projects.forEach((project) => {
      project.notes = project.notes.filter((noteRef) => noteRef.note);
      project.summaries = project.summaries.filter(
        (summaryRef) => summaryRef.summary,
      );
    });

    if (!projects || projects.length === 0) {
      throw new ApolloError('No projects found.');
    }

    return projects;
  },

  async getProject(_: unknown, args: { id: string }): Promise<IProject> {
    const project = await Project.findById(args.id);
    if (!project) {
      throw new ApolloError('No project found.');
    }

    const objProject = project.toObject();
    objProject.id = objProject._id.toString();
    delete objProject._id;
    return objProject;
  },
};

export const ProjectMutations = {
  async addProject(
    _: unknown,
    args: { input: { projectName: string; projectDescription?: string } },
    context: any,
  ) {
    if (!context.getUser()) {
      throw new Error('User not authenticated.');
    }

    const user = await User.findById(context.getUser()._id);
    if (!user) {
      throw new Error('User not found.');
    }

    try {
      const project = new Project({
        projectName: args.input.projectName,
        projectDescription: args.input.projectDescription,
        notes: [],
      });

      await project.save();

      const defaultNote = new Note({
        dateCreated: new Date().toISOString(),
        audioLocation: '',
        transcription: '',
        tags: [],
        noteName: 'Default Note',
      });

      const savedDefaultNote = await defaultNote.save();

      // Add the default note's ID to the project's notes array
      project.notes.push({ note: savedDefaultNote._id, position: 0 });
      await project.save();

      if (!user.projectIds) {
        user.projectIds = [];
      }

      const objProject = project.toObject();
      objProject.id = objProject._id.toString();

      user.projectIds.push(objProject.id);
      user.save();

      delete objProject._id;
      return objProject;
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    }
  },

  async deleteProject(_: unknown, args: { id: string }, context: any) {
    if (!context.getUser()) {
      throw new Error('User not authenticated.');
    }

    //delete all notes in project
    const project = await Project.findById(args.id);
    if (!project) {
      throw new Error('Project not found.');
    }

    const notes = project.notes;
    for (let i = 0; i < notes.length; i++) {
      await Note.findByIdAndDelete(notes[i].note);
    }

    try {
      await Project.findByIdAndDelete(args.id);
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  },
};

/**
 * Type resolvers related to the Project type.
 */
export const ProjectType = {
  /**
   * Retrieve a list of notes associated with a given project.
   * @param project - The project for which notes are to be fetched.
   * @throws ApolloError - Throws an error if no notes are found for the given project.
   * @returns An array of notes associated with the project.
   */
  async notes(project: {
    id: string;
    notes: { note: INote; position: number }[];
  }): Promise<{ note: INote; position: number }[]> {
    return project.notes.map(({ note, position }) => {
      if (note && typeof note.toObject === 'function') {
        const objNote = note.toObject();
        objNote.id = objNote._id.toString();
        delete objNote._id;
        return { note: objNote, position };
      } else {
        console.error('Unexpected note structure:', note);
        // If you want to handle errors more gracefully, you can:
        // - Return a default note structure
        // - Or filter out the invalid notes, but this would remove them from the result
        // For now, I'm just throwing the error as in your original code
        throw new ApolloError('Unexpected note structure.');
      }
    });
  },

  async summaries(project: {
    id: string;
    summaries: { summary: ISummary; position: number }[];
  }): Promise<{ summary: ISummary; position: number }[]> {
    return project.summaries.map(({ summary, position }) => {
      if (summary && typeof summary.toObject === 'function') {
        const objSummary = summary.toObject();
        objSummary.id = objSummary._id.toString();
        delete objSummary._id;
        return { summary: objSummary, position };
      } else {
        console.error('Unexpected summary structure:', summary);
        throw new ApolloError('Unexpected summary structure.');
      }
    });
  },
};
