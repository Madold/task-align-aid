# Sistema de Balanceo de Línea - Task Align Aid

Sistema web interactivo para el balanceo de líneas de producción utilizando metodología de 6 pasos con algoritmo heurístico.

## 📋 Descripción del Proyecto

Aplicación completa que implementa la metodología de balanceo de línea de producción, permitiendo:
- Configuración de parámetros de producción
- Definición de tareas con precedencias
- **Selección configurable de reglas de asignación secundarias**
- Visualización de diagrama de precedencia
- Cálculo automático de estaciones y eficiencia
- Análisis detallado del proceso de asignación

## ✨ Características Principales

### 1. Diagrama de Precedencia Interactivo
- Visualización gráfica de la red del proyecto
- Nodos coloreados por estación asignada
- Muestra tiempos y relaciones de dependencia

### 2. Configuración de Reglas de Asignación
- **Reglas Obligatorias** (siempre activas):
  - Precedencia de tareas
  - Respeto del tiempo de ciclo
- **Reglas Secundarias** (configurables por el usuario):
  - ☑️ Mayor número de tareas siguientes
  - ☑️ Mayor tiempo de ejecución
  - Selección aleatoria en caso de empate

### 3. Análisis Completo
- Tiempo de ciclo calculado automáticamente
- Número teórico y real de estaciones
- Eficiencia con clasificación (Insatisfactoria/Satisfactoria/Sobresaliente)
- Justificación detallada de cada asignación

## 🎯 Cumplimiento de Requisitos

✅ Requisito 1: Diagrama de precedencia con interfaz gráfica  
✅ Requisito 2: Cálculo de tiempo de ciclo (C)  
✅ Requisito 3: Número mínimo teórico de estaciones (W)  
✅ Requisito 4: **Selección configurable de reglas secundarias**  
✅ Requisito 5: Asignación de tareas a estaciones  
✅ Requisito 6: Cálculo y clasificación de eficiencia  

## Project info

**URL**: https://lovable.dev/projects/93c5d4c9-a3de-49c9-8ffb-2dac63272d66

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/93c5d4c9-a3de-49c9-8ffb-2dac63272d66) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/93c5d4c9-a3de-49c9-8ffb-2dac63272d66) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
