from config import mass, Ixx, Iyy, Izz
from math import sin, cos, tan

def six_dof_dynamics(state, aero, env):
    u, v, w = state['u'], state['v'], state['w']
    p, q, r = state['p'], state['q'], state['r']
    phi, theta, psi = state['phi'], state['theta'], state['psi']

    Fx = aero['Fx'] + env['Fx']
    Fy = aero['Fy'] + env['Fy']
    Fz = aero['Fz'] + env['Fz']
    L, M, N = aero['L'], aero['M'], aero['N']

    udot = r * v - q * w + Fx / mass
    vdot = p * w - r * u + Fy / mass
    wdot = q * u - p * v + Fz / mass

    pdot = (L - (Izz - Iyy) * q * r) / Ixx
    qdot = (M - (Ixx - Izz) * p * r) / Iyy
    rdot = (N - (Iyy - Ixx) * p * q) / Izz

    phidot = p + q * sin(phi) * tan(theta) + r * cos(phi) * tan(theta)
    thetadot = q * cos(phi) - r * sin(phi)
    psidot = q * sin(phi) / cos(theta) + r * cos(phi) / cos(theta)

    return {
        'x': u, 'y': v, 'z': w,
        'u': udot, 'v': vdot, 'w': wdot,
        'phi': phidot, 'theta': thetadot, 'psi': psidot,
        'p': pdot, 'q': qdot, 'r': rdot
    }