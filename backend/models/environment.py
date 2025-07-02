from config import mass

def get_environment(state, t):
    g = 9.81
    Fx, Fy = 0.0, 0.0
    Fz = mass * g
    return {'Fx': Fx, 'Fy': Fy, 'Fz': Fz}