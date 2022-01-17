import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { ref, deleteObject } from "firebase/storage"
import { db, storage } from "lib/firebase"
import { PinDocType } from "types"


// Save Pin
export const savePin = async (pin: PinDocType) => {
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
  // toast.show({
  //   message: 'Pin Saved',
  //   id: uuid(),
  // })
}

// Disable "Save Pin" if already saved
export const disablePin = async (id: string) => {
  const pinRef = doc(db, `users/${user?.uid!}/saves`, id)
  const pinSnapshot = await getDoc(pinRef)
  if (pinSnapshot.exists()) {
    return true
  }
  return false
}

// Delete pin if user's
export const deletePin = async (pin: PinDocType) => {
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
export const unsavePin = async (id: string): Promise<void> => {
  const pinRef = doc(db, `users/${user?.uid!}/saves`, id)
  await deleteDoc(pinRef)

  dispatch({
    type: 'PIN_SAVED',
    payload: false
  })
}