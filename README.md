# AULA WEB 10° · Aplicación educativa completa

Aplicación desde cero para Grado 10° de Diseño y Desarrollo Web.

## ¿Qué incluye?

### Ruta del estudiante
1. HTML5
   - estructura del documento
   - head / body
   - etiquetas semánticas
   - títulos, párrafos, listas y enlaces
   - imágenes, alt, video, audio e iframe
   - formularios
   - tablas
   - actividades de clasificación y detección de errores

2. CSS
   - sintaxis
   - selectores de etiqueta, clase e ID
   - color, tipografía y alineación
   - box model
   - margin y padding
   - fondos y diseño visual
   - diseño responsive
   - organización del CSS externo
   - laboratorios visuales

3. Flexbox
   - ejes
   - flex-direction
   - justify-content
   - align-items
   - align-content
   - gap
   - flex-wrap
   - laboratorio en tiempo real
   - reto práctico

4. Prácticas
   - selección de etiquetas
   - accesibilidad
   - selectores CSS
   - box model
   - Flexbox
   - responsive
   - CSS externo

5. Proyecto final
   - editor HTML
   - editor CSS
   - vista previa en vivo
   - lista de cotejo
   - guardado del avance

6. Resultado
   - avance por módulo
   - puntaje
   - evidencia para entregar

### Panel docente
- número de estudiantes registrados
- estudiantes con avance
- estudiantes que terminaron
- promedio
- avance por módulo
- listado de estudiantes
- detalle individual
- búsqueda
- exportación CSV
- reporte de estudiantes que necesitan acompañamiento

---

# Publicación rápida en Vercel

1. Descarga y descomprime el proyecto.
2. Crea un repositorio en GitHub.
3. Sube:
   - index.html
   - style.css
   - script.js
   - config.js
4. Entra a Vercel.
5. Importa el repositorio.
6. No selecciones ningún framework.
7. Deploy.

---

# Acceso docente



IMPORTANTE: esta clave en JavaScript no es seguridad real. Para una plataforma institucional se debe usar autenticación de servidor/Supabase Auth.

---

# Modo actual: almacenamiento local

La aplicación funciona sin servidor y guarda datos en `localStorage`.

Esto sirve para:
- probar la plataforma
- usarla en un mismo computador
- mostrar el funcionamiento

Pero NO permite que los resultados de estudiantes en computadores diferentes aparezcan automáticamente en tu panel.

---

# Modo recomendado: Supabase

Para que tú puedas ver desde tu computador los resultados de todos los estudiantes, conecta Supabase.

## Tablas recomendadas

### students

