export const fractions = (decimal) => {
    const gcd = function (a, b) {
        // Since there is a limited precision we need to limit the value.
        if (b < 0.0000001) return a;

        // Discard any fractions due to limitations in precision.
        return gcd(b, Math.floor(a % b));
    };

    const len = decimal.toString().length - 2;

    let denominator = Math.pow(10, len);
    let numerator = decimal * denominator;

    const divisor = gcd(numerator, denominator);

    numerator /= divisor;
    denominator /= divisor;

    return (Math.floor(numerator) + '/' + Math.floor(denominator));
}