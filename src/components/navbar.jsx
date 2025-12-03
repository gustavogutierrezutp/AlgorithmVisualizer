import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Github, Home, Footprints } from 'lucide-react'
import { useTourStore } from '@/store/tourStore'

export default function Navbar(props) {
  const startTour = useTourStore((state) => state.startTour);

  return (
    <nav className="bg-background shadow-sm py-1 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">{props.title}</Link>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="lg" asChild>
          <Link href="/">
            <Home className="h-4 w-4" />
            Inicio
          </Link>
        </Button>
        <Button variant="ghost" size="lg" asChild>
          <Link href="/about">Acerca de</Link>
        </Button>
        
        <Button variant="ghost" size="lg" onClick={startTour}>
           <Footprints className="h-4 w-4" />
          Show tutorial
        </Button>

        <Button size="icon" variant="ghost">
          <Link href="https://github.com/gustavogutierrezutp/AlgorithmVisualizer/tree/ds">
            <Github className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </nav>
  )
}
