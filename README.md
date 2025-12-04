# Visualizador de Estructuras de Datos (DSViz)

Este proyecto es un visualizador de estructuras de datos que permite a los
usuarios comprender y analizar diversas estructuras de datos a través de
representaciones visuales interactivas.

Para utilizarlo puede visitar el siguiente enlace:

[https://gustavogutierrezutp.github.io/AlgorithmVisualizer/sll](https://gustavogutierrezutp.github.io/AlgorithmVisualizer/sll)

# Aclaraciones

Este proyecto es una derivación de
[Algorithm Visualizer project](https://tamimehsan.github.io/AlgorithmVisualizer/).

La idea principal del proyecto es proporcionar un visualizador de **estructuras
de datos**. Lo anterior **no hace parte del proyecto original** y en este
sentido es una adición propia de los autores de esta derivación. Para tener
acceso a la versión original del proyecto, visite el enlace proporcionado
arriba.

# Trabajos relacionados

- [Algorithm Visualizer](https://tamimehsan.github.io/AlgorithmVisualizer/)
- [National University of Singapore Site](https://visualgo.net/en)
- [University of San Francisco Site](https://www.cs.usfca.edu/~galles/visualization/Algorithms.html)
- ​[algorithm-visualizer](https://github.com/algorithm-visualizer)

# Documentación Técnica

## Arquitectura del Código

El visualizador de listas enlazadas está construido con Next.js y React, utilizando una arquitectura modular basada en componentes funcionales y custom hooks.

### Estructura de Archivos (Single Linked List)

```
src/app/sll/
├── page.jsx                    # Componente principal
├── LinkedListNode.jsx          # Componente de nodo de lista
├── CircleNode.jsx             # Componente de nodo circular (punteros)
├── constants.js               # Constantes de configuración
├── hooks/                     # Custom hooks
│   ├── useListOperations.js   # Hook para operaciones de lista
│   ├── useListVisualization.js # Hook para visualización
│   └── useListInitialization.js # Hook para inicialización
├── operations/                # Funciones de operaciones
│   ├── index.js
│   ├── insertAtHead.js
│   ├── insertAtTail.js
│   ├── insertAtTailO1.js
│   ├── deleteAtHead.js
│   ├── deleteAtTail.js
│   ├── traverseList.js
│   └── reverseList.js
└── utils/                     # Utilidades
    ├── nodeFactory.js         # Creación de nodos
    ├── edgeFactory.js         # Creación de aristas
    ├── nodeFilters.js         # Filtros de nodos
    ├── pointerHelpers.js      # Helpers de punteros
    └── listHelpers.js         # Helpers de lista
```

### Custom Hooks

El proyecto utiliza tres custom hooks principales que encapsulan la lógica compleja:

#### 1. useListOperations
Gestiona todas las operaciones sobre la lista enlazada.

**Ubicación:** `src/app/sll/hooks/useListOperations.js`

**Responsabilidades:**
- Encapsular las 7 operaciones principales (insertar/eliminar cabeza/cola, recorrer, revertir)
- Crear el contexto de operación con estado y callbacks
- Proporcionar una API limpia para ejecutar operaciones

**Operaciones disponibles:**
- `insertAtHead(value)` - Insertar al inicio
- `deleteAtHead()` - Eliminar del inicio
- `insertAtTail(value)` - Insertar al final (O(n))
- `insertAtTailO1(value)` - Insertar al final (O(1) con puntero tail)
- `deleteAtTail()` - Eliminar del final
- `traverseList()` - Recorrer la lista
- `reverseList()` - Revertir la lista

**Ejemplo de uso:**
```javascript
const listOperations = useListOperations({
    nodes, edges, speed, newNodeColor, iterateColor,
    setNodes, setEdges, reactFlowInstance, handlePointerHover
});

// Ejecutar operación
await listOperations.insertAtHead(42);
```

#### 2. useListVisualization
Maneja el renderizado y destacado visual de nodos y aristas.

**Ubicación:** `src/app/sll/hooks/useListVisualization.js`

**Responsabilidades:**
- Filtrar nodos/aristas de punteros cuando `showPointers` es false
- Aplicar destacado a cabeza y cola de la lista
- Resaltar aristas al pasar el mouse sobre punteros
- Optimización con `useMemo` para evitar cálculos innecesarios

**Retorna:**
- `highlightedNodes` - Nodos procesados para renderizado
- `highlightedEdges` - Aristas procesadas para renderizado

**Ejemplo de uso:**
```javascript
const { highlightedNodes, highlightedEdges } = useListVisualization({
    nodes, edges, showPointers, highlightHead, highlightTail,
    hoveredNodeId, iterateColor
});

<ReactFlow nodes={highlightedNodes} edges={highlightedEdges} />
```

#### 3. useListInitialization
Gestiona la inicialización de la lista, punteros y tour guiado.

**Ubicación:** `src/app/sll/hooks/useListInitialization.js`

**Responsabilidades:**
- Inicializar lista con valores aleatorios
- Crear punteros head y tail
- Configurar y ejecutar el tour guiado (Driver.js)
- Crear lista desde secuencia personalizada
- Ejecutar inicialización al montar el componente

**Funciones disponibles:**
- `initializeList(count)` - Crear lista con n elementos aleatorios
- `initializePointers()` - Crear nodos de punteros head/tail
- `startTour()` - Iniciar tour guiado
- `handleCreateFromSequence(sequence)` - Crear lista desde array JSON

**Ejemplo de uso:**
```javascript
const { initializeList, startTour, handleCreateFromSequence } = useListInitialization({
    nodes, nodeColor, setNodes, setEdges, reactFlowInstance,
    handlePointerHover, handleCircleNodeLabelChange, updatePointerPositions
});

initializeList(5); // Crear lista con 5 elementos
```

### Componente Principal (page.jsx)

El componente principal ha sido simplificado de **708 líneas a 469 líneas** (reducción del 33.8%) gracias a la extracción de lógica a custom hooks.

**Responsabilidades principales:**
- Gestión de estado de la UI
- Coordinación entre hooks
- Manejo de eventos de usuario
- Renderizado de ReactFlow

### Módulos de Operaciones

Cada operación está en su propio archivo bajo `src/app/sll/operations/`. Todas reciben un objeto `context` que contiene:

```javascript
{
    state: { nodes, edges, speed, iterateColor, newNodeColor },
    setState: (updates, callback) => { /* actualiza estado */ },
    reactFlowInstance: instance,
    handlePointerHover: (nodeId) => { /* maneja hover */ }
}
```

### Utilidades

- **nodeFactory.js**: Funciones para crear nodos (lista y circulares)
- **edgeFactory.js**: Funciones para crear aristas entre nodos
- **nodeFilters.js**: Funciones para filtrar diferentes tipos de nodos
- **pointerHelpers.js**: Helpers para gestionar punteros head/tail
- **listHelpers.js**: Funciones para crear listas iniciales

### Patrones de Diseño

1. **Custom Hooks**: Extracción de lógica reutilizable
2. **Separation of Concerns**: Cada módulo tiene una responsabilidad única
3. **Context Object Pattern**: Paso de contexto a operaciones
4. **Factory Pattern**: Creación consistente de nodos y aristas
5. **Memoization**: Optimización de rendimiento con `useMemo` y `useCallback`

### Flujo de Datos

```
Usuario → Evento UI → Handler en page.jsx → Custom Hook → Operación →
setState → Actualización de nodos/aristas → useListVisualization →
Nodos/aristas procesados → ReactFlow → Renderizado
```

### Tecnologías Utilizadas

- **React 18+**: Biblioteca UI con hooks
- **Next.js**: Framework React con SSR
- **ReactFlow**: Biblioteca para visualización de grafos
- **Driver.js**: Tour guiado interactivo
- **Tailwind CSS**: Framework CSS utility-first
- **html-to-image**: Exportación a PNG
- **Lucide React**: Iconos

### Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

### Métricas del Código

- **Componente principal**: 469 líneas
- **Custom hooks**: 357 líneas (3 archivos)
- **Operaciones**: ~600 líneas (7 archivos)
- **Utilidades**: ~300 líneas (5 archivos)
- **Total módulo SLL**: ~2,000 líneas


