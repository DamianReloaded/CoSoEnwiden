function reddenPage()
{
    function GetYoutubeId(url)
    {
        const match = url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
        );

        return match ? match[1] : null;
    }

    if (document.location.host == "counter.social")
    {
        var elements = document.getElementsByClassName("column");

        for (var i = 0; i < elements.length; i++)
        {
            if (elements[i].ariaLabel == "Community firehose")
            {
                if (elements[i].style.width == "900px")
                {
                    elements[i].style.width = "300px";
                }
                else if (elements[i].style.width == "650px")
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

    var links = document.getElementsByTagName("a");

    for (var i = 0; i < links.length; i++)
    {
        var href = links[i].href;
        var id = GetYoutubeId(href);

        if (id)
        {
            var img = document.createElement("img");
            img.src = "https://img.youtube.com/vi/" + id + "/hqdefault.jpg";
            img.style.maxWidth = "320px";
            img.style.display = "block";

            var newLink = document.createElement("a");
            newLink.href = href;
            newLink.target = "_blank";
            newLink.appendChild(img);

            links[i].parentNode.replaceChild(newLink, links[i]);
        }
    }
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
