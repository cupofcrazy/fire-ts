import React, { useReducer, useState, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import { addDoc, doc, getDoc, collection, Timestamp } from '@firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { XIcon } from '@heroicons/react/solid'
import type { PinDocType } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { getImageColor } from '../utils';
import { storage, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { UploadButton } from './Button';
import { StyledTextInput } from '../styles';
import { Styled } from '../styles/upload-form.styles';

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

const imageMetadataDefaults: PinDocType['metadata'] = {
  width: 0,
  height: 0,
  aspectRatio: 0,
  color: '#EEEEEE'
}

export const UploadForm = ({ onClose }: Props) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageMetadata, setImageMetadata] = useState<PinDocType['metadata']>(imageMetadataDefaults)
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

    // const image = new Image()
    
    // Create Image URL
    const selectedFileURL = URL.createObjectURL(file)
    console.log(selectedFileURL)
    
    // Set Image URL
    setImagePreview(selectedFileURL)
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(e)
    const imageElement = e?.currentTarget;
    const imageAspectRatio = imageElement.width / imageElement.height
    console.log({ imageAspectRatio })

    const hexValue = getImageColor(imagePreviewRef?.current!)
    console.log({ hexValue })

    setImageMetadata({
      width: imageElement.width,
      height: imageElement.height,
      color: hexValue,
      aspectRatio: imageAspectRatio
    })
  }

  const handleClearImage = () => {
    setSelectedFile(null)
    // setImageColor(undefined)
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
      console.log({ err })

    }, async () => {
      // Handle success
      console.log('File Uploaded')
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
      
      // Push to Firestore
      const docData: PinDocType = {
        name: pinId,
        image: downloadURL,
        createdAt: Timestamp.fromDate(new Date()),
        metadata: imageMetadata,
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
    <Styled.Container color={imageMetadata.color}>
      <Styled.Progress progress={state.progress} />
      <Styled.Header>
        <Styled.Button onClick={onClose}><XIcon width={24} height={24} color='#fff' /></Styled.Button>
      </Styled.Header>

      <Styled.Main>
        {(imagePreview && selectedFile) ? (
          <Styled.Form>
            <Styled.FormLeft>
              <Styled.ImagePreview
                src={imagePreview}
                alt="Selected Image for Upload"
                onLoad={(e) => onImageLoad(e)}
                ref={imagePreviewRef}
              />
            </Styled.FormLeft>
            <Styled.FormRight>
              <StyledTextInput type="text" placeholder="The quick brown fox..." disabled={state.status}  />
              <UploadButton onClick={handleUpload} disabled={state.status}>{ state.status ? `${state.progress.toFixed(0)}%` : 'Upload' }</UploadButton>
            </Styled.FormRight>
            {/* <StyledImage> */}
              {/* <button onClick={handleClearImage}>
                <XCircleIcon width={42} height={42} color="#fff" />
              </button> */}
              
            {/* </StyledImage> */}
            {/* <StyledImageInfo> */}
              {/* <p><span>Name:</span> { selectedFile.name }</p>
              <p><span>Image Size:</span> { toMegaBytes(selectedFile?.size) }</p>
            <ImageColor color={imageColor!} /> */}
            {/* </StyledImageInfo> */}
            
          </Styled.Form>
        ) : (
          <Styled.UploadContainer>
            <Styled.UploadButton>
              <input type="file"
                onChange={ (e) => handleFileChange(e) }
              />
              Select image to upload
            </Styled.UploadButton>
          </Styled.UploadContainer>
        )}
      </Styled.Main>
    </Styled.Container>
  )
}


