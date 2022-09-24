import fx from 'money';

export function convert(base, rates, amount, from, to){
	var toCurrency;
    fx.base = base;
    fx.rates = rates;
    if(to){
    	toCurrency = to
    } else {
    	toCurrency = base
    }
    let value = fx.convert(amount, {from, to: toCurrency});
    return value;
}
	