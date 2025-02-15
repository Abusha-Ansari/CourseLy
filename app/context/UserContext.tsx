"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";

// Define User Data Type
interface UserData {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isRegistered: boolean;
  created_at: string;
}

// Define Context Type
interface UserContextType {
  userData: UserData | null;
  loading: boolean;
}

// Create Context with default values
const UserContext = createContext<UserContextType>({
  userData: null,
  loading: true,
});

// Create Provider Component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }

    if (session?.user) {
      setUserData({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        // @ts-ignore
        isAdmin: session.user.isAdmin,
        // @ts-ignore
        isRegistered: session.user.isRegistered,
        created_at: session.user.created_at,
      });
    } else {
      setUserData(null);
    }

    setLoading(false);
  }, [session, status]);

  return (
    <UserContext.Provider value={{ userData, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for accessing user data
export const useUser = () => useContext(UserContext);
