import { query, doc, onSnapshot, orderBy, collection, startAfter, startAt, limit, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../lib/firebase'
import { PinDocType } from '../types/index';


export const useCollectionPaginate = (path: string, orderByDirection?: 'asc' | 'desc'): any => {
  const [snapshot, setSnapshot] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPins = async () => {
    const lastVisible = snapshot && snapshot.docs[snapshot.docs.length - 1]
  }

  useEffect(() => {
    setLoading(true)
    // Fetch snapshot and order by time uploaded
    const q = query(collection(db, path), orderBy('createdAt', orderByDirection), startAfter())
    getDocs(q).then(querySnapshot => {
      const docs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setSnapshot(docs)

    })
    // Realtime data
    console.log(snapshot)
    setLoading(false)

  }, [path, orderByDirection, loading])

  return [snapshot, loading]
}