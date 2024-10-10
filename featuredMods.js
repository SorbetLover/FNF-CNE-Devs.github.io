function randomizeOrder(){for(var e=document.querySelectorAll(".featured-mod"),t=e[0].parentNode,r=Array.from(e),n=r.length-1;0<n;n--){var o=Math.floor(Math.random()*(n+1)),a=r[n];r[n]=r[o],r[o]=a}for(var l=document.createDocumentFragment(),n=0;n<r.length;n++)l.appendChild(r[n].cloneNode(!0));clearElement(t),t.appendChild(l)}function clearElement(e){for(;e.firstChild;)e.removeChild(e.firstChild)}function sortByTime(e,t){var e=e.getAttribute("data-time"),t=t.getAttribute("data-time");return null==e?1:null==t?-1:"unreleased"===e?1:"unreleased"===t?-1:"unknown"===e?1:"unknown"===t?-1:(e=new Date(e).getTime())===(t=new Date(t).getTime())?0:e<t?1:-1}function recentOrder(){for(var e=document.querySelectorAll(".featured-mod"),t=e[0].parentNode,r=Array.from(e),n=(r.sort(sortByTime),document.createDocumentFragment()),o=0;o<r.length;o++)n.appendChild(r[o].cloneNode(!0));clearElement(t),t.appendChild(n)}var sortButtons=document.querySelectorAll(".sort-button"),orderButtons=document.querySelectorAll(".order-button"),categoryButtons=document.querySelectorAll(".category-button");function getRelativeTimeString(e,t="en"){e="number"==typeof e?e:e.getTime();let r=Math.round((e-Date.now())/1e3);var e=[60,3600,86400,604800,2592e3,31536e3,1/0],n=e.findIndex(e=>e>Math.abs(r)),e=n?e[n-1]:1;return new Intl.RelativeTimeFormat(t,{numeric:"auto"}).format(Math.floor(r/e),["second","minute","hour","day","week","month","year"][n])}sortButtons.forEach(r=>{r.addEventListener("click",function(e){e.preventDefault();var t=r.getAttribute("data-sort");"recent"==t||"random"==t?(("random"==t?randomizeOrder:recentOrder)(),orderButtons.forEach(e=>{e.classList.remove("selected")})):("all"==t?document.querySelectorAll(".featured-mod").forEach(e=>{e.classList.contains("upcoming")?e.style.display="none":e.style.display="block"}):(document.querySelectorAll(".featured-mod").forEach(e=>{e.style.display="none"}),document.querySelectorAll(".featured-mod."+t).forEach(e=>{"upcoming"!=t&&e.classList.contains("upcoming")?e.style.display="none":e.style.display="block"})),categoryButtons.forEach(e=>{e.classList.remove("selected")})),r.classList.add("selected")})}),randomizeOrder();var lastUpdated=document.querySelectorAll(".last-updated");0<lastUpdated.length&&window.Intl&&lastUpdated.forEach(e=>{var t=e.getAttribute("data-time");"unknown"!=t&&null!=t&&"unreleased"!=t&&(e.innerText=getRelativeTimeString(new Date(t)),e.style.display="inline"),"unreleased"==t&&(e.style.display="inline")});