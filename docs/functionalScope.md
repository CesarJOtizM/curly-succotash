## 2. Alcance funcional

### Lo que **sí** va a hacer

1. Mostrar una **pantalla única** con:
    - Panel izquierdo: controles + lista de vehículos.
    - Panel central: mapa / grid.
    - Panel derecho: event log.
2. Simular:
    - Movimiento simple de los vehículos en el grid.
    - Generación de eventos V2X cada cierto intervalo (ej. 1s).
3. Interacciones básicas:
    - Play/Pause simulación.
    - Reset simulación (vuelve al estado inicial).
    - Seleccionar vehículo desde la lista para:
        - Resaltarlo en el mapa.
        - Ver más detalle (en la propia lista o un recuadro).
4. Visualizar:
    - Estado de cada vehículo:
        - Tipo (car/bus/emergency).
        - Posición (x, y).
        - Velocidad.
        - Conectado/no conectado.
    - Últimos N eventos V2X (ej. 50).

### Lo que **no** va a hacer (explícito)

- No hay autenticación.
- No hay backend, ni sockets, ni API real.
- No hay mapa real (Google Maps/Mapbox). Solo una abstracción tipo grid.
- No hay persistencia: al refrescar, todo vuelve al estado inicial.
- No hay configuración avanzada de escenarios (solo un escenario predefinido).

Esto ayuda a que el cliente vea que **estás enfocado** y no vendes humo.

---

## 3. Modelo mental de la simulación

Piensa en tres conceptos:

1. **Mundo**
    - Un grid (por ejemplo 10 x 10 celdas).
    - Dentro del grid colocamos:
        - Vehículos (objetos que se mueven).
        - Nodos de infraestructura (objetos fijos).
2. **Estado**
    - Conjunto de:
        - Lista de vehículos (con su estado actual).
        - Lista de nodos.
        - Lista de eventos recientes.
3. **Tick de simulación**
    - Cada X milisegundos (ej. 1000 ms):
        - Actualizamos la posición de los vehículos según una regla simple.
        - Generamos un evento V2X.
        - Actualizamos el UI.

---

## 4. Layout general de la UI

Pantalla dividida en 3 columnas:

### 4.1. Panel izquierdo – Controles + Lista de vehículos

**Secciones:**

1. **Header**
    - Título: “Trivex V2X Mini Simulation”.
    - Subtítulo corto: “Front-end only prototype”.
2. **Controles**
    - Botón **Play / Pause**:
        - Si está corriendo, muestra “Pause”.
        - Si está pausado, muestra “Play”.
        - Estado visible (ej. badge “Running” / “Paused”).
    - Botón **Reset**:
        - Vuelve todo al estado inicial.
        - Deselecciona vehículo.
    
    *(Opcional si te da tiempo)*:
    
    - Selector de velocidad: `0.5x`, `1x`, `2x`.
3. **Lista de vehículos**
    - Lista o tabla con filas para cada vehículo.
    - Cada fila muestra:
        - ID (p.ej. `CAR_1`).
        - Tipo (car/bus/emergency).
        - Velocidad aproximada.
        - Estado de conexión (Connected / Lost).
    - Cada fila es **clicable**:
        - Al hacer click, se marca como seleccionado.
        - El vehículo se resalta en el mapa.
    - Estado visual:
        - Vehículo seleccionado con fondo distinto.
        - Icono o color diferente según tipo.

*(Si quieres, puedes agregar abajo un pequeño recuadro “Vehicle details” para el seleccionado con más info, pero no es obligatorio.)*

---

### 4.2. Panel central – Mapa / Grid de simulación

Es el foco visual principal.

**Qué debe mostrar:**

- Un **grid** (10x10, o el tamaño que quieras, pero fijo).
- Cada celda puede ser solo un cuadrado visual (no hace falta contenido).
- Vehículos:
    - Dibujados encima de la celda donde están.
    - Diferentes colores/formas por tipo:
        - Car: color azul.
        - Bus: color amarillo.
        - Emergency: color rojo.
    - Si un vehículo está seleccionado:
        - Borde, halo, o tamaño mayor para destacarlo.
- Nodos de infraestructura:
    - Posiciones fijas en el grid.
    - Iconos distintos:
        - RSU: por ejemplo un cuadrado verde.
        - Traffic light: icono o círculo naranja.

**Comportamiento:**

- En cada tick:
    - Los vehículos cambian de posición pero:
        - Nunca salen del grid.
        - Si llegan al borde, reaparecen por el otro lado (comportamiento tipo “wrap-around”).
- No hace falta animación smooth, puede ser “saltos” discretos de celda en celda.

*(Si te sobra tiempo, puedes hacer un pequeño cambio de opacidad/scale para simular movimiento).*

---

### 4.3. Panel derecho – V2X Event Log

**Contenido:**

- Una lista vertical de eventos, ordenados del más reciente al más antiguo.
- Cada evento muestra:
    - Hora (convertida a algo legible, p.ej. “12:34:56”).
    - `from` → `to` (p.ej. `CAR_1 → RSU_1`).
    - Tipo de mensaje (ej. `SPEED_ALERT`, `COLLISION_WARNING`).
    - Payload corto (texto breve, ej. “Reported speed: 60 km/h”).

