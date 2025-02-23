import { db } from "@/config/firebase.config";
import { LoaderPage } from "@/routes/loader-page";
import { User } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthHandler = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const storeUserData = async () => {
    if (isSignedIn && user) {
      setLoading(true);
      try {
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          const userData: User = {
            id: user.id,
            name: user.fullName || user.firstName || "Anonymous",
            email: user.primaryEmailAddress?.emailAddress || "N/A",
            imageUrl: user.imageUrl,
            createdAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          };
          await setDoc(userRef, userData);
          console.log("User created successfully in Firestore");
        }
      } catch (error) {
        console.log("Error on storing the user data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    storeUserData();
  }, [isSignedIn, user, pathname, navigate]);

  if (loading) {
    return <LoaderPage />;
  }
  return null;
};
