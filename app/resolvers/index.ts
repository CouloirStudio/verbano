import userResolvers from './UserResolvers';
import noteResolvers from './NoteResolvers';
import projectResolvers from './ProjectResolvers';

const resolvers = {
  ...userResolvers,
  ...noteResolvers,
  ...projectResolvers,
};

export default resolvers;
