// Constant for the approximation of the normal distribution
const a = (8 * (Math.PI - 3)) / (3 * Math.PI * (4 - Math.PI));

// An approximation of the inverse error function
const inv_erf = (x) => {
  return (
    Math.sign(x) *
    Math.sqrt(
      Math.sqrt(
        (2 / (Math.PI * a) + Math.log(1 - x ** 2) / 2) ** 2 -
          Math.log(1 - x ** 2) / a
      ) -
        (2 / (Math.PI * a) + Math.log(1 - x ** 2) / 2)
    )
  );
};

const normal_approx = (x, mu, sigma) => {
  // Convert a uniform distribution [0, 1] into a normal distribution
  // x is a seed (value from the uniform distribution)
  // mu is the mean for the normal distribution
  // sigma is the standard distribution for the normal distribution
  const scaledX = 2 * x - 1;
  return sigma * Math.sqrt(2) * inv_erf(scaledX) + mu;
};

export const truth = (x, functionName, noiseSigma) => {
  // Create y = func(x) + noise
  const noise = normal_approx(Math.random(), 0, noiseSigma);
  if (functionName === "Exponential") {
    return Math.exp(x) + noise;
  } else if (functionName === "Linear") {
    return 0.5 * x + 1 + noise;
  } else if (functionName === "Sinusoidal") {
    return Math.sin(x) + noise;
  } else if (functionName === "Step") {
    if (x >= 0) {
      return x - (x % 3) + noise;
    } else {
      return x - 3 - (x % 3) + noise;
    }
  }
};
