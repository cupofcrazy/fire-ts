import { User } from 'firebase/auth'
import styled from 'styled-components';

interface Props {
  photoURL: User['photoURL']
}
export const ProfileImage = ({ photoURL, ...props }: Props) => {
  return (
    <StyledImage src={photoURL!} {...props} />
  )
}

const StyledImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`
