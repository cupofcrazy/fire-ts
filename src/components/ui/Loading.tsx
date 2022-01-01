import styled from 'styled-components';
import { Dots } from './';


export const Loading = () => {
  return (
    <Container>
      <Dots />
    </Container>
  )
}


const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index:9999;
`