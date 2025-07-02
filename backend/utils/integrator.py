def rk4(f, state, dt, *args):
    def add(s1, s2, factor=1.0):
        return {k: s1[k] + factor * s2[k] for k in s1}

    k1 = f(state, *args)
    k2 = f(add(state, k1, dt / 2), *args)
    k3 = f(add(state, k2, dt / 2), *args)
    k4 = f(add(state, k3, dt), *args)

    return {
        k: state[k] + (dt / 6.0) * (k1[k] + 2 * k2[k] + 2 * k3[k] + k4[k])
        for k in state
    }