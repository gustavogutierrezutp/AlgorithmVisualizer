"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Code2, Lightbulb, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar title="DSViz" />

      <main className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">Acerca de DSViz</h1>
            <p className="text-xl text-muted-foreground">
              Herramienta interactiva para visualizar estructuras de datos
            </p>
          </div>

          {/* Project Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-6 w-6" />
                ¿Qué es DSViz?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-muted-foreground">
                DSViz es una aplicación web interactiva diseñada para ayudar a estudiantes y profesionales
                a comprender el funcionamiento interno de las estructuras de datos fundamentales mediante
                visualizaciones animadas y claras.
              </p>
              <p className="text-lg text-muted-foreground">
                A través de controles intuitivos y animaciones paso a paso, puedes explorar cómo se comportan
                las estructuras de datos durante operaciones como inserción, eliminación, búsqueda y traversal.
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6" />
                Características
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-lg text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Visualización interactiva de listas enlazadas y sus operaciones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Control de velocidad de animación ajustable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Personalización de colores para nodos y estados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Selección múltiple y manipulación de nodos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Interfaz moderna y responsiva</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-6 w-6" />
                Tecnologías
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-secondary rounded-lg text-center">
                  <p className="font-semibold">Next.js</p>
                  <p className="text-sm text-muted-foreground">Framework React</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg text-center">
                  <p className="font-semibold">React Flow</p>
                  <p className="text-sm text-muted-foreground">Visualización</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg text-center">
                  <p className="font-semibold">Tailwind CSS</p>
                  <p className="text-sm text-muted-foreground">Estilos</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg text-center">
                  <p className="font-semibold">Electron</p>
                  <p className="text-sm text-muted-foreground">Desktop App</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg text-center">
                  <p className="font-semibold">Radix UI</p>
                  <p className="text-sm text-muted-foreground">Componentes</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg text-center">
                  <p className="font-semibold">Lucide Icons</p>
                  <p className="text-sm text-muted-foreground">Iconografía</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GitHub Link */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Código Abierto</h3>
                  <p className="text-muted-foreground">
                    Este proyecto está disponible en GitHub. Contribuciones y sugerencias son bienvenidas.
                  </p>
                </div>
                <a
                  href="https://github.com/gustavogutierrezutp/AlgorithmVisualizer/tree/ds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  Ver en GitHub
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Credits */}
          <div className="text-center space-y-2 py-8">
            <p className="text-muted-foreground">
              Desarrollado con ❤️ para la comunidad educativa
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 DSViz - Visualización de Estructuras de Datos
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
