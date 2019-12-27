import currencyFormatter from 'currency-formatter';

function formatterPrice(price) {
  price /= 100;
  return currencyFormatter.format(price, { locale: 'pt-BR' });
}

export default formatterPrice;
