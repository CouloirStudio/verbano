import { UserMutations, UserQueries } from './UserResolvers';
import { ProjectQueries } from './ProjectResolvers';
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
};

export default resolvers;
