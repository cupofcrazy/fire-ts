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

interface AuthContextProps {
  isAuthenticated: boolean;
  user: UserDoc | null;
  setUser: React.Dispatch<React.SetStateAction<UserDoc | null>>;
  signInWithGoogle: () => Promise<void>;
  signOutWithGoogle: () => Promise<void>;
  state: State,
  dispatch: React.Dispatch<Action>,
  pinActions: {
    savePin: (pin: PinDocType) => Promise<void>
    unsavePin: (id: string) => Promise<void>
    deletePin: (pin: PinDocType) => Promise<void>
    disablePin: (id: string) => Promise<boolean>
  }
}

const AuthContext = createContext<AuthContextProps>(null!);

export const AuthProvider: React.FC = ({ children }) => {
  const navigate = useNavigate();
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

  // Save Pin
  const savePin = async (pin: PinDocType) => {
    dispatch({
      type: 'SAVE_PIN'
    })
    console.log('saving pin...')
    const ref = doc(db, `users/${user?.uid!}/saves`, pin?.id as string)
    await setDoc(ref, {
      ...pin
    }, {
      merge: true
    })
    // disable save button if pin is already saved
    try {
      await disablePin(pin?.id!)
      dispatch({
        type: 'PIN_SAVED',
        payload: true
      })
 
    } catch (e) {
      console.log({ e })
    }
  }

  // Disable "Save Pin" if already saved
  const disablePin = async (id: string) => {
    const pinRef = doc(db, `users/${user?.uid!}/saves`, id)
    const pinSnapshot = await getDoc(pinRef)
    if (pinSnapshot.exists()) {
      return true
    }
    return false
  }

  // Delete pin if user's
  const deletePin = async (pin: PinDocType) => {
    const pinRef = ref(storage, `images/${user?.username}/${pin.name}`)
    try {
      await deleteObject(pinRef) // Delete Image from Storage
      await deleteDoc(doc(db, 'images', pin?.id as string)) // Delete reference to Doc
      await unsavePin(pin.id!) // Unsave Pin by "delete"
      console.log('Doc deleted successfully')
      navigate('/')
    } catch (e) {
      console.error({ e })
    }
  }

  // Unsave Pin, if saved
  const unsavePin = async (id: string): Promise<void> => {
    const pinRef = doc(db, `users/${user?.uid!}/saves`, id)
    await deleteDoc(pinRef)

    dispatch({
      type: 'PIN_SAVED',
      payload: false
    })
  }

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

  const pinActions = {
    savePin,
    unsavePin,
    deletePin,
    disablePin
  }
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        signInWithGoogle,
        signOutWithGoogle,
        pinActions,
        state, dispatch
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
