import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Styled from '../styles/pin-page.styles'
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { XIcon } from '@heroicons/react/outline';
import { Dots } from '../components/ui';
import { usePinReducer } from '../reducers/usePinReducer';
import { Loading } from '../components/ui/Loading';


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
  const [state, dispatch] = usePinReducer()
  const { user, pinActions } = useAuth()
  const [pin, setPin] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const navigate = useNavigate()

  // Destructure pin actions from auth context
  const { savePin, deletePin, unsavePin, disablePin } = pinActions


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
  }, [params.id])

  // Render
  return (
    <Styled.Page color={'#fff'}>
      { loading ? <Loading /> : 
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
            { state.isSaved ? <button onClick={() => unsavePin(pin?.id)} disabled={!state.isSaved}>Unsave</button> : (
              user && <button
                onClick={() => savePin(pin)}
                disabled={state.isSaving}>{ state.isSaved ? 'Saved' : state.isSaving ? 'Saving...' : 'Save' }</button>
            )}
            <button>Show Details</button>
            { user?.uid === pin?.user?.uid && <button onClick={ () => deletePin(pin)}>Delete</button> }
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
