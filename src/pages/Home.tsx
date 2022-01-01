import { PinGrid } from '../components/pins/PinGrid';
import { useCollection } from '../hooks/useCollection';
import { PinDocType } from '../types';
import { formatNumber } from '../utils/index';
import { Timestamp } from '@firebase/firestore';
import { Button } from '../components/Button';
import { useState } from 'react';


const Home = () => {
  const [start, setStart] = useState(6)
  const [ pins, loading ] = useCollection('images', 'desc')

  const handleClick = () => {
    setStart(start + 6)

  }

  return (
    <div>
      <h1>Index ● { pins.length > 0 && formatNumber(pins.length) } Pins</h1>
      <PinGrid pins={pins} />
      { loading && <p>Loading</p> }
      <Button onClick={handleClick}>Load More</Button>
    </div>
  )
}

export default Home











