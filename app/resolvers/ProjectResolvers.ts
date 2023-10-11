import { INote, Note } from '../models/Note';
import { IProject, Project } from '../models/Project';

export const ProjectQueries = {
  async listProjects(): Promise<IProject[]> {
    const projects = await Project.find();
    if (!projects || projects.length === 0) {
      console.error('No projects found.');
      return [];
    }

    const finalProjects = projects.map((project) => {
      const objProject = project.toObject();
      objProject.id = objProject._id.toString();
      delete objProject._id;
      return objProject;
    });
    console.log('Returning projects:', finalProjects); // Added log
    return finalProjects;
  },
};

export const ProjectType = {
  async notes(project: { id: string; notes: string[] }): Promise<INote[]> {
    const notes = await Note.find({ _id: { $in: project.notes } });
    if (!notes || notes.length === 0) {
      console.error(`No notes found for project with ID ${project.id}.`);
      return [];
    }

    const finalNotesForProject = notes.map((note) => {
      const objNote = note.toObject();
      objNote.id = objNote._id.toString();
      delete objNote._id;
      return objNote;
    });
    console.log('Returning notes for project:', finalNotesForProject); // Added log
    return finalNotesForProject;
  },
};
