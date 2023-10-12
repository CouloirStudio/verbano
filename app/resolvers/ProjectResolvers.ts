import { INote, Note } from '../models/Note';
import { IProject, Project } from '../models/Project';
import { ApolloError } from 'apollo-server-express';

export const ProjectQueries = {
  async listProjects(): Promise<IProject[]> {
    const projects = await Project.find();
    if (!projects || projects.length === 0) {
      throw new ApolloError('No projects found.');
    }

    const finalProjects = projects.map((project) => {
      const objProject = project.toObject();
      objProject.id = objProject._id.toString();
      delete objProject._id;
      return objProject;
    });
    console.log('Returning projects:', finalProjects);
    return finalProjects;
  },
};

export const ProjectType = {
  async notes(project: { id: string; notes: string[] }): Promise<INote[]> {
    const notes = await Note.find({ _id: { $in: project.notes } });
    if (!notes || notes.length === 0) {
      throw new ApolloError(
        `No notes found for project with ID ${project.id}.`,
      );
    }

    const finalNotesForProject = notes.map((note) => {
      const objNote = note.toObject();
      objNote.id = objNote._id.toString();
      delete objNote._id;
      return objNote;
    });
    console.log('Returning notes for project:', finalNotesForProject);
    return finalNotesForProject;
  },
};
