import React from 'react'
import styled from 'styled-components'


interface Props {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export const Button: React.FC<Props> = ({ children, onClick, ...props }) => {
  return (
    <StyledButton {...props} onClick={onClick}>
      {children}
    </StyledButton>
  )
}

const StyledButton = styled.button`
  padding: 1rem 1rem;
  border-radius: .5rem;
`

export const UploadButton = styled(StyledButton)`
  background-color: #fff;
  color: #5e5e5e;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  width: 100%;
`