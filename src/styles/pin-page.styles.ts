import styled from 'styled-components';


// Styles
const Page = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ color }) => color || '#eee' };
  padding: 1rem;
  overflow-y: scroll;
`

const Image = styled.img`
  margin: 1rem auto;
`

const Header = styled.header`
  width: 100%;
  /* padding: 2rem 0 1rem 0; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, .05);
  
  .pin-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .pin-options {
    display: flex;
    gap: 0rem;
  }

  button {
    background-color: transparent;
    color: #494949;
    padding: .5rem 1rem;
    border-radius: 1rem;
    transition: all 1s ease;
    
    &:focus, &:hover:not(:disabled) {
      background: linear-gradient(#e0f2ff 0%, #ffc3dd 100%);
      transition: all 1s ease;

    }

    &::disabled {
      color: red;
      transition: all .3s ease;
    }
  }

  span {
    display: block;
    width: .5rem;
    height: .5rem;
    border-radius: 10rem;
    background-color: #111;
  }

  img {
    width: 2rem;
    height: 2rem;
    border-radius: 10rem;
  }
`

export default {
  Page,
  Image,
  Header
}
