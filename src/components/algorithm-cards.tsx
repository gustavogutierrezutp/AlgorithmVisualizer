import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

interface DataStructure {
  id: string
  title: string
  description: string
  image: string
}

const dataStructures: DataStructure[] = [
  {
    id: 'sll',
    title: 'Listas enlazadas',
    description: "Visualización de listas enlazadas y sus operaciones básicas: inserción, borrado, búsqueda y recorrido.",
    image: '/AlgorithmVisualizer/images/sll.png?height=200&width=300'
  }
]

export function AlgorithmCards() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-6 text-primary">Data Structures</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dataStructures.map((item) => (
            <Link key={item.id} href={`/${item.id}`} className="block group">
              <Card className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <p className="text-lg text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
