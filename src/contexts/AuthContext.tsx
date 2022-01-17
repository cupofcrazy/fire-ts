import { useState, useEffect, createContext, useContext, useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc, deleteDoc, DocumentData, } from "@firebase/firestore";
import { deleteObject, ref } from 'firebase/storage';
import { auth, db, storage } from "../lib/firebase";
import type { UserDoc } from '../types/index';
import { getUserDoc } from '../utils/index';
import { usePinReducer, State, Action } from '../reducers/usePinReducer';
import { PinDocType } from '../types/index';
import { useToast } from './ToastContext';
import { v4 as uuid } from 'uuid';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: UserDoc | null;
  setUser: React.Dispatch<React.SetStateAction<UserDoc | null>>;
  signInWithGoogle: () => Promise<void>;
  signOutWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  console.log(toast)
  const [user, setUser] = useState<UserDoc | null>(null);
  const isAuthenticated = useMemo(() => user !== null, [user]);
  const [state, dispatch] = usePinReducer()

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


  // Sign Out
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
      setLoading(false)
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
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  return children;
};

export const useAuth = () => useContext(AuthContext)!;