**Comportamiento:**

- Cada tick, se agrega un evento al principio de la lista.
- La lista tiene un máximo (ej. 50 eventos).
    - Cuando se supera, se descarta el más antiguo.
- El contenedor debe ser scrollable.
- No se debe hacer autoscroll hacia arriba si el usuario está viendo eventos viejos (si te quieres complicar), pero para el MVP puedes simplemente dejar que siempre muestre los últimos.

---

## 5. Detalle del comportamiento de la simulación

### 5.1. Estado inicial

Al cargar la página o al hacer reset:

- Se crean, por ejemplo:
    - 3–5 vehículos con:
        - Posiciones iniciales distintas.
        - Tipos variados.
        - Velocidades predefinidas.
        - Estado `connected: true`.
    - 2 nodos:
        - 1 RSU.
        - 1 traffic light.
- La lista de eventos está vacía.
- La simulación está **corriendo** por defecto (o pausada, como prefieras, pero defínelo).

### 5.2. Movimiento de vehículos

Regla simple, por ejemplo:

- Todos avanzan una celda hacia la derecha en cada tick.
- Si pasan la última columna:
    - Vuelven a la columna 0 de la misma fila.

Opciones de mejora (solo si hay tiempo):

- Algunos vehículos se mueven en horizontal, otros en vertical.
- Velocidad: los de mayor velocidad podrían moverse 2 celdas por tick cada cierto tiempo.

### 5.3. Estados de conexión

Para que el UI no sea plano:

- Puedes introducir 1 regla simple:
    - Cada cierto número de ticks, un vehículo puede perder conexión (ej. 10% de probabilidad).
    - Otro tick puede restablecer la conexión.
- Impacto visual:
    - Vehículos desconectados se muestran más apagados (opacidad menor) o con un icono de “warning”.

*(Esto es opcional, pero queda muy bien para la demo.)*

### 5.4. Generación de eventos V2X

En cada tick:

1. Se elige un vehículo de forma aleatoria.
2. Se elige un nodo de forma aleatoria.
3. Se elige un tipo de mensaje de una lista reducida:
    - `SPEED_ALERT`
    - `COLLISION_WARNING`
    - `SIGNAL_REQUEST`
    - `SIGNAL_RESPONSE`
4. Se construye un payload de texto simple:
    - Ejemplo para `SPEED_ALERT`:
        
        “Vehicle CAR_1 reported speed 60 km/h near RSU_1”
        
5. Se agrega el evento a la lista de eventos.

Regla visual:

- Puedes colorear el tipo de mensaje:
    - `COLLISION_WARNING` → color más “alerta”.
    - `SPEED_ALERT` → menos crítico, etc.

---

## 6. Flujos principales de usuario

### 6.1. Al entrar al dashboard

1. La simulación está corriendo.
2. Se ven vehículos moverse en el mapa.
3. El event log empieza a llenarse.
4. El usuario puede ver la lista de vehículos y su estado en tiempo real.

### 6.2. Pausar la simulación

1. El usuario hace click en “Pause”.
2. El estado de `running` pasa a `false`.
3. Deja de actualizar:
    - Posiciones de vehículos.
    - Event log.
4. El UI sigue interactivo:
    - Puede seleccionar vehículos.
    - Puede leer eventos.

### 6.3. Reanudar simulación

1. El usuario hace click en “Play”.
2. El estado de `running` pasa a `true`.
3. El loop de ticks se reanuda y vuelve a haber movimiento y eventos.

### 6.4. Reset

1. El usuario hace click en “Reset”.
2. El estado vuelve al inicial:
    - Vehículos a posiciones de arranque.
    - Event log vacío.
    - Vehículo seleccionado = ninguno.
3. La simulación puede quedar corriendo o pausada según como lo definas (pero sé consistente).

### 6.5. Selección de vehículo

1. El usuario hace click en una fila de la lista de vehículos.
2. El vehículo se marca como seleccionado:
    - La fila cambia de estilo.
    - El mismo vehículo en el mapa se resalta visualmente.
3. Opcional:
    - En el panel izquierdo o en algún lugar se muestran detalles adicionales:
        - Última vez que generó un evento.
        - Número de eventos generados (si lo quisieras trackear).

---

## 7. Criterios de “DONE” para este MVP

Lo consideraríamos terminado si:

- Hay una única página con los 3 paneles (controles+lista, mapa, log).
- Al menos 3 vehículos se mueven en el mapa de forma visible.
- Hay al menos 1 RSU y 1 traffic light mostrados.
- El usuario puede pausar/reanudar/resetear la simulación.
- El usuario puede seleccionar un vehículo y verlo destacado en el mapa.
- El event log muestra eventos nuevos en cada tick, con información básica.
- El diseño es mínimamente limpio, legible y consistente (no tiene que ser un dribbble shot, pero sí parecer profesional).

---

Si quieres, siguiente paso podemos:

- Convertir todo esto en un **README.md más pulido** (versión final).
- O hacer un **plan de 4 horas minuto a minuto** para que no te disperses al implementarlo.