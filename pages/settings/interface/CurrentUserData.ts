// Define an interface for the expected shape of the currentUser data
export default interface CurrentUserData {
  currentUser: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  } | null;
}
