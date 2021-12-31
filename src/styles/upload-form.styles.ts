import styled from 'styled-components';
import { mq } from '../utils';


const Form = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;

  @media ${mq.tablet} {
    flex-direction: row;
  }
  
`

const FormLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10%;
  flex: 1;

`

const UploadContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const FormRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba(0, 0, 0, .25);
  padding: 0 15%;
  flex: 1;

`

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${({ color }: { color: string | undefined }) => `${color ? color : 'rgba(1, 1, 1, .5)' }` };
  transition: all .5s ease;
  backdrop-filter: saturate(300%) blur(25px);
  opacity: 1;
  z-index: 9999;
`

const Button = styled.button`
  background-color: transparent;
`

const ImageInfo = styled.div`
  text-align: center;
  mix-blend-mode: difference;
  p {
    margin-bottom: .5rem;
    color: #fff;
    font-weight: 500;
    font-size: 1.25rem;

    span {
      opacity: .5;
    }
  }
`

const Progress = styled.div`
  height: 100%;
  position: absolute;
  width: ${({ progress }: { progress: number }) => `${progress}%` };
  transition: all .3s ease;
  background-color: rgba(0, 0, 0, .3);
  top: 0;
  left: 0;
  z-index: -1;
`


const Main = styled.div`
  /* display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column; */
  /* height: calc(100vh - 5rem); */

`

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  padding: 1rem;
`

const ImagePreview = styled.img`
  border-radius: .25rem;
  
`

const UploadButton = styled.label`
  cursor: pointer;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, .25);
  color: #111;
  padding: 1.25rem 1.75rem;
  border-radius: 10rem;

  input[type="file"] {
    display: none;
  }
`

export const Styled = {
  Form,
  FormLeft,
  FormRight,
  UploadContainer,
  Container,
  Button,
  ImageInfo,
  Progress,
  Main,
  Header,
  ImagePreview,
  UploadButton
}