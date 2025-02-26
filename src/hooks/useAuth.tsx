import { AuthContext } from "@/context/auth-context";
import { User } from "@/types";
import { useEffect, useCallback, useContext } from "react";

export const useAuth = ({
  fetchOnLoad = false,
}: {
  fetchOnLoad?: boolean;
} = {}) => {
  const { setUser, setIsLoading } = useContext(AuthContext);

  const fetchUser = useCallback(() => {
    try {
      const myData = localStorage.getItem("userData") ?? "";

      if (myData) {
        const result: User = JSON.parse(myData);
        setUser(result);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [setIsLoading, setUser]);

  useEffect(() => {
    if (fetchOnLoad) {
      fetchUser();
    }
  }, [fetchOnLoad, fetchUser]);
};
