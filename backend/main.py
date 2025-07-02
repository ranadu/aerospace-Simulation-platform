from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

app = FastAPI(title="6-DOF Aerospace Simulation API")

# Enable CORS (for frontend requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add API routes
app.include_router(router)

@app.get("/")
def root():
    return {"message": "6-DOF Aerospace Simulation API running"}


# ------------------------------------------------------------
# PHASE 1 LOCAL TESTING MODE (commented out for API deployment)
# ------------------------------------------------------------

# from simulator import run_simulation
#
# if __name__ == "__main__":
#     run_simulation()