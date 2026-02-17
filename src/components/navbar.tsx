import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Github, Home, HelpCircle, BookOpen, Download } from 'lucide-react'

export interface NavbarProps {
  title: string
  onStartTour?: () => void
}

export default function Navbar({ title, onStartTour }: NavbarProps) {
  return (
    <nav className="bg-background shadow-sm py-1 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">{title}</Link>
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
        <Button variant="ghost" size="lg" asChild>
          <a href="/AlgorithmVisualizer/docs/manual/index.html" target="_blank" rel="noopener noreferrer">
            <BookOpen className="h-4 w-4" />
            Documentación
          </a>
        </Button>
        <Button variant="ghost" size="lg" asChild>
          <a href="/AlgorithmVisualizer/docs/manual/DSViz--Listas-enlazadas.pdf" download>
            <Download className="h-4 w-4" />
            PDF
          </a>
        </Button>
        {onStartTour && (
          <Button variant="ghost" size="lg" onClick={onStartTour}>
            <HelpCircle className="h-4 w-4" />
            Tour
          </Button>
        )}
        <Button size="icon" variant="ghost">
          <Link href="https://github.com/gustavogutierrezutp/AlgorithmVisualizer">
            <Github className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </nav>
  )
}
