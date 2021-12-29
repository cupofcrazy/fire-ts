import cn from 'classnames'
import React from 'react'
import type { LinkProps } from 'react-router-dom'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import styled from 'styled-components'


interface Props {
  to: LinkProps["to"];
  children: React.ReactNode;
}

// Custom Link
export const NavLink = ({ to, children, ...props }: Props) => {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })

  return (
    <StyledNavItem to={to} className={cn({ active: match })} {...props} >
      {children}
    </StyledNavItem>
  )
}


const StyledNavItem = styled(Link)`
  font-weight: 500;
  opacity: .5;

  &.active {
    opacity: 1;
  }
`