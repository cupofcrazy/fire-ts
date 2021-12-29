import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc } from "@firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { UserDoc } from '../types/index';
import { getUserDoc } from '../utils/index';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: UserDoc | null;
  setUser: React.Dispatch<React.SetStateAction<UserDoc | null>>;
  signInWithGoogle: () => Promise<void>;
  signOutWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>(null!);

export const AuthProvider: React.FC = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDoc | null>(null);
  const isAuthenticated = useMemo(() => user !== null, [user]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);

    const currentUser = res.user;

    // check if user exists
    
    // if (docSnap.exists()) {
      //   console.log("user already exists.");
      //   navigate("/");
      //   return;
      // }
      const userMetadata = {
        uid: currentUser.uid,
      isOnline: true,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      email: currentUser.email,
      username: currentUser?.email?.split("@")[0],
    };
    
    await setDoc(doc(db, "users", currentUser.uid), userMetadata);
    const userDoc = await getUserDoc(currentUser.uid)
    setUser(userDoc as UserDoc);
  };

  const signOutWithGoogle = async () => {
    if (!user) return;
    try {
      await signOut(auth);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        isOnline: false,
      });
      setUser(null);
    } catch (error) {
      console.error(error);
      return;
    }
    console.log("Signed Out");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getUserDoc(currentUser.uid)
        setUser(userDoc);
      } else {
        setUser(null);
      }
    });
    console.log({ user });
    return unsubscribe;
  }, []);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        signInWithGoogle,
        signOutWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  return children;
};

export const useAuth = () => useContext(AuthContext);
