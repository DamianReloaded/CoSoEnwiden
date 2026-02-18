function reddenPage()
{
	function ToggleColumnWidth()
    {
        var elements = document.getElementsByClassName("column");

        for (var i = 0; i < elements.length; i++)
        {
            if (elements[i].ariaLabel === "Community firehose")
            {
                var currentWidth = elements[i].style.width;

                if (currentWidth === "900px")
                {
                    elements[i].style.width = "400px";
                }
                else if (currentWidth === "650px")
                {
                    elements[i].style.width = "900px";
                }
                else
                {
                    elements[i].style.width = "650px";
                }
            }
        }
    }
	
    function GetYoutubeId(url)
    {
        if (!url)
        {
            return null;
        }

        var match = url.match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
        );

        return match ? match[1] : null;
    }

    function ProcessLink(link)
	{
		if (!link || link.dataset.youtubeProcessed)
		{
			return;
		}

		var id = GetYoutubeId(link.href);

		if (!id)
		{
			return;
		}

		link.dataset.youtubeProcessed = "true";

		var container = document.createElement("div");
		container.style.position = "relative";
		container.style.width = "100%";
		container.style.maxWidth = "640px";
		container.style.paddingBottom = "56.25%";
		container.style.height = "0";
		container.style.marginTop = "8px";
		container.style.borderRadius = "12px";
		container.style.overflow = "hidden";
		container.style.boxShadow = "0 6px 18px rgba(0,0,0,0.35)";

		var iframe = document.createElement("iframe");
		iframe.src = "https://www.youtube.com/embed/" + id;
		iframe.style.position = "absolute";
		iframe.style.top = "0";
		iframe.style.left = "0";
		iframe.style.width = "100%";
		iframe.style.height = "100%";
		iframe.style.border = "0";
		iframe.allow =
			"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
		iframe.allowFullscreen = true;

		container.appendChild(iframe);

		link.innerHTML = "";
		link.appendChild(container);
	}


    function ProcessAllLinks(root)
    {
        var links = root.querySelectorAll("a");

        for (var i = 0; i < links.length; i++)
        {
            ProcessLink(links[i]);
        }
    }

	function InitializeColumnHeaderToggle()
	{
		if (window.columnToggleInitialized)
		{
			return;
		}

		window.columnToggleInitialized = true;

		var headers = document.querySelectorAll(".column-header__wrapper");

		for (var i = 0; i < headers.length; i++)
		{
			var button = headers[i].querySelector("h1.column-header > button");

			if (button && button.textContent.includes("Community firehose"))
			{
				button.addEventListener("click", function()
				{
					ToggleColumnWidth();
				});
			}
		}
	}


    // Initial pass
    ProcessAllLinks(document);
	
	// Appply Enwiden
	InitializeColumnHeaderToggle();
	
    // Observe dynamic changes
    var observer = new MutationObserver(function(mutations)
    {
        for (var i = 0; i < mutations.length; i++)
        {
            var nodes = mutations[i].addedNodes;

            for (var j = 0; j < nodes.length; j++)
            {
                if (nodes[j].nodeType === 1)
                {
                    ProcessAllLinks(nodes[j]);
                }
            }
        }
    });

    observer.observe(document.body,
    {
        childList: true,
        subtree: true
    });
}


chrome.action.onClicked.addListener((tab) =>
{
    if (!tab.url.includes("chrome://"))
    {
        chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: reddenPage
        });
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab)
{
    if (changeInfo.status === "complete" &&
        tab.url &&
        tab.url.includes("counter.social"))
    {
        chrome.scripting.executeScript(
        {
            target: { tabId: tabId },
            function: reddenPage
        });
    }
});