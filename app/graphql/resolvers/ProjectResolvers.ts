import { INote, Note } from '../../models/Note';
import { IProject, Project } from '../../models/Project';
import { ApolloError } from 'apollo-server-express';
import { User } from '../../models/User';
import { ResolverContext } from '@/app/graphql/resolvers/types';

/**
 * Resolvers for querying projects from the database.
 */
export const ProjectQueries = {
  /**
   * Retrieve a list of all projects from the database.
   * @throws ApolloError - Throws an error if no projects are found.
   * @returns An array of projects.
   */
  async listProjects(_: any, __: any, context: { getUser: () => any }) {
    // Authenticate user
    const userContext = context.getUser();
    if (!userContext) {
      throw new Error('User not authenticated.');
    }

    // Find user by ID from context
    const user = await User.findById(userContext.id).populate({
      path: 'projects.project',
      populate: { path: 'notes.note' },
    });
    if (!user) {
      throw new Error('User not found.');
    }

    // Check if user has projects
    if (!user.projects || user.projects.length === 0) {
      throw new Error('User has no projects.');
    }

    // return [project: id, position: number]
    return user.projects.sort((a, b) => a.position - b.position);
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

      if (!user.projects) {
        user.projects = [];
      }

      const objProject = project.toObject();
      objProject.id = objProject._id.toString();

      user.projects.push({
        project: objProject.id,
        position: user.projects.length,
      });
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

    const user = await User.findById(context.getUser().id);

    if (!user) {
      throw new Error('User not found.');
    }

    if (!user.projects) {
      throw new Error('User has no projects.');
    }

    // Delete project from user by filtering out the project with the matching id
    const updatedProjects = user.projects.filter(
      (projectEntry) => projectEntry.project.toString() !== args.id,
    );

    user.projects = updatedProjects;

    // Save the user after removing the project
    await user.save();

    // Delete all notes in project
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

  async updateProject(
    _: unknown,
    args: {
      id: string;
      input: { projectName: string; projectDescription?: string };
    },
    context: any,
  ) {
    if (!context.getUser()) {
      throw new Error('User not authenticated.');
    }

    const project = await Project.findById(args.id);
    if (!project) {
      throw new Error('Project not found.');
    }

    if (args.input.projectName.trim() == '') {
      throw new Error('Project name cannot be empty.');
    }

    return Project.findByIdAndUpdate(args.id, args.input, { new: true });
  },

  async moveProjectOrder(
    _: any,
    args: { projectId: string; order: number },
    _context: ResolverContext,
  ) {
    const project = await Project.findById(args.projectId);
    if (!project) {
      console.error(`No project found with ID ${args.projectId}.`);
      return null;
    }

    const user = await User.findOne({ 'projects.project': project._id });
    if (!user) {
      console.error(`No user found containing project ID ${args.projectId}.`);
      return null;
    }

    if (!user.projects) {
      console.error(`User does not have any projects.`);
      return null;
    }

    const projectPositionObject = user.projects.find(
      (p) => p.project.toString() === project._id.toString(),
    );

    if (!projectPositionObject) {
      console.error(`Project not found in user's projects array.`);
      return null;
    }

    const index = user.projects.indexOf(projectPositionObject);

    // Remove the project from its current position
    if (index > -1) {
      user.projects.splice(index, 1);
    }

    const newPosition = {
      project: project._id,
      position: args.order,
    };
    user.projects.splice(args.order, 0, newPosition);

    // Adjust positions of other projects
    for (let i = 0; i < user.projects.length; i++) {
      user.projects[i].position = i;
    }

    user.markModified('projects');
    await user.save();

    return project;
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
};
