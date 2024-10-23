(function () {"use strict";
function createCookie(name, value) {
	localStorage.setItem(name, value);
}

function readCookie(name) {
	return localStorage.getItem(name);
}

function toggleInherited(el) {
	var toggle = el.closest(".toggle");
	toggle.classList.toggle("toggle-on");

	var icon = toggle.querySelector("i");
	if (toggle.classList.contains("toggle-on")) {
	  icon.classList.remove("fa-folder");
	  icon.classList.add("fa-folder-open");
	} else {
	  icon.classList.add("fa-folder");
	  icon.classList.remove("fa-folder-open");
	}

	return false;
}

function toggleCollapsed(el) {
    var toggle = el.closest(".expando");
    toggle.classList.toggle("expanded");

    var icon = toggle.querySelector("i");
    if (toggle.classList.contains("expanded")) {
        icon.classList.remove("fa-folder");
        icon.classList.add("fa-folder-open");
    } else {
        icon.classList.add("fa-folder");
        icon.classList.remove("fa-folder-open");
    }

    //updateTreeState();
    return false;
}

window.toggleCollapsed = toggleCollapsed;

/*function updateTreeState() {
	var states = [];
	document.querySelectorAll("#nav .expando").forEach(function (el) {
		states.push(el.classList.contains("expanded") ? 1 : 0);
	});
	var treeState = JSON.stringify(states);
	createCookie("treeState", treeState);
}*/

document.addEventListener("DOMContentLoaded", function (event) {
	document.getElementById("nav").innerHTML = navContent;
	var treeState = readCookie("treeState");

	document.querySelectorAll("#nav .expando").forEach(function (el) {
		var i = el.querySelector("i");
		i.classList.add("fa-folder");
		i.classList.remove("fa-folder-open");
	});

	document.querySelectorAll(".treeLink").forEach(function (el) {
		el.href = el.href.replace("::rootPath::", dox.rootPath);
	});

	/*if (treeState != null) {
		var states = JSON.parse(treeState);
		document.querySelectorAll("#nav .expando").forEach(function (el) {
			if (states[i]) {
				el.classList.add("expanded");
				var i = el.querySelector("i");
				i.classList.remove("fa-folder");
				i.classList.add("fa-folder-open");
			}
		});
	}*/

	//setPlatform(readCookie("platform") == null ? "all" : readCookie("platform"));

	document.querySelector("#search").addEventListener("input", function (e) {
		searchQuery(e.target.value);
	});
	document.addEventListener("keyup", function (e) {
		if (e.ctrlKey && e.keyCode == 80) { // ctrl + p
			document.querySelector("#search").focus();
			return false;
		}
		return true;
	});
	document.addEventListener("keydown", function (e) {
		if (e.ctrlKey && e.keyCode == 80) { // ctrl + f
			document.querySelector("#search").focus();
			return false;
		}
		return true;
	});
	function getItems() {
		return document.querySelectorAll("#search-results-list a");
	}
	document.querySelector("#search").addEventListener("keyup", function (e) {
		switch (e.keyCode) {
			case 27: // escape
				searchQuery("");
				document.querySelector("#search").value = "";
				document.querySelector("#search").dispatchEvent(new Event("blur"));
				return false;

			case 13: // enter
				var items = getItems();
				for (i = 0; i < items.length; i++) {
					var item = items[i];
					if (item.classList.contains("selected")) {
						window.location = items[i].href;
						break;
					}
				}
				return false;
		}
	});
	document.querySelector("#search").addEventListener("keydown", function (e) {
		function mod(a, b) {
			var r = a % b;
			return r < 0 ? r + b : r;
		}
		function changeSelection(amount) {
			var previousSelection = null;
			var items = getItems();
			for (i = 0; i < items.length; i++) {
				var item = items[i];
				if (item.classList.contains("selected")) {
					item.classList.remove("selected");
					previousSelection = i;
					break;
				}
			}
			var newSelection = mod(previousSelection + amount, items.length);
			items[newSelection].classList.add("selected");
			items[newSelection].scrollIntoView(false);
		}
		switch (e.keyCode) {
			case 38: // up
				changeSelection(-1);
				return false;

			case 40: // down
				changeSelection(1);
				return false;

			case 13: // enter
				return false;
		}
	});

	/*$("#select-platform").selectpicker().on("change", function (e) {
		var value = $(":selected", this).val();
		setPlatform(value);
	});*/

	document.querySelectorAll("#nav a").forEach(function (el) {
		if (el.href == location.href) {
			el.parentElement.classList.add("selected");
		}
	});

	document.querySelectorAll("a.expand-button").forEach(function (el) {
		var inheritedBlock = el.parentElement.nextElementSibling;
		var icon = el.querySelector("i");
		el.addEventListener("click", function (e) {
			inheritedBlock.classList.toggle("expanded");
			icon.classList.toggle("expanded");
			//icon.classList.toggle("fa-folder-open");
			//icon.classList.toggle("fa-folder");
			return false;
		});
	});

	// Because there is no CSS parent selector
	document.querySelectorAll("code.prettyprint").forEach(function (el) {
		if(el.parentElement.tagName.toLowerCase() != "pre") {
			return;
		}
		el.parentElement.classList.add("example");
	});
});

function searchQuery(query) {
	document.querySelector("#searchForm").removeAttribute("action");
	query = query.replace(/[&<>"']/g, "");
	if (!query || query.length < 2) {
		document.querySelector("#nav").classList.remove("searching");
		document.querySelectorAll("#nav li").forEach(function (el) {
			el.style.display = "";
		});
		document.querySelector("#nav ul:first-child").style.display = "block";
		document.querySelector("#search-results-list").style.display = "none";
		return;
	}
	var queryParts = query.toLowerCase().split(" ");
	var listItems = [];
	var bestMatch = 200;
	document.querySelector("#nav").classList.add("searching");
	document.querySelector("#nav ul:first-child").style.display = "none";
	document.querySelectorAll("#nav li").forEach(function (el) {
		var element = el;
		if (!element.classList.contains("expando")) {
			var content = element.getAttribute("data_path");
			var score = searchMatch(content, queryParts);
			if (score >= 0) {
				if (score < bestMatch) {
					var url = dox.rootPath + element.getAttribute("data_path").split(".").join("/") + ".html";
					document.querySelector("#searchForm").setAttribute("action", url);
					// best match will be form action
					bestMatch = score;
				}

				var elLink = element.querySelector("a");
				// highlight matched parts
				var elLinkContent = elLink.textContent.replace(new RegExp("(" + queryParts.join("|").split(".").join("|") + ")", "ig"), "<strong>$1</strong>");
				var liStyle = (score == 0) ? ("font-weight:bold") : "";
				listItems.push({ score: score, item: "<li style='" + liStyle + "'><a href='" + elLink.getAttribute("href") + "'>" + elLinkContent + "</a></li>" });
			}
		}
	});
	if (document.querySelector("#search-results-list") == null) {
		// append to nav
		document.querySelector("#nav").parentElement.insertAdjacentHTML("beforeend", "<ul id='search-results-list' class='sidebar-unordered-list'></ul>");
	}
	listItems.sort(function (x, y) { return x.score - y.score; }); // put in order
	document.querySelector("#search-results-list").style.display = "block";
	document.querySelector("#search-results-list").innerHTML = listItems.map(function (x) { return x.item; }).join("");
	// pre-select the first item
	document.querySelectorAll("#search-results-list a").forEach(function (el) {
		el.classList.remove("selected");
	});
	document.querySelectorAll("#search-results-list a")[0].classList.add("selected");
}

function match(textParts, query) {
	var queryParts = query.split(".");
	if (queryParts.length == 1) {
		var queryPart = queryParts[0];
		for (var i = 0; i < textParts.length; ++i) {
			var textPart = textParts[i];
			if (textPart.indexOf(queryPart) > -1) {
				// We don't want to match the same part twice, so let's remove it
				textParts[i] = textParts[i].split(queryPart).join("");
				return textPart.length - queryPart.length;
			}
		}
	} else {
		var offset = -1;
		outer:
		while (true) {
			++offset;
			if (queryParts.length + offset > textParts.length) {
				return -1;
			}
			var scoreSum = 0;
			for (var i = 0; i < queryParts.length; ++i) {
				var queryPart = queryParts[i];
				var textPart = textParts[i + offset];
				var index = textPart.indexOf(queryPart);
				if (index != 0) {
					continue outer;
				}
				scoreSum += textPart.length - queryPart.length;
			}
			return scoreSum;
		}
	}
}

function searchMatch(text, queryParts) {
	text = text.toLowerCase();
	var textParts = text.split(".");
	var scoreSum = 0;
	for (var i = 0; i < queryParts.length; ++i) {
		var score = match(textParts, queryParts[i]);
		if (score == -1) {
			return -1;
		}
		scoreSum += score + text.length;
	}
	return scoreSum;
}

function errorSearch() {
	var errorURL = "";
	if (!!window.location.pathname) {
		errorURL = window.location.pathname;
	} else if (!!window.location.href) {
		errorURL = window.location.href;
	}
	if (!!errorURL) {
		var searchTerm = errorURL.split("/").pop();
		if (searchTerm.indexOf(".html") > -1) { searchTerm = searchTerm.split(".html").join(""); }
		if (!!searchTerm) {
			// update filter with search term
			document.querySelector("#search").value = searchTerm;
			searchQuery(searchTerm);
		}
	}
}
})();