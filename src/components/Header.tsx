import type { User } from 'firebase/auth'
import { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import Nav from './Nav'
import cn from 'classnames';


export const Header = () => {
  const { user, signOutWithGoogle } = useAuth()
  const [toggled, setToggled] = useState(false)
  const toggleSettings = () => {
    setToggled(!toggled)
  }
  return (
    <StyledHeader>
      <Nav />
      {user && (
        <div>
          <button aria-label='Profile Settings' onClick={toggleSettings}>
            <ProfileImage user={user} />
          </button>
          {<StyledList className={cn({ active: toggled })}>
            <StyledListItem>View Profile</StyledListItem>
            <StyledListItem onClick={signOutWithGoogle}>Logout</StyledListItem>
          </StyledList>
          }
        </div>
      )}
    </StyledHeader>
  )
}


const ProfileImage = ({ user }: { user: User }) => {
  console.log(user)
  return (
    <StyledImage
      src={user?.photoURL!}
      alt={`${user?.displayName}'s Profile Picture`}
    />
  )
}


const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 1);
  /* backdrop-filter: saturate(300%) blur(25px); */
`

const StyledImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`


const StyledList = styled.ul`
  width: 300px;
  background-color: rgba(255, 255, 255, .65);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, .05);
  position: fixed;
  top: 4.5rem;
  right: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  backdrop-filter: saturate(300%) blur(25px);
  border: 1px solid rgba(0, 0, 0, .1);
  opacity: 0;
  visibility: hidden;
  transform: scale(.95);
  transition: all .3s ease;

  &.active {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
    transition: all .3s ease;
  }
`
const StyledListItem = styled.button`
  padding: 1.25rem 1.25rem;
  background-color: transparent;
  width: 100%;
  text-align: left;
  border-radius: .75rem;
  transition: all .3s ease;
  /* color: #fff; */
  
  &:hover {
    background-color: rgba(0, 0, 0, .075);
    transition: all .3s ease;
    
  }
`
