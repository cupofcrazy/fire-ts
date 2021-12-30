import { PinGrid } from '../components/pins/PinGrid';
import { useCollection } from '../hooks/useCollection';
import { PinDocType } from '../types';
import { formatNumber } from '../utils/index';


const Home = () => {
  const pins: PinDocType[] = useCollection('images', 'desc')

  return (
    <div>
      <h1>Index ● { pins.length > 0 && formatNumber(pins.length) } Pins</h1>
      <PinGrid pins={pins} />
    </div>
  )
}

export default Home











