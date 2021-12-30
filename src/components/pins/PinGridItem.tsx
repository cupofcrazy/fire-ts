import { useRef } from "react";
import { Link } from "react-router-dom";
import cn from 'classnames';
import styled from "styled-components"
import { PinDocType } from '../../types/index';
import { useOnScreen } from '../../hooks/useOnScreen';


interface PinProps {
  pin: PinDocType
}

export const PinGridItem = ({ pin }: PinProps) => {
  // const ref: any = useRef<HTMLAnchorElement>()
  // const onScreen = useOnScreen<HTMLAnchorElement>(ref)

  return (
    <StyledPin to={`/pin/${pin.id}`}>
      <div style={{
          position: 'relative',
          paddingTop: `calc(100% / ${pin.metadata.aspectRatio})`,
          backgroundColor: pin.metadata.color,
          zIndex: -1
        }}>
        <StyledGridImage
          key={pin.id}
          style={{
            position: 'absolute',
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            
          }}
          src={pin?.image}
          alt={'Image'} />
      </div>
      <div className="pin-info">
        <p>{ pin.user.username }</p>
        <span style={{ backgroundColor: pin.metadata.color }}></span>
      </div>
    </StyledPin>
  )
}


const StyledGridImage = styled.img`
  border-radius: .15rem;

`

const StyledPin = styled(Link)`
  /* opacity: 0;
  transform: scale(.8) translateY(100px);
  transition: all .5s ease;
  z-index: 1; */

  &.active {
    opacity: 1;
    transform: scale(1) translateY(0px);
    transition: all .5s ease;
  }
  .pin-info {
    margin: .5rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  p {
    color: rgba(0, 0, 0, .5);
    font-weight: 500;
    font-size: .875rem;
  }
  span {
    width: .75rem;
    height: .75rem;
    display: block;
    border-radius: 10rem;
  }
`