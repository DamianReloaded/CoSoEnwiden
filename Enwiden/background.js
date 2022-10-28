function reddenPage() {
	if (document.location.host == 'counter.social') {
		var elements = document.getElementsByClassName('column');
		for(var i=0; i<elements.length; i++) {
			if (elements[i].ariaLabel=="Community firehose") {
				if (elements[i].style.width == '900px') {
					elements[i].style.width = '300px';
				}
				else if (elements[i].style.width == '650px') {
					elements[i].style.width = '900px';
				}
				else {
					elements[i].style.width = '650px';
				}
			}
		}
	}
}

chrome.action.onClicked.addListener((tab) => {
  if(!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: reddenPage
    });
  }
});