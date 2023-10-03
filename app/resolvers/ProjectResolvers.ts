import {INote, Note} from '../models/Note';
import {IProject, Project} from '../models/Project';

export const ProjectQueries = {
  async listProjects(): Promise<IProject[]> {
    const projects = await Project.find();
    if (!projects) {
      console.error('No projects found.');
      return [];
    }

    // Log projects and filter out projects without a name
    const validProjects = projects.filter((project) => {
      if (!project.name) {
        console.error(`Project with ID ${project.id} is missing a name.`);
        return false;
      }
      return true;
    });

    console.log(validProjects); // log valid projects
    return validProjects;
  },
};

export const ProjectType = {
  async notes(project: { id: string }): Promise<INote[]> {
    const notes = await Note.find({projectId: project.id});
    if (!notes) {
      console.error(`No notes found for project with ID ${project.id}.`);
      return [];
    }
    return notes;
  },
};
