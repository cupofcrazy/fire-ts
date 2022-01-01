import Styled from '../styles/profile.styles'
import { useAuth } from '../contexts/AuthContext';


const Profile = () => {
  const { user } = useAuth()

  return (
    <Styled.Page>
      <Styled.Header>
        <Styled.ProfileImage src={user?.photoURL!} alt="Profile Image" />
        <h1>{ user?.displayName }</h1>
        <h3>@{ user?.username }</h3>
      </Styled.Header>
    </Styled.Page>
  )
}

export default Profile
