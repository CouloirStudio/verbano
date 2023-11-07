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

export interface UpdateUserArgs {
  id: string;
  input: {
    firstName: string;
    lastName: string;
    email: string;
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

export type SummaryType = {
  id: string;
  summaryName: string;
  summaryDescription?: string;
  content: string;
  templateId: string;
  noteIds: string[];
};

export type ProjectSummaryType = {
  summary: SummaryType;
  position: number;
};

export type ProjectType = {
  id: string;
  projectName: string;
  projectDescription?: string;
  notes: ProjectNoteType[];
  summaries: ProjectSummaryType[];
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
