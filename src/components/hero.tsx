import Image from 'next/image'

export default function Hero() {
    return (
        <section className="container mx-auto px-6 py-16 w-full flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
                <h1 className="text-7xl font-bold">DSViz</h1>
                <p className="text-3xl text-muted-foreground">
                    Visualización interactiva de estructuras de datos. Explora y comprende las estructuras de datos fundamentales a través de animaciones claras y concisas.
                </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
                <Image
                    src="/AlgorithmVisualizer/images/ds.png"
                    alt="Data Structures Visualization"
                    width={600}
                    height={400}
                    className="rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300 border-4 border-primary/20"
                    priority
                />
            </div>
        </section>
    )
}
