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

@router.post("/control")
def control_input(theta: float, psi: float, u: float):
    """
    Accepts manual control input and updates the aircraft state.
    This overrides the current simulation step.
    """
    sim.state.theta = theta
    sim.state.psi = psi
    sim.state.u = u
    return {"status": "manual input applied", "state": sim.state.model_dump()}