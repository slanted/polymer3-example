var CurrencyService = function() {
    var byCountry = {
        "US": {
            symbol:"$",
            delimiter:'',
            decimal:".",
            accuracy:2
        },
        "CA": {
            symbol:"$",
            delimiter:'',
            decimal:".",
            accuracy:2
        },
        "DE": {
            symbol: "€",
            delimiter:",",
            decimal:".",
            accuracy:2
        }
    };

    function getCurrency(country) {
        var currency = byCountry[country];
        return currency;
    }
    
    function setDefaults(currency) {
        if (currency) {
            if (!currency.delimiter) {
                currency.delimiter = ',';
            }
            if (!currency.decimal) {
                currency.decimal = '.';
            }
        }
    }

    function getCountryKey(_country, _language) {
        var country,
            language;

        country = _country;
        language = _language;

        if (country === 'CA' && language === 'fr') {
            country = language + '_' + country;
        }

        return country;
    }

    function initAmount(amount) {
        // Make sure the amount is a number.
        var initializedNumber = parseFloat(amount);
        if (isNaN(initializedNumber)) {
            initializedNumber = 0.00;
        }
        return initializedNumber;
    }

    function applyAccuracyDelimiterDecimal(currency, amount) {
        var p = amount.toFixed(currency.accuracy).split("."),
            chars = p[0].split("").reverse(),
            newstr = '',
            count = 0;

        for (var x = 0; x < chars.length; x++) {
            count++;
            if (count%3 == 1 && count != 1) {
                // Add in the delimiter
                newstr = chars[x] + currency.delimiter + newstr;
            } else {
                newstr = chars[x] + newstr;
            }
        }

        // Add in the decimal
        var retVal = newstr;

        if (p[1] !== undefined) {
            retVal += currency.decimal + p[1];
        }

        return retVal;
    }

    function applySymbol(currency, amount) {
        if (currency.after === 'true'){
            amount = amount + currency.symbol;
        } else {
            amount = currency.symbol + amount;
        }
        return amount;
    }

    var format = function(amount, country, language) {
        var currency,
            formatted = amount;

        currency = getCurrency(getCountryKey(country, language));

        if (currency) {
            formatted = initAmount(amount);
            formatted = applyAccuracyDelimiterDecimal(currency, formatted); // Busted for VN
            formatted = applySymbol(currency, formatted);
        }
        return formatted;
    };

    return {
        format: format
    }
}();

export default CurrencyService;