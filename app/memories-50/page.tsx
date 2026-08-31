import type {Metadata} from 'next'
import Memories50 from './Memories50'

export const metadata: Metadata = {
  title: 'Les 50 ans de Yael — Memories',
  description: 'Le film et les souvenirs des 50 ans de Yael.',
  robots: {index: false, follow: false},
}

export default function Memories50Page() {
  return <Memories50 />
}
