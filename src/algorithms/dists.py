import numpy as np
import matplotlib.pyplot as plt

a = 8 * (np.pi - 3) / (3 * np.pi * (4 - np.pi))

def inv_erf(x):
    return np.sqrt(np.sqrt( ( 2 / (np.pi * a) + np.log(1 - x**2)/2 )**2 - np.log(1-x**2)/a ) - (2/(np.pi*a) + np.log(1 - x**2) / 2) )

ys = np.random.uniform(0, 1, 10_000)

xs = [ np.sign(2 * y - 1) * (2 * np.sqrt(2) * inv_erf(2 * y - 1)) for y in ys]

fig, axes = plt.subplots(2)

real_xs = np.random.normal(0, 2, 10_000)

print(np.mean(xs), np.mean(real_xs))
print(np.std(xs), np.std(real_xs))
axes[0].hist(xs, bins=np.linspace(-4, 4, 100))
axes[1].hist(real_xs, np.linspace(-4, 4, 100))
plt.show()