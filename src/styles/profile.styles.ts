import styled from "styled-components";


const Page = styled.div`
  /* background: red; */
  width: 100%;
  height: 90vh;
`

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 6rem 0;

  h3 {
    margin: 1rem 0;
  }
`

const ProfileImage = styled.img`
  margin: 1rem 0;
  border-radius: 50%;

`

export default {
  Page,
  Header,
  ProfileImage
}