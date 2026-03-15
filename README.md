# Simulation Playground

## Goal
Build a "Simulation Playground" that enables teams to test bot/prompt versions against realistic simulated customers. This playground will replace manual evaluation loops with a repeatable evaluation flow that measures quality automatically and compares versions before shipping.

## Current Architecture Plan
- **Backend**: Provide a new namespace `Router('/api/simulator')` alongside existing backend models and schemas to serve the simulator, accessing existing MongoDB collections.
- **Frontend**: A standalone React/Vite dashboard specifically tailored for developers/QA to run benchmarks, visualize simulations, and review scoring without cluttering the main dashboard.
- **Core Components**: 
  - *Simulation Orchestrator*: Loops the Bot Actor and Human Actor until termination conditions are met.
  - *Retrieval-based Actor*: Utilizes embeddings and latest refined context data (the seeded data) to match existing ground truth call behavior.
  - *Observability*: Langfuse to trace simulations, track tokens, latency, and evaluate prompts.

## Current Progress & Seeded Files
We have initialized this repository as a clean slate for the Simulation Playground. To jump-start the feature while keeping it loosely coupled, we brought over the following critical context files from the main `Conversation Intelligence` project:

**Refined Data Context (backend/data/)**
- `refined_call_cluster_map.json`
- `refined_call_profiles.json`
- `refined_calls_labeled.json`
- `refined_cluster_summary.json`
- `refined_patterns_intermediate.json`
- `call_analytics_with_clusters.csv`

**Shared Backend Logic & Schemas (backend/app/)**
- DB connection handlers and initialization schemas (`database.py`, `db.py`, `schemas.py` etc.)

**Frontend Foundation (frontend/)**
- Package configurations (`package.json`)
- Reusable UI layout elements (`Header.tsx`, `Sidebar.tsx`, `FileUpload.tsx`)
