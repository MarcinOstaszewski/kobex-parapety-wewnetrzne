import { AKTUALNE_ZAMOWIENIE, entriesToAddRowNumber } from "../consts/consts";
import { currentOrderDescription } from "../consts/consts-ui-elements";
import { orderTypes } from "../consts/mappings";
import { flashNewListElement } from "../utils/utils-ui-updates";
import { getFormData, getOrderURL } from "../utils/utils";
import { partialFormReset, resetForm } from "../utils/utils-ui-updates";
import { showOrdersListFromLocalStorage } from "./showOrdersListFromLocalStorage";
import { addOrderToLocalStorage } from "./addOrdersToLocalStorage";

export function addNewOrderToList(type: keyof typeof orderTypes = orderTypes.normal) {
  const data = getFormData();
  const url = getOrderURL();
  let queriesString = "?kalkulator=true&";
  let dlugosc = 0;
  let szerokosc = 0;
  let ilosc = 0;
  let surface = 0;
  let dodatkowe = 'dodatkowe=';

  for (const entry in data) {
    if (data[entry] !== "") {
      let value = entry ;
      if (entriesToAddRowNumber.includes(entry)) {
        value += '-row-' + 1;
      }
      if (entry === 'rabat' && data[entry] !== '0') {
        dodatkowe += 'Rabat:' + data[entry] + '%& /n';
      }
      if (entry === 'dlugosc') dlugosc = parseFloat(data[entry] as string);
      if (entry === 'szerokosc') szerokosc = parseFloat(data[entry] as string);
      if (entry === 'ilosc') ilosc = parseFloat(data[entry] as string);
      queriesString += value + "=" + data[entry] + "&";
    }
  }
  if (dlugosc && szerokosc && ilosc) {
    surface = dlugosc * szerokosc * ilosc;
    queriesString += 'powierzchnia=' + surface + '&';
    console.log('Powierzchnia zamówienia wynosi: ' + surface);
    dodatkowe += 'Powierzchnia zamówienia wynosi: ' + surface; // (surface / 1000000).toFixed(3) + 'm² ';
  }

  if (dodatkowe) {
    queriesString += dodatkowe + "&";
  }

  addOrderToLocalStorage({
    textContent: currentOrderDescription.innerHTML.replace(AKTUALNE_ZAMOWIENIE, ''),
    url: url,
    queriesString: queriesString,
    // @ts-expect-error // can't assign the right type to the type property
    type: type,
    addToLastOrder: false,
    surface: surface
  });
  if (type === orderTypes.multi) {
    partialFormReset();
  } else {
    resetForm();
  }
  showOrdersListFromLocalStorage();
  flashNewListElement();
}