import styled from 'styled-components';



// Dots
export const Dots = () => (
  <StyledDots>
    <span></span>
    <span></span>
    <span></span>
  </StyledDots>
)



const StyledDots = styled.div`
  span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #acacac;
    animation: flashing 1.4s infinite linear;
    margin: 0 4px;
    display: inline-block;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }


@keyframes flashing {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
`