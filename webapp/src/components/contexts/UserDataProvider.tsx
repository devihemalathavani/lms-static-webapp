import React, { useEffect, useMemo, useState } from "react";
import { useAuth0, User } from "@auth0/auth0-react";
import { authorize } from "../../lib/auth";
import useGetUserPermissions from "../../hooks/useGetUserPermissions";

type UserDataContextType = {
  userData?: User;
  authorize: ReturnType<typeof authorize>;
  setUserData: React.Dispatch<React.SetStateAction<User | undefined>>;
};

export const UserDataContext = React.createContext<UserDataContextType>({
  userData: {},
  authorize: (args) => false,
  setUserData: () => void 0,
});

type UserDataProviderProps = {
  children: React.ReactNode;
};

function UserDataProvider(props: UserDataProviderProps) {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState<User>();
  const { data: permissions } = useGetUserPermissions(isAuthenticated);

  const authorizeCallback = useMemo(
    () => authorize(permissions || []),
    [permissions]
  );

  useEffect(() => {
    setUserData(user);
  }, [user]);

  return (
    <UserDataContext.Provider
      value={{
        setUserData,
        userData,
        authorize: authorizeCallback,
      }}
    >
      {props.children}
    </UserDataContext.Provider>
  );
}

export default UserDataProvider;
