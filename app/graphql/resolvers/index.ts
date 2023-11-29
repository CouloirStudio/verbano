import { UserMutations, UserQueries } from "./UserResolvers";
import { ProjectMutations, ProjectQueries, ProjectType } from "./ProjectResolvers";
import { NoteMutations, NoteQueries } from "./NoteResolvers";

/**
 * Consolidation of Graphql resolvers.
 */
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
  Project: {
    ...ProjectType,
  },
};

export default resolvers;
