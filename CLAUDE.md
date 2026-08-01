@AGENTS.md

# Reglas de desarrollo

- Siempre usar skill `/cavemen ultra` (o `/caveman ultra`) para comunicación.
- Errores siempre catcheados, con feedback tanto en consola como visual (UX/UI) para el usuario final.
- Antes de resolver un problema de lógica/interfaz, investigar si existe librería de terceros ya instalada o estándar que lo resuelva, y plantearlo antes de programar desde cero.
- Componentes prefabricados: usar shadcn.
- Estilos: usar TailwindCSS. Evitar CSS puro. Nunca tocar `global.css`.
- Base de datos: nunca hacer cambios sin consentimiento explícito del usuario en el mensaje (regla ya reforzada en CLAUDE.md global — no tocar Prisma/DB sin permiso explícito).
- Diseño siempre responsive (mobile + desktop).
- Arquitectura: metodología MVC, componentes modulares.
- Límite de tamaño: ningún componente mayor a 500 líneas — modularizar si se supera.
- Ante problema desconocido, buscar información actualizada en internet (Stack Overflow, Reddit, docs oficiales).
- Nunca usar emojis en código/UI. Íconos siempre con SVG o assets reales, nunca emoji.

# Skills por tarea

| Tarea | Skill | Modelo | Notas |
|---|---|---|---|
| Base de datos | `supabase/agent-skills` | sonnet | usar junto a MCP de Supabase |
| Testeo / interacción navegador | `playwright` | haiku | acoplar `/cavemen ultra` para ahorro extra de tokens |
| Code review / auditoría | `code-simplifier`, `code-reviewer` | haiku | |
| Commits / GitHub | `commit-commands`, `github` (mcp) | — | |
| Componentes y diseño UI | `frontend-design`, `superpowers@claude-plugins-official` (brainstorming), `ui-ux-pro-max@ui-ux-pro-max-skill`, `expo-design` | — | brainstorming primero para pensar el diseño |

# Paleta de marca — Del Mate

> Usá este bloque como prompt/instrucción para cualquier pieza de diseño, publicidad o desarrollo de la marca Del Mate. Restringite estrictamente a estos 4 colores — no introduzcas rosa, verde, violeta ni ningún otro tono.

## Colores

| Color | Hex | Rol |
|---|---|---|
| 🔴 Rojo | `#FF3412` | Primario / protagonista |
| ⚪ Blanco | `#FFFFFF` | Base / fondo dominante |
| ⚫ Negro | `#000000` | Texto / contraste |
| 🟡 Amarillo | `#F4C845` | Acento menor |

## Instrucciones

1. **Blanco de base (60–70% del layout).** Todo fondo grande arranca en blanco. Da aire y hace que el rojo resalte.
2. **Rojo como protagonista (20–30%).** Usalo en CTAs, botones, bordes, badges de oferta/descuento, títulos de impacto y detalles de marca. Es el color que la gente debe recordar.
3. **Negro solo para texto y contraste duro.** Tipografía, íconos, líneas. Nunca lo uses como fondo de secciones grandes — aplasta el diseño.
4. **Amarillo, mínimo y puntual (5–10%).** Reservalo para chispas: sellos de "oferta", contadores, un solo botón secundario. Si aparece en cada elemento, deja de ser acento y rompe la jerarquía.
5. **Nunca combines rojo y amarillo en la misma pieza de texto/botón** — compiten entre sí. Si hay rojo protagonista, el amarillo va en otro elemento, no al lado.
6. **No agregues gradientes multicolor.** Si necesitás profundidad, degradá el mismo color hacia negro o hacia blanco, no hacia otro matiz.

## Prohibido
- Rosa, magenta, violeta, verde o cualquier color fuera de la tabla.
- Fondos negros combinados con texto rojo (bajo contraste, se ve apagado).
- Amarillo como color dominante o de fondo grande.