```sql
create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  group_name text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### progress

```sql
create table progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  html boolean default false,
  css boolean default false,
  flex boolean default false,
  practice boolean default false,
  project integer default 0,
  quiz numeric default 0,
  updated_at timestamptz default now()
);
```

### project_checklist

```sql
create table project_checklist (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id) on delete cascade,
  semantic boolean default false,
  content boolean default false,
  css boolean default false,
  flex boolean default false,
  visual boolean default false,
  responsive boolean default false,
  updated_at timestamptz default now()
);
```

## Seguridad

Para producción no debes confiar en una clave escrita dentro de JavaScript.

La versión institucional debería utilizar:

- Supabase Auth para docentes.
- Supabase Auth o código de acceso controlado para estudiantes.
- Row Level Security (RLS).
- Políticas que permitan al estudiante modificar solamente su propio progreso.
- El docente puede consultar el grupo.

## Configuración

En `config.js`:

```js
window.AULA_CONFIG = {
  SUPABASE_URL: "https://TU-PROYECTO.supabase.co",
  SUPABASE_ANON_KEY: "TU-ANON-KEY"
};
```

La anon key de Supabase es apropiada para aplicaciones frontend cuando RLS está correctamente configurado. NUNCA pongas una `service_role key` en este proyecto.

---

# Recomendación pedagógica

La aplicación está pensada para trabajar:

APRENDER → EXPERIMENTAR → PRACTICAR → CONSTRUIR → EVIDENCIAR

No es solamente un cuestionario.

El proyecto final permite que el estudiante vea su HTML/CSS funcionando dentro de la plataforma.

---

# Próxima versión institucional

Para convertirla en una plataforma real de uso escolar, el siguiente desarrollo recomendado es:

1. Supabase Auth.
2. Base de datos central.
3. Login real de docente.
4. Creación de grupos.
5. Creación de estudiantes.
6. Panel docente por grupo.
7. Guardado central del progreso.
8. Calificación automática.
9. Registro de intentos.
10. Entrega del proyecto.
11. Retroalimentación docente.
12. Exportación de notas.
13. Publicación de varias guías.


## ✨ Actualización visual y pedagógica

Esta versión incluye:
- Nueva paleta índigo + turquesa + coral + amarillo.
- Animaciones suaves y microinteracciones.
- Personajes/mascotas construidos con CSS, sin depender de imágenes externas.
- Inicio con ruta visual de aprendizaje.
- Módulo Flexbox reforzado con escenarios: navegación, tarjetas, hero y móvil.
- Reto Flexbox con presets y feedback visual.
- Proyecto final con desafío, hitos y rúbrica de 100 puntos.
- Requisito explícito de al menos 3 contenedores Flexbox y uso de `justify-content`, `align-items` y `gap`.
- Diseño responsive para tabletas y celulares.


## 🧑‍💻 Nuevo: laboratorio de código
- Cuatro desafíos de HTML/CSS/Flexbox con editor y vista previa en vivo.
- Comprobación automática de requisitos básicos de cada desafío.
- Reflexión escrita del estudiante.
- Proyecto final con auditoría rápida de Flexbox y detección de `position`.
- Observatorio de patrones visuales de sitios reales con enlaces oficiales a Netflix, Nike, Spotify y Airbnb.
- Las referencias se presentan como patrones de diseño; no se afirma que esas páginas estén construidas exclusivamente con Flexbox.


## 📚 Versión de aprendizaje ampliada

- Tipografía global aumentada para facilitar lectura en clase.
- Taller paso a paso para crear `index.html` y `style.css` en Visual Studio Code.
- Checklist del taller y mini reto escrito.
- Quiz independiente para HTML5, CSS y Flexbox.
- Retroalimentación inmediata por pregunta.
- Proyecto final orientado a escribir código propio, no a copiar una plantilla.
- Analizador básico del código del proyecto: HTML semántico, Flexbox, `justify-content`, `align-items`, `gap`, responsive y cantidad de contenedores flex.
- El proyecto final exige escritura manual de HTML y CSS y permite probar el resultado en vivo.


## V3 · Correcciones aplicadas

- Reparada la sección del proyecto final que tenía HTML/CSS corrupto.
- Agregado `projectFrame` para la vista previa.
- Vista previa aislada con `sandbox="allow-scripts"`.
- Corregida la lista de 6 evidencias.
- El HTML y CSS del proyecto ahora se conservan en `localStorage`.
- Corregido el detalle de estudiantes para usar un ID estable y no índices.
- Migración automática de registros antiguos sin ID.
- Agregado favicon.
- La aplicación continúa en modo local; Supabase queda como siguiente etapa para sincronizar datos entre computadores.


## V4 · Aprendizaje guiado y mejoras de interfaz

- Se eliminó el bloque lateral “Aprende haciendo” que interfería con el menú.
- Se aumentó la legibilidad general de textos, botones, paneles, listas y código.
- El menú lateral ahora puede desplazarse sin quedar oculto.
- HTML incluye contenido ampliado sobre etiquetas de formato de texto, listas y aplicaciones reales.
- Cada tema HTML y CSS tiene un quiz de aprendizaje; se requiere 80% para desbloquear el siguiente tema.
- Buenas prácticas tiene un quiz por cada paso.
- Se agregaron aplicaciones reales a los conceptos para responder “¿para qué me sirve esto?”.
- Selectores CSS incluye una demostración dinámica de etiqueta, clase e ID con especificidad.
- Se agregaron bloqueos de navegación entre módulos para respetar una ruta de aprendizaje.
- Web reales ahora tiene una confirmación antes de desbloquear el laboratorio.
- El analizador del proyecto ya no acepta como “correcta” la plantilla inicial.
- El proyecto debe contener cambios reales del estudiante, contenido propio y al menos tres contenedores Flexbox.


## Versión mejorada — navegación pedagógica

Se corrigió el problema por el cual el módulo HTML podía quedarse mostrando solamente "Fundamentos".
Ahora:

- Todo el contenido de HTML y CSS se puede consultar desde el inicio.
- Los botones de cada paso permiten navegar libremente.
- El botón "Siguiente" no exige aprobar primero el quiz.
- Los quizzes siguen siendo necesarios para considerar una lección dominada.
- La finalización del módulo continúa validando los requisitos de aprendizaje.
- Se eliminó una definición duplicada de `show()` que podía generar comportamientos inconsistentes.

La idea pedagógica es: **explorar → escribir código → probar → equivocarse → corregir → comprobar**.


## V6 — rediseño e interacción

- Colores diferenciados por sección.
- Módulo Flexbox.
- Laboratorio HTML con editor y preview.
- Laboratorio Flexbox con editor y preview.
- Misiones y pistas.
- Ruta visual de aprendizaje.
- Diseño responsive para el laboratorio.


## V7 — Corrección definitiva de bloqueo

Se eliminó la dependencia entre navegación y progreso de quizzes. Los temas de HTML/CSS y las actividades interactivas pueden abrirse libremente, incluso si existe progreso antiguo guardado en localStorage. Se añadieron desbloqueos de seguridad para botones de pasos y opciones de etiquetas HTML.


## V8 — Explorador interactivo de etiquetas HTML

Se incorporó una actividad completa donde el estudiante:
1. Selecciona una etiqueta semántica.
2. Lee qué hace y cuándo usarla.
3. Ve un ejemplo real.
4. Recibe un reto específico.
5. Edita el código.
6. Ejecuta el código.
7. Ve el resultado renderizado.
8. Recibe retroalimentación y pistas.

Etiquetas incluidas: header, nav, main, section, article, aside, footer y form.


## V9 — corrección de errores JavaScript

Corregidos:
- `goodStep is not defined`
- `htmlStep is not defined`
- inicialización de estado antes de ejecutar los renderizadores
- navegación de los steppers sin depender de variables aún no creadas
- manejo defensivo del quiz para que un error no bloquee toda la plataforma
- eliminación de la referencia externa `i.leru.info/c.json` si estaba incluida en el proyecto


## V10 — Modo aprendizaje libre

La plataforma ya no tiene prerrequisitos ni bloqueos de navegación:
- cualquier módulo puede abrirse en cualquier orden;
- cualquier paso puede seleccionarse directamente;
- ningún quiz desbloquea contenido;
- los retos son práctica interactiva opcional;
- "Marcar como estudiado" solo registra progreso, no desbloquea nada;
- la navegación no depende de `state`, puntuaciones ni `localStorage`.

La intención es que el estudiante aprenda explorando, probando código, viendo resultados y corrigiendo sus propios errores.


## V13 — Interactivo: elige una etiqueta HTML

La actividad original del módulo HTML ahora responde a `header`, `main`, `img`, `a` y `form`. Cada botón cambia la explicación, el ejemplo y la vista previa. La actividad es libre y no bloquea ningún contenido.


## V14 — Flexbox Masterclass

Se reorganizó completamente el módulo Flexbox:
- Fundamentos de contenedor, hijos y ejes.
- Propiedades de contenedor: display, flex-direction, justify-content, align-items, flex-wrap, align-content, gap y flex-flow.
- Propiedades de hijos: order, flex-grow, flex-shrink y flex-basis.
- Playground con cambios en vivo.
- Laboratorios de navegación, tarjetas, hero y móvil.
- Retos opcionales sin bloqueo.
- Las tarjetas y pestañas son interactivas y funcionan independientemente del progreso.


## V15 — corrección de Flexbox

Corregido el `TypeError: Cannot set properties of null (setting 'oninput')`.
Los controles de Flexbox ahora se comprueban antes de usarse. También se eliminaron referencias externas innecesarias y se añadió un controlador seguro para pestañas, playground y laboratorios.
