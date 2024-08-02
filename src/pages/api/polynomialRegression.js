import { range, multiply, transpose, inv, pinv, matrix, add } from 'mathjs';

export function polynomialRegression(x, y, degree = 2) {
    const X = [];
    const Y = y;

    for (let i = 0; i < x.length; i++) {
        const row = [];
        for (let j = 0; j <= degree; j++) {
            row.push(Math.pow(x[i], j));
        }
        X.push(row);
    }

    const XMatrix = matrix(X);
    const YMatrix = matrix(Y);
    const XT = transpose(XMatrix);
    const XTX = multiply(XT, XMatrix);
    const XTY = multiply(XT, YMatrix);

    let coefficients;
    try {
        coefficients = multiply(inv(XTX), XTY).valueOf();
    } catch (error) {
        console.warn('Matrix is singular, using pseudo-inverse instead');
        coefficients = multiply(pinv(XTX), XTY).valueOf();
    }

    return coefficients;
}
