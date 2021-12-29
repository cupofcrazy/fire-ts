import React, { useState } from 'react'
import { NavLink } from './NavLink'
import styled from 'styled-components'
import { UploadIcon } from '@heroicons/react/outline'
import { UploadForm } from './UploadForm'

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navItems = [
    { name: 'index', href: '/' },
    // { name: 'information', href: '/information' },
    { name: 'protected', href: '/protected' },
    { name: 'auth', href: '/auth' },
  ]
  const openUploadForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setIsOpen(true)
  }
  return (
    <StyledNav>
      <ul>
        { navItems.map(item => (
          <NavLink key={item.name} to={item.href}>{ item.name }</NavLink> 
        ))}
        <button onClick={(e) => openUploadForm(e) }><UploadIcon width={16} height={16} color="#111" /></button>
      </ul>
      { isOpen && <UploadForm onClose={() => setIsOpen(false)} /> }
    </StyledNav>
  )
}

export default Nav


const StyledNav = styled.nav`
  
  ul {
    display: flex;
    gap: 2rem;

  }
`
