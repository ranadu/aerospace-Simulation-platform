from fastapi import APIRouter
from simulator import Simulator

router = APIRouter()
sim = Simulator()

@router.post("/init")
def init_sim():
    sim.reset()
    return {"message": "Simulation initialized."}

@router.get("/step")
def step_sim():
    state = sim.step()
    return {"state": state}

@router.get("/telemetry")
def get_state():
    return {"state": sim.state}