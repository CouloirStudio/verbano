import { INote, Note } from '../models/Note';
import { IProject, Project } from '../models/Project';
import { ApolloError } from 'apollo-server-express';

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
      throw new ApolloError(
        `No notes found for project with ID ${project.id}.`,
      );
    }

    return notes.map((note) => {
      const objNote = note.toObject();
      objNote.id = objNote._id.toString();
      delete objNote._id;
      return objNote;
    });
  },
};
