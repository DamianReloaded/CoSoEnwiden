function reddenPage()
{
    function GetYoutubeId(url)
    {
        var match = url.match(
            /(?:youtu\.be\/|v=|v\/|embed\/)([A-Za-z0-9_-]{11})/
        );

        return match ? match[1] : null;
    }

    var links = document.getElementsByTagName("a");

    for (var i = links.length - 1; i >= 0; i--)
    {
        var href = links[i].href;
        var id = GetYoutubeId(href);

        if (id)
        {
            var container = document.createElement("div");
            container.style.position = "relative";
            container.style.width = "100%";
            container.style.maxWidth = "480px";
            container.style.paddingBottom = "56.25%"; // 16:9
            container.style.height = "0";
            container.style.marginTop = "8px";
            container.style.cursor = "pointer";
            container.style.overflow = "hidden";
            container.style.borderRadius = "12px";
            container.style.boxShadow = "0 6px 18px rgba(0,0,0,0.35)";

            var img = document.createElement("img");
            img.src = "https://img.youtube.com/vi/" + id + "/hqdefault.jpg";
            img.style.position = "absolute";
            img.style.top = "0";
            img.style.left = "0";
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "cover";
            img.style.transition = "transform 0.2s ease";

            var overlay = document.createElement("div");
            overlay.style.position = "absolute";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";
            overlay.style.pointerEvents = "none";

            overlay.innerHTML = `
                <svg viewBox="0 0 68 48" width="68" height="48">
                    <path fill="#000" fill-opacity="0.7"
                        d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55
                        C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26
                        c0.78,2.93,2.49,5.41,5.42,6.19C12.21,47.87,34,48,34,48
                        s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19
                        C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"/>
                    <path d="M45,24 27,14 27,34" fill="#fff"/>
                </svg>
            `;

            container.appendChild(img);
            container.appendChild(overlay);

            container.addEventListener("mouseenter", function()
            {
                img.style.transform = "scale(1.03)";
            });

            container.addEventListener("mouseleave", function()
            {
                img.style.transform = "scale(1)";
            });

            links[i].innerHTML = "";
            links[i].appendChild(container);
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