import { UserMutations, UserQueries } from './UserResolvers';
import {
  ProjectMutations,
  ProjectQueries,
  ProjectType,
} from './ProjectResolvers';
import { NoteMutations, NoteQueries } from './NoteResolvers';

const resolvers = {
  Query: {
    ...UserQueries,
    ...NoteQueries,
    ...ProjectQueries,
  },
  Mutation: {
    ...UserMutations,
    ...NoteMutations,
    ...ProjectMutations,
  },
  Project: ProjectType, // <-- Add this line
};

export default resolvers;
