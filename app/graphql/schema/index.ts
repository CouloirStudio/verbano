import UserSchema from './UserSchema';
import NoteSchema from './NoteSchema';
import ProjectSchema from './ProjectSchema';
import SummarySchema from '@/app/graphql/schema/SummarySchema';

const typeDefs = [UserSchema, NoteSchema, ProjectSchema, SummarySchema];

export default typeDefs;
