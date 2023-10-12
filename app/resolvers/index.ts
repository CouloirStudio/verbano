import { UserMutations, UserQueries } from './UserResolvers';
import { ProjectQueries, ProjectType } from './ProjectResolvers';
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
  },
  Project: ProjectType, // <-- Add this line
};

export default resolvers;
