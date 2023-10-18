import { INote, Note } from '../models/Note';
import { IProject, Project } from '../models/Project';
import { ApolloError } from 'apollo-server-express';
import { User } from '../models/User';

/**
 * Resolvers for querying projects from the database.
 */
export const ProjectQueries = {
  /**
   * Retrieve a list of all projects from the database.
   * @throws ApolloError - Throws an error if no projects are found.
   * @returns An array of projects.
   */
  async listProjects(): Promise<IProject[]> {
    const projects = await Project.find();
    if (!projects || projects.length === 0) {
      throw new ApolloError('No projects found.');
    }

    return projects.map((project) => {
      const objProject = project.toObject();
      objProject.id = objProject._id.toString();
      delete objProject._id;
      return objProject;
    });
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
        projectId: project._id,
        noteName: 'Default Note',
      });

      const savedDefaultNote = await defaultNote.save();

      // Add the default note's ID to the project's notes array
      project.notes.push(savedDefaultNote._id);
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
  async notes(project: { id: string; notes: string[] }): Promise<INote[]> {
    const notes = await Note.find({ _id: { $in: project.notes } });
    if (!notes || notes.length === 0) {
      return [];
      // throw new ApolloError(
      //   `No notes found for project with ID ${project.id}.`,
      // );
    }

    return notes.map((note) => {
      const objNote = note.toObject();
      objNote.id = objNote._id.toString();
      delete objNote._id;
      return objNote;
    });
  },
};
