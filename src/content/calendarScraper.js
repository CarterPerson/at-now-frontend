/* eslint-disable no-undef */
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
console.log('Scraping calendar');
const ics = getElementByXpath('//*[@id="calendar-feed-box-lower"]/input')?.value;

if (ics) {
  const payload = {
    ics,
  };
  chrome.runtime.sendMessage({ type: 'POST_ICS', payload }, (res) => {

  });
}
