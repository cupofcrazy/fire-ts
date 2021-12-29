import { query, doc, onSnapshot, orderBy } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../lib/firebase';
import { collection, DocumentData } from '@firebase/firestore';
import { Doc } from '../types';
import styled from 'styled-components';
import { mq } from '../utils';
import { Link } from 'react-router-dom';


const Home = () => {
  const [pins, setPins] = useState<Doc[]>([])
  useEffect(() => {
    // Fetch all pins and order by time uploaded
    const q = query(collection(db, 'images'), orderBy('createdAt', 'desc'))

    // Realtime data
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const p: any[] = []
      snapshot.forEach((doc) => {
        console.log(doc.data())
        p.push({
          ...doc.data(),
          id: doc.id
        })
        console.log({ pins })
      })
      setPins(p)
    })

    return () => unsubscribe()

  }, [])

  return (
    <div>
      <h1>Index</h1>
      <StyledGrid>
        {pins.map(pin => (
          <Pin key={pin.id} pin={pin} />
        ))}
      </StyledGrid>
    </div>
  )
}

export default Home


const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem 0;

  @media ${mq.tablet} {
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
  }

  @media ${mq.laptopL} {
    grid-template-columns: repeat(6, 1fr);
    gap: 1rem;
  }
`

const StyledGridImage = styled.img`
  border-radius: .15rem;

`

interface PinProps {
  pin: Doc
}

const Pin = ({ pin }: PinProps) => {
  return (
    <StyledPin to={`/pin/${pin.id}`}>
      <StyledGridImage
        loading='lazy'
        key={pin.id}
        style={{ backgroundColor: pin.color }}
        src={pin?.image}
        alt={'Image'} />
      <div className="pin-info">
        <p>{ pin.user.username }</p>
        <span style={{ backgroundColor: pin.color }}></span>
      </div>
    </StyledPin>
  )
}

const StyledPin = styled(Link)`
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


