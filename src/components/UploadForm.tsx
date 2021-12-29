import React, { useReducer, useState, useRef } from 'react'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import { addDoc, doc, getDoc, collection, Timestamp } from '@firebase/firestore';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { XCircleIcon, XIcon } from '@heroicons/react/solid'
import { Doc } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getImageColor, mq, toMegaBytes } from '../utils';
import { storage, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { UploadButton } from './Button';
import { StyledTextInput } from '../styles/index';

interface Props {
  onClose: () => void;
}

type State = {
  progress: number;
  status: boolean;
}
type Action = {
  type: 'INIT_UPLOAD';
  payload: number;
} | {
  type: 'COMPLETE_UPLOAD';
}

// Reducer fuc
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INIT_UPLOAD':
      return {
        ...state,
        progress: action.payload,
        status: true
      }
    case 'COMPLETE_UPLOAD':
      return {
        ...state,
        progress: 0,
        status: false
      }
    default:
      return state
  }
}

const initialState = {
  progress: 0,
  status: false
}

export const UploadForm = ({ onClose }: Props) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageColor, setImageColor] = useState<string | undefined>()
  const [state, dispatch] = useReducer(reducer, initialState)
  const imagePreviewRef = useRef(null)


  // File Change Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    // Get Selected image file
    const file = e.target.files[0]
    console.log({ file })
    setSelectedFile(file)
    
    // Create Image URL
    const selectedFileURL = URL.createObjectURL(file)
    console.log(selectedFileURL)
    
    // Set Image URL
    setImagePreview(selectedFileURL)
  }

  const onImageLoad = () => {
    const hexValue = getImageColor(imagePreviewRef?.current!)
    console.log({ hexValue })
    setImageColor(hexValue)
  }

  const handleClearImage = () => {
    setSelectedFile(null)
    setImageColor(undefined)
    setImagePreview(null)
  }

  const handleUpload = async () => {
    const docRef = doc(db, 'images', `name=${selectedFile?.name!}`)

    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      alert('Image already exists. Try another image.')
      onClose()
      return;
    }

    const pinId = uuid()
    const storageRef = ref(storage, `images/${user?.username}/${pinId}`)

    // const snapshot = await uploadBytes(storageRef, selectedFile as File)
    const uploadTask = uploadBytesResumable(storageRef, selectedFile as File)
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log({ progress })
      dispatch({
        type: 'INIT_UPLOAD',
        payload: progress
      })
    }, (err) => {
      // Handle error

    }, async () => {
      // Handle success
      
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
      
      // Push to Firestore
      const docData: Doc = {
        name: pinId,
        image: downloadURL,
        color: imageColor!,
        createdAt: Timestamp.fromDate(new Date()),
        user: {
          uid: user?.uid!,
          photoURL: user?.photoURL!,
          displayName: user?.displayName!,
          username: user?.email?.split('@')[0]!
        }
      }
      
      await addDoc(collection(db, 'images'), docData)
      
      // close upload form
      onClose()
      dispatch({
        type: 'COMPLETE_UPLOAD'
      })
      navigate('/')
      
    })
  }
  return (
    <StyledContainer color={imageColor} >
      <StyledProgress progress={state.progress} />
      <Header>
        <StyledButton onClick={onClose}><XIcon width={24} height={24} color='#fff' /></StyledButton>
      </Header>

      <StyledMain>
        {(imagePreview && selectedFile) ? (
          <div>
            <StyledImage>
              <button onClick={handleClearImage}>
                <XCircleIcon width={42} height={42} color="#fff" />
              </button>
              <img
                src={imagePreview}
                alt="Selected Image for Upload"
                onLoad={onImageLoad}
                
                ref={imagePreviewRef} />
            </StyledImage>
            <StyledImageInfo>
              {/* <p><span>Name:</span> { selectedFile.name }</p>
              <p><span>Image Size:</span> { toMegaBytes(selectedFile?.size) }</p>
            <ImageColor color={imageColor!} /> */}
            </StyledImageInfo>
            <StyledTextInput type="text" placeholder="The quick brown fox..." disabled={state.status}  />
            <UploadButton onClick={handleUpload} disabled={state.status}>Upload</UploadButton>
          </div>
        ) : (
          <StyledUploadButton>
            <input type="file"
              onChange={ (e) => handleFileChange(e) }
            />
            Select image to upload
          </StyledUploadButton>
        )}
      </StyledMain>
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${({ color }: { color: string | undefined }) => `${color ? color : 'rgba(1, 1, 1, .5)' }` };;
  z-index: 0;
  padding: 1rem;
  transition: all .5s ease;
  backdrop-filter: saturate(300%) blur(25px);
  opacity: 1;
`

const StyledButton = styled.button`
  background-color: transparent;
`

const StyledImageInfo = styled.div`
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

const StyledProgress = styled.div`
  height: 100%;
  position: absolute;
  width: ${({ progress }: { progress: number }) => `${progress}%` };
  transition: all .3s ease;
  background-color: rgba(0, 0, 0, .3);
  top: 0;
  left: 0;
  z-index: -1;
`


const StyledMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 2rem 0;
  height: calc(100vh - 5rem);

`

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
`

const StyledImage = styled.div`
  position: relative;
  border-radius: .5rem;
  width: 50%;
  margin: .5rem auto;

  @media ${mq.mobileLg} {
    width: 300px;
  }

  @media ${mq.tablet} {
    width: 400px;
  }
  button {
    position: absolute;
    top: -1rem;
    right: -1rem;
  }
  img {
    border-radius: .5rem;
    width: 100%;
  }
  
`

const StyledUploadButton = styled.label`
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
