import { Request } from "express";
import { GraphQLResolveInfo } from "graphql";

/**
 * Interface for resolver context
 */
export interface ResolverContext {
  req: Request;
}

/**
 * Interface for Graphql resolvers
 */
export type Resolver<TArgs = unknown, TResult = unknown> = (
  parent: unknown,
  args: TArgs,
  context: ResolverContext,
  info: GraphQLResolveInfo,
) => Promise<TResult>;

/**
 * Interface for the arguments to the AddUser mutation.
 */
export interface AddUserArgs {
  input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

/**
 * Interface for the arguments to the UpdateUser mutation.
 */
export interface UpdateUserArgs {
  id: string;
  input: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

/**
 * Interface for the arguments to the UpdatePassword mutation
 */
export interface UpdatePasswordArgs {
  id: string;
  input: {
    oldPass: string;
    newPass: string;
    newPassConfirm: string;
  };
}

/**
 * Interface for the arguments to the GetNote mutation.
 */
export interface GetNoteArgs {
  id: string;
}

/**
 * Interface for the arguments to the AddNote mutation.
 */
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

/**
 * Interface for the arguments to the UpdateNote mutation.
 */
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

/**
 * Interface for the arguments to the DeleteNote mutation
 */
export interface DeleteNoteArgs {
  id: string;
}

/**
 * Type definition for a Note
 */
export type NoteType = {
  id: string;
  audioLocation: string;
  dateCreated?: Date;
  transcription?: string;
  summary?: string;
  tags: string[];
  projectId: string;
  noteName: string;
  noteDescription?: string;
};

/**
 * Type definition for a summary
 */
export type SummaryType = {
  id: string;
  summaryName: string;
  summaryDescription?: string;
  content: string;
  templateId: string;
  noteIds: string[];
};

/**
 * Type definition for a project summary
 */
export type ProjectSummaryType = {
  summary: SummaryType;
  position: number;
};

/**
 * Type definition for a project
 */
export type ProjectType = {
  id: string;
  projectName: string;
  projectDescription?: string;
  notes: ProjectNoteType[];
  summaries: ProjectSummaryType[];
};

/**
 * Type definition for a ProjectNote
 */
export type ProjectNoteType = {
  note: NoteType;
} & HasPosition;

/**
 * Type definition for a PositionedProject
 */
export type PositionedProjectType = {
  project: ProjectType;
} & HasPosition;

type HasPosition = {
  position: number;
};
