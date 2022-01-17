import { PinGrid } from '../components/pins/PinGrid';
import { query, doc, onSnapshot, orderBy, collection, startAfter, startAt, limit, getDocs } from 'firebase/firestore'
import { useCollection } from '../hooks/useCollection';
import { PinDocType } from '../types';
import { formatNumber } from '../utils/index';
import { Timestamp } from '@firebase/firestore';
import { Button } from '../components/Button';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';


const Home = () => {
  const [start, setStart] = useState(6)
  const [pins, setPins] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPins = async () => {
    const lastVisible = pins && pins[pins.length - 1]
    console.log({ lastVisible })
    // Fetch snapshot and order by time uploaded
    const q = query(collection(db, 'images'), orderBy('createdAt', 'asc'), startAfter(lastVisible?.createdAt || 1), limit(8))
    getDocs(q).then(querySnapshot => {
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPins([...pins, ...docs])

    })
    // Realtime data
    console.log(pins)
  }

  useEffect(() => {
    fetchPins()
  }, [])

  return (
    <div>
      <h1>Index ● { pins.length > 0 && formatNumber(pins.length) } Pins</h1>
      <PinGrid pins={pins} />
      { loading && <p>Loading</p> }
      <button onClick={fetchPins}>Fetch More</button>
    </div>
  )
}

export default Home











