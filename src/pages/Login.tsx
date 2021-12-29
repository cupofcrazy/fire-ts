import React from 'react'
import styled from 'styled-components'
import { Button } from '../components/Button'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { user, signInWithGoogle, signOutWithGoogle } = useAuth()
  return (
    <StyledPage>
      { user ? <Button onClick={signOutWithGoogle}>Sign Out</Button> :
        <Button onClick={signInWithGoogle}>Sign In</Button>
      } 
    </StyledPage>
  )
}

export default Login


const StyledPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
`
