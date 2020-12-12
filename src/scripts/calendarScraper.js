function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
localStorage.setItem('calendarICS', getElementByXpath('//*[@id="calendar-feed-box-lower"]/input').value);
