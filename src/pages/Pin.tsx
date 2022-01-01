import { deleteDoc, doc, DocumentData, getDoc, collection } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Styled from '../styles/pin-page.styles'
import { db, storage } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { deleteObject, ref } from 'firebase/storage';
import { XIcon } from '@heroicons/react/outline';
import { setDoc } from '@firebase/firestore';
import { usePinReducer } from '../reducers/usePinReducer';


const getPinById = async (id: string): Promise<DocumentData | null> => {
  const pinRef = doc(db, 'images', id)
  const pinSnaphot = await getDoc(pinRef)

  if (pinSnaphot.exists()) {
    return {
      ...pinSnaphot.data(),
      id: pinSnaphot.id
    }
  }
  return null
}

const Pin = () => {
  const { user } = useAuth()
  const [pin, setPin] = useState<any>(null)
  const [state, dispatch] = usePinReducer()
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const navigate = useNavigate()

  // Save Pin
  const savePin = async () => {
    dispatch({
      type: 'SAVE_PIN'
    })
    console.log('saving pin...')
    const ref = doc(db, `users/${user?.uid!}/saves`, pin.id)
    await setDoc(ref, {
      id: pin.id
    }, {
      merge: true
    })
    // disable save button if pin is already saved
    try {
      await disablePin(pin.id)
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
  const deletePin = async (id: string) => {
    const pinRef = ref(storage, `images/${user?.username}/${pin.name}`)
    try {
      await deleteObject(pinRef)
      await deleteDoc(doc(db, 'images', id))
      console.log('Doc deleted successfully')
      navigate('/')
    } catch (e) {
      console.error({ e })
    }

  }

  // Intial Page Load and checks
  useEffect(() => {
    getPinById(params.id!).then(data => {
      setPin(data)
      disablePin(params.id!).then((bool) => {
        dispatch({
          type: 'CHECK_IF_PIN_SAVED',
          payload: bool
        })
        setLoading(false)
      })
    })
    console.log(pin)
  }, [state.isSaved, params.id])

  // Render
  return (
    <Styled.Page color={'#fff'}>
      { loading ? <p style={{ fontSize: '20vw' }}>Loading...</p> : 
      <>
        <Styled.Header>
          <div className="pin-info">
            <h3>{ pin?.id }</h3>
            <span></span>
            <Link to={'/'}>
              <Styled.Image src={pin?.user?.photoURL} alt="Image" />
            </Link>
          </div>
          <div className="pin-options">
            <button onClick={savePin} disabled={state.isSaved || state.isSaving}>{ state.isSaved ? 'Saved' : state.isSaving ? 'Saving...' : 'Save' }</button>
            <button>Show Details</button>
            { user?.uid === pin?.user?.uid && <button onClick={ () => deletePin(pin?.id)}>Delete</button> }
            <button aria-label='Close' title="Close" onClick={() => navigate('/')}><XIcon width={24} height={24} /></button>
          </div>
        </Styled.Header>
        <Styled.Image src={pin?.image} style={{ width: '50%' }} alt={pin?.id} />
      </>
      }
    </Styled.Page>
  )
}

export default Pin
