export type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;
    Editor: { draftId?: string };
    Drive: undefined;
    NotFound: undefined;
  };
  
  export type ProtectedRouteProps = {
    children: React.ReactNode;
    requiredRole?: string;
  };