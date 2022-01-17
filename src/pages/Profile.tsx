import { useEffect, useState } from 'react';
import Styled from '../styles/profile.styles'
import { useAuth } from '../contexts/AuthContext';
import { useCollection } from '../hooks/useCollection';
import { PinGrid } from '../components/pins/PinGrid';
import { Loading } from '../components/ui/Loading';
import { query, collection, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';


const Profile = () => {
  const { user } = useAuth()
  const [savedPins, setSavedPins] = useState<any>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <>
      { loading ? <Loading /> :
      (<Styled.Page>
        <Styled.Header>
          <Styled.ProfileImage src={user?.photoURL!} alt="Profile Image" />
          <h1>{ user?.displayName }</h1>
          <h3>@{ user?.username }</h3>
          <p>Pins Saved: { savedPins?.length }</p>
        </Styled.Header>
        {/* <PinGrid pins={savedPins} /> */}
      </Styled.Page>)}
    </>
  )
}

export default Profile
