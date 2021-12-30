import { query, doc, onSnapshot, orderBy, collection } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'


export const useCollection = (path: string, orderByDirection?: 'asc' | 'desc'): any => {
  const [snapshot, setSnapshot] = useState<any[]>([])

  useEffect(() => {
    // Fetch snapshot and order by time uploaded
    const q = query(collection(db, path), orderBy('createdAt', orderByDirection))

    // Realtime data
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setSnapshot(docs)
    })

    return () => unsubscribe()

  }, [path, orderByDirection])

  return snapshot
}