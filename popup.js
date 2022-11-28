let dataString='';
const tabs = await chrome.tabs.query({ currentWindow: true });

const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

const template = document.getElementById("li_template");
const elements = new Set();
for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true);
  console.log(`${JSON.stringify(tab, null, 2)}`);

  const title = tab.title; 
  const tabUrl = tab.url;
  dataString+=`${title}+\n+${tabUrl}+\n\n`;
  element.querySelector(".title").textContent = title;
  element.querySelector(".pathname").textContent = tabUrl;
  element.querySelector("a").addEventListener("click", async () => {
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  elements.add(element);
}

document.querySelector("ul").append(...elements);

const button = document.querySelector("button");
button.addEventListener("click", async () => {
  const type = "text/plain";
  const blob = new Blob([dataString], { type });
  const data = [new ClipboardItem({ [type]: blob })];

  await navigator.clipboard.write(data);
});