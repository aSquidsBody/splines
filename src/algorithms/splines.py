import collections
import math
import numpy as np
import matplotlib.pyplot as plt

datapoints = []  # (N+1)x2

"""
for points (i-1) to i
fi(x) = ai + bix + cix**2 + dix ** 3

2N conditions
f1(x1) = a1 + b1*x1 + c1*x1**2 + d1*x1**3 = y1
fi(xi+1) = fi+1(xi+1) = yi+1 (a1 + b1*x1+1 + c1*x1+1**2 + d1*x1+1**3 = a2 + b2*x1+1 + c2*x1+1**2 + d2*x1+1**3 )
fn(xn+1)=yn+1

Also derivative conditions at interior knot points (N-1 equations... don't include boundries)
fi'(xi+1) = fi+1'(xi+1) i = 1, ... N

Also second derivative conditions at interior knot points
fi''(xi+1) = fi+1''(xi+1) i = 1, ... N

We have 4N-2 equations (need 4N to get all the unknowns)
Natural choice for last two is derivatice conditions at the end points
f1''(x1) = 0 = fn''(xn+1)=0


4N variables, 4N equations
x = [a1, b1, c1, d1, ...]  4Nx1
M = [
    [1, x1, x1**2, x1**3, 0, 0, ... ]  4Nx1
    [0, 1, 2 * x1]
]

"""

def cube(t, coeffs):
    return coeffs[0] + t*coeffs[1] + coeffs[2] * t**2 + coeffs[3] * t ** 3

def generate_cubic_rows(x, y=[], rows=[]):
    """ x is a list of N x-values. y is a list of N y-values
        Return 2 * (N-1) rows """
    N = len(x)

    # N-1 equations
    for i in range(0, N-1):
        f_i_xi = [0 for _ in range(4 * (N - 1))]

        offset = 4 * i
        f_i_xi[offset + 0] = 1
        f_i_xi[offset + 1] = x[i]
        f_i_xi[offset + 2] = x[i] ** 2
        f_i_xi[offset + 3] = x[i] ** 3

        rows.append(f_i_xi)

    # N-1 equations
    for i in range(1, N):
        f_i_xim1 = [0 for _ in range(4 * (N - 1))]

        offset = 4 * (i-1)
        f_i_xim1[offset + 0] = 1
        f_i_xim1[offset + 1] = x[i]
        f_i_xim1[offset + 2] = x[i] ** 2
        f_i_xim1[offset + 3] = x[i] ** 3

        rows.append(f_i_xim1)

    return rows
        
def generate_derivative_rows(x, y=[], rows=[]):

    N = len(x)

    # N-2 equations
    for i in range(1, N-1):
        f_i_der = [0 for _ in range(4 * (N - 1))]

        offset = 4 * i
        f_i_der[offset + 0] = 0
        f_i_der[offset + 1] = 1
        f_i_der[offset + 2] = 2 * x[i]
        f_i_der[offset + 3] = 3 * x[i] ** 2

        f_i_der[offset - 4 + 0] = 0
        f_i_der[offset - 4 + 1] = -1
        f_i_der[offset - 4 + 2] = -2 * x[i]
        f_i_der[offset - 4 + 3] = -3 * x[i] ** 2

        rows.append(f_i_der)

    return rows


def generate_second_derivative_rows(x, y=[], rows=[]):
    N = len(x)

    # N-2 equations
    for i in range(1, N-1):
        f_i_der2 = [0 for _ in range(4 * (N - 1))]

        offset = 4 * i
        f_i_der2[offset + 0] = 0
        f_i_der2[offset + 1] = 0
        f_i_der2[offset + 2] = 2 
        f_i_der2[offset + 3] = 6 * x[i]

        f_i_der2[offset - 4 + 0] = 0
        f_i_der2[offset - 4 + 1] = 0
        f_i_der2[offset - 4 + 2] = -2 
        f_i_der2[offset - 4 + 3] = -6 * x[i]

        rows.append(f_i_der2)

    return rows

def generate_boundry_rows(x, y=[], rows=[]):
    N = len(x)
    first_boundry = [0 for _ in range(4 * (N - 1))]
    last_boundry = [0 for _ in range(4 * (N - 1))]

    first_boundry[0] = 0
    first_boundry[1] = 0
    first_boundry[2] = 2
    first_boundry[3] = 6 * x[0]

    last_boundry[-4] = 0
    last_boundry[-3] = 0
    last_boundry[-2] = 2
    last_boundry[-1] = 6 * x[-1]

    # first_boundry[0] = 0
    # first_boundry[1] = 1
    # first_boundry[2] = 2 * x[0]
    # first_boundry[3] = 3 * x[0] ** 2

    # last_boundry[-4] = 0
    # last_boundry[-3] = 1
    # last_boundry[-2] = 2 * x[-1]
    # last_boundry[-1] = 3 * x[-1] ** 2

    rows.append(first_boundry)
    rows.append(last_boundry)

    return rows


def generate_cubic_col(y):
    """ y is a list of N y-values """
    N = len(y)

    col = []
    # N-1 values
    for i in range(0, N-1):
        col.append(y[i])

    # N-1 values
    for i in range(1, N):
        col.append(y[i])

    return col
        
def generate_derivative_col(y):
    N = len(y)

    col = []

    # N-2 values
    for i in range(1, N-1):
        col.append(0)

    return col


def generate_second_derivative_col(y):
    N = len(y)

    col = []

    # N-2 equations
    for i in range(1, N-1):
        col.append(0)

    return col

def generate_boundry_cols():
    col = [0, 0]

    return col

def spline(x, y, interval_pts):
    # setup linear equation: Az = b, where z contains the coefficients of the cubic spline
    A = []
    A = generate_cubic_rows(x, y, A)
    A = generate_derivative_rows(x, y, A)
    A = generate_second_derivative_rows(x, y, A)
    A = generate_boundry_rows(x, y, A)

    b = []
    b.extend(generate_cubic_col(y))
    b.extend(generate_derivative_col(y))
    b.extend(generate_second_derivative_col(y))
    b.extend(generate_boundry_cols())

    A = np.array(A)
    b = np.array(b)

    print(b)

    # sol == z, i.e. sol contains the coefficients of the cubic splines
    sol = np.linalg.solve(A, b)

    # setup plot (xs and ys will be plt.plotted)
    xs = []
    for interval_idx in range(len(x) - 1):
        xs.extend(list(np.linspace(x[interval_idx], x[interval_idx + 1], interval_pts)))
    # xs = np.linspace(x[0], x[-1], interval_pts * (len(x) - 1))
    ys = []  # will add cubic values
    for i, xs_i in enumerate(xs):
        x_index = i // interval_pts  # determine which cubic spline coefficients to use (divided by the input x-datapoints)
        ys.append(cube(xs_i, sol[4 * x_index : 4*(x_index + 1)]))  # apply the correct cubic spline

    return xs, ys

if __name__ == '__main__':
    spline([1, 2, 3], [1, 2, 3], 2)
    quit()

    ############################ CONFIG ##################################
    ######################################################################
    ######################################################################

    # input datapoints
    num_datapoints = 20 # must be greater than 1
    x = list(np.random.uniform(0, 10, num_datapoints))
    # y = np.random.uniform(0, 20, num_datapoints)
    y = list(np.random.normal(0, 10, num_datapoints // 2))
    y.extend(list(np.random.uniform(-20, 20, num_datapoints // 2)))

    # number of points to be interpolated between each true datapoint,
    interval_pts = 20 # must be greater than 2

    x.sort()

    ######################################################################
    ######################################################################
    ######################################################################

    xs, ys = spline(x, y, interval_pts=20)

    fig, axes = plt.subplots(4)
    axes[0].set_title("Linear interpolation vs cubic spline\nBlue=Linear Interp.\nOrange=Spline")

    axes[0].scatter(x, y, color='black')
    axes[1].plot(x,y)
    axes[1].scatter(x, y, color='black')
    axes[2].scatter(xs, ys, marker=".", color='tab:orange')
    axes[2].scatter(x, y, color='black')
    axes[3].plot(x, y)
    axes[3].plot(xs, ys, color='tab:orange')
    axes[3].scatter(x, y, color='black')
    plt.show()