from models.six_dof import six_dof_dynamics
from models.aero_forces import compute_aero_forces
from models.environment import get_environment
from utils.integrator import rk4
from config import initial_state, dt

class Simulator:
    def __init__(self):
        self.state = initial_state.copy()
        self.t = 0.0

    def step(self):
        control_inputs = {'aileron': 0, 'elevator': 0, 'rudder': 0, 'thrust': 0}
        env = get_environment(self.state, self.t)
        aero = compute_aero_forces(self.state, control_inputs)
        self.state = rk4(six_dof_dynamics, self.state, dt, aero, env)
        self.t += dt
        return self.state

    def reset(self):
        from config import initial_state
        self.state = initial_state.copy()
        self.t = 0.0