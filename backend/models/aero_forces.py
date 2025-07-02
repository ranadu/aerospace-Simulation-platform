def compute_aero_forces(state, control_inputs):
    u, w = state['u'], state['w']
    rho = 1.225
    S = 16.2
    CL = 0.5
    CD = 0.05

    V = (u**2 + w**2) ** 0.5
    qbar = 0.5 * rho * V**2
    L = qbar * S * CL
    D = qbar * S * CD

    Fx = -D
    Fz = -L

    return {
        'Fx': Fx, 'Fy': 0.0, 'Fz': Fz,
        'L': 0.0, 'M': 0.0, 'N': 0.0
    }