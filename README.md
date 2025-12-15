## CSEDU Website – CSE-4113: Internet Programming Lab Project

This repository contains the **CSEDU Website** built as a course project for **CSE-4113: Internet Programming Lab**.

### Overview
- **Course**: CSE-4113 – Internet Programming Lab  
- **Project**: CSEDU Website (Front-end and Back-end)  
- **Tech Stack**:
  - **Frontend**: React + Vite, Tailwind CSS (see `csedu-website/`)  
  - **Backend**: Python (FastAPI / Flask style API in `cseduBackend/`)  
  - **Database**: SQL script in `cseduBackend/csedu_db.sql`

### Project Structure
- `csedu-website/` – Frontend source (React app, pages, components, assets)  
- `cseduBackend/` – Backend source (API, models, database, static uploads)  

### How to Run (Basic)
- **Frontend**:
  1. `cd csedu-website`
  2. `npm install`
  3. `npm run dev`

- **Backend** (example with uvicorn for FastAPI-style app):
  1. `cd cseduBackend`
  2. Create venv & install: `python -m venv venv && source venv/bin/activate`  
     then `pip install -r requirements.txt`
  3. Run: `uvicorn main:app --reload`

> Adjust the backend run command if you are using a different framework or entrypoint, but `main.py` is the primary backend file.

### Notes
- This project is for academic purposes as part of the CSE-4113 lab.  
- You can extend it with additional features (authentication, admin panels, more pages) as needed for the course.


