function versionCompare(requestNumber1, requestNumber2) {
    let number1Split, number2Split, number1SplitLength = 0, number2SplitLength = 0;
    let convertedNumber1, convertedNumber2, forceUpdate = false;

    if (requestNumber1 && requestNumber2) {
        number1Split = requestNumber1.split('.'); // Split by .
        number2Split = requestNumber2.split('.'); // Split by .
        number1SplitLength = number1Split.length; // Split length
        number2SplitLength = number2Split.length; // Split length

        if (number1SplitLength > 2 && number2SplitLength > 2) { // If both numbers look like X.X.X
            //forceUpdate = convertedNumber1 < convertedNumber2;
            // New Approach
            convertedNumber1 = Number(number1Split[0] + '.' + number1Split[1]);
            convertedNumber2 = Number(number2Split[0] + '.' + number2Split[1]);
            if (convertedNumber1 < convertedNumber2) {
                forceUpdate = true;
            } else if (convertedNumber1 === convertedNumber2) {
                forceUpdate = Number(number1Split[2]) < Number(number2Split[2]);
            }
        } else { // If both numbers not look like X.X.X
            convertedNumber1 = number1SplitLength > 1 ? Number(`${number1Split[0] + '.' + number1Split[1]}`) : Number(requestNumber1); // Convert String to Number X.X or X

            convertedNumber2 = number2SplitLength > 1 ? Number(`${number2Split[0] + '.' + number2Split[1]}`) : Number(requestNumber2); // Convert String to Number X.X or X

            forceUpdate = convertedNumber1 < convertedNumber2; // Check Version is lower version or not
            if (!forceUpdate && convertedNumber1 === convertedNumber2 && number2SplitLength > 2) {
                forceUpdate = true; // For X.X.X
            }
        }
    }

    return {
        number1: requestNumber1,
        number2: requestNumber2,
        forceUpdate
    };
}

function formatExponentialNumber(x) {
    if (x && x.toString().indexOf('e+') !== -1) {
        const splitNumbers = x.toString().split('e+');
        let result = splitNumbers[0] + splitNumbers[1];
        result = Number(result).toFixed(2);
        return result;
    }

    return x;
}

export {
    versionCompare,
    formatExponentialNumber
};
