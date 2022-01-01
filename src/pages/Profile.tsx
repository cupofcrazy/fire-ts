import { useEffect, useState } from 'react';
import Styled from '../styles/profile.styles'
import { useAuth } from '../contexts/AuthContext';
import { useCollection } from '../hooks/useCollection';
import { PinGrid } from '../components/pins/PinGrid';


const Profile = () => {
  const { user } = useAuth()
  const [savedPins, loading] = useCollection(`users/${user?.uid as string}/saves`)

  useEffect(() => {
    console.log(savedPins)
  }, [])

  return (
    <Styled.Page>
      <Styled.Header>
        <Styled.ProfileImage src={user?.photoURL!} alt="Profile Image" />
        <h1>{ user?.displayName }</h1>
        <h3>@{ user?.username }</h3>
        <p>Pins Saved: { savedPins.length }</p>
      </Styled.Header>
      <PinGrid pins={savedPins} />
    </Styled.Page>
  )
}

export default Profile
