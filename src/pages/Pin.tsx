import { deleteDoc, doc, DocumentData, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { db, storage } from '../lib/firebase';
import { PinDocType } from '../types'
import { ProfileImage } from '../components/ProfileImage';
import { useAuth } from '../contexts/AuthContext';
import { deleteObject, ref } from 'firebase/storage';

interface Props {}

const getPinById = async (id: string): Promise<DocumentData | null> => {
  const pinRef = doc(db, 'images', id)
  const pinSnaphot = await getDoc(pinRef)

  if (pinSnaphot.exists()) {
    return {
      ...pinSnaphot.data(),
      id: pinSnaphot.id
    }
  }
  return null
}

const Pin = () => {
  const { user } = useAuth()
  const [pin, setPin] = useState<any>(null)
  const params = useParams()
  const navigate = useNavigate()

  const deletePin = async (id: string) => {
    const pinRef = ref(storage, `images/${user?.username}/${pin.name}`)
    try {
      await deleteObject(pinRef)
      await deleteDoc(doc(db, 'images', id))
      console.log('Doc deleted successfully')
      navigate('/')
    } catch (e) {
      console.error({ e })
    }

  }

  useEffect(() => {
    getPinById(params.id!).then(data => {
      setPin(data)
    })
    console.log(pin)
  }, [])
  return (
    <div >
      <StyledHeader>
        <div className="pin-info">
          <h3>{ pin?.id }</h3>
          <span></span>
          <Link to={'/'}>
            <StyledImage src={pin?.user.photoURL} alt="Image" />
          </Link>
        </div>
        <div className="pin-options">
          <button>Save</button>
          <button>Show Details</button>
          { user?.uid === pin?.user?.uid && <button onClick={ () => deletePin(pin?.id)}>Delete</button> }
        </div>
      </StyledHeader>
      <StyledImage src={pin?.image} width={300} alt={pin?.id} />
    </div>
  )
}

export default Pin


const StyledImage = styled.img`
  margin: 1rem auto;
`

const StyledHeader = styled.header`
  width: 100%;
  padding: 2rem 0 1rem 0;
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
    gap: 1rem;
  }

  button {
    background-color: transparent;
    color: #494949;
    padding: .75rem 1.25rem;
    border-radius: .5rem;
    
    &:focus, &:hover {
      background-color: rgba(0, 0, 0, .05);

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
