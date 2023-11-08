import { Request } from 'express';
import { GraphQLResolveInfo } from 'graphql';

export interface ResolverContext {
  req: Request;
}

export type Resolver<TArgs = unknown, TResult = unknown> = (
  parent: unknown,
  args: TArgs,
  context: ResolverContext,
  info: GraphQLResolveInfo,
) => Promise<TResult>;

export interface AddUserArgs {
  input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

export interface UpdateUserArgs {
  id: string;
  input: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface UpdatePasswordArgs {
  id: string;
  input: {
    oldPass: string;
    newPass: string;
    newPassConfirm: string;
  };
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

export type NoteType = {
  id: string;
  audioLocation: string;
  dateCreated?: Date;
  transcription?: string;
  tags: string[];
  projectId: string;
  noteName: string;
  noteDescription?: string;
};

export type ProjectType = {
  id: string;
  projectName: string;
  projectDescription?: string;
  notes: ProjectNoteType[];
};

export type ProjectNoteType = {
  note: NoteType;
} & HasPosition;

export type PositionedProjectType = {
  project: ProjectType;
} & HasPosition;

type HasPosition = {
  position: number;
};
