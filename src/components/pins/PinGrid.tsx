import styled from 'styled-components';
import { PinGridItem } from './PinGridItem';
import { PinDocType } from '../../types';
import { mq } from '../../utils';


interface Props {
  pins: PinDocType[]
}

export const PinGrid = ({ pins }: Props) => {
  return (
    <StyledGrid>
      {pins.map(pin => (
        <PinGridItem key={pin.id} pin={pin} />
      ))}
    </StyledGrid>
  )
}

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem 0;
  

  @media ${mq.tablet} {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  @media ${mq.laptop} {
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
  }

  @media ${mq.laptopL} {
    grid-template-columns: repeat(8, 1fr);
    gap: 1rem;
  }
`