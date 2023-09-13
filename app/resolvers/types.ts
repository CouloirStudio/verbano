import { Request } from 'express';

export interface ResolverContext {
  req: Request;
}

export interface GetNoteArgs {
  id: string;
}

export interface AddNoteArgs {
  input: {
    audioLocation: string;
    transcription?: string;
    tags: string[];
    projectId: string;
    noteName: string;
    noteDescription?: string;
  };
}

export interface UpdateNoteArgs {
  id: string;
  input: {
    audioLocation: string;
    transcription?: string;
    tags: string[];
    projectId: string;
    noteName: string;
    noteDescription?: string;
  };
}

export interface DeleteNoteArgs {
  id: string;
}
