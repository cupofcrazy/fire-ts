import React, { useState } from 'react'
import { NavLink } from './NavLink'
import styled from 'styled-components'
import { UploadIcon } from '@heroicons/react/outline'
import { BiHome, BiLogIn, BiUpload } from 'react-icons/bi'
import { UploadForm } from '../UploadForm'
import { useAuth } from '../../contexts/AuthContext';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const navItems = [
    { name: 'Home', href: '/', icon: <BiHome size={20} /> },
    // { name: 'information', href: '/information' },
    { name: 'Auth', href: '/auth', icon: <BiLogIn size={20} /> },
  ]
  const openUploadForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setIsOpen(true)
  }
  return (
    <StyledNav>
      <ul>
        {navItems.map(item => (
          <NavLink key={item.name} to={item.href} aria-label={item.name}>{item.icon}</NavLink>
        ))}
        {user &&
          <button
            onClick={(e) => openUploadForm(e)}>
            <BiUpload
              size={20} />
          </button>
        }
      </ul>
      {isOpen && <UploadForm onClose={() => setIsOpen(false)} />}
    </StyledNav>
  )
}

export default Nav


const StyledNav = styled.nav`
  z-index: 1000;
  ul {
    display: flex;
    gap: 2rem;

  }
`
