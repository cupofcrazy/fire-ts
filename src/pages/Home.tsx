import { PinGrid } from '../components/pins/PinGrid';
import { useCollection } from '../hooks/useCollection';
import { PinDocType } from '../types';


const Home = () => {
  const pins: PinDocType[] = useCollection('images', 'desc')

  return (
    <div>
      <h1>Index</h1>
      <PinGrid pins={pins} />
    </div>
  )
}

export default Home











