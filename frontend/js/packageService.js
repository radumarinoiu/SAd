var baseURL = 'http://localhost:5123';
var versionDictionary = {};

function searchButton() {
    let ajaxHttp = new XMLHttpRequest({ mozSystem: true });
    var url = baseURL + '/search';

    ajaxHttp.open("GET", url, true);

    setAjaxHeaders(ajaxHttp);


    var searchText = document.getElementsByClassName("search-field");

    ajaxHttp.onreadystatechange = function () {
        var obj = JSON.parse(ajaxHttp.response)

        let packageList = obj["package_list"];

        let htmlPackageList = document.getElementsByClassName("package-list")[0];
        htmlPackageList.innerHTML = '';

        packageList.forEach(package => {
            packageNode = createPackageListItem(package);
            htmlPackageList.appendChild(packageNode);
        });
    }

    ajaxHttp.send();
}

function createPackageListItem(package) {
    let section = document.createElement("section");
    section.classList.add("package");
    section.setAttribute("onclick", "expandPackage(this);");

    let name = document.createElement("h2");
    name.innerHTML = package["_name"];

    var expandable = document.createElement("div");
    expandable.classList.add("expandable");

    let id = document.createElement("p");
    id.innerHTML = package["_id"];
    id.style.display = "none";

    let description = document.createElement("p");
    description.innerHTML = package["_description"];

    let version = document.createElement("p");
    version.innerHTML = "version: " + package["_version"];

    let maintainer = document.createElement("p");
    maintainer.innerHTML = "maintainter: " + package["_maintainer"];

    let selectButton = document.createElement("button");
    selectButton.setAttribute("onclick", "selectPackage(this, event");


    let selectVersion = document.createElement("select");

    let baseOption = document.createElement("option");
    baseOption.innerHTML = "select a different version";
    baseOption.disabled = true;

    selectVersion.appendChild(baseOption);
    expandable.appendChild(id)
    expandable.appendChild(description);
    expandable.appendChild(version);
    expandable.appendChild(maintainer);
    expandable.appendChild(selectButton);
    expandable.appendChild(selectVersion);

    section.appendChild(name);
    section.appendChild(expandable);

    return section;
}
async function setVersions(packageContainer) {
    let id = packageContainer.childNodes[1].childNodes[0].textContent;
    let versionSelector = packageContainer.childNodes[1].childNodes[5];
    let url = baseURL + '/getVersions?id=' + id;

    if (versionDictionary[id] === undefined)
        await requestAndSetVersions(url, versionSelector, id);
    else
        

}
async function requestAndSetVersions(requestURL, versionSelector, id) {
    let ajaxHttp = new XMLHttpRequest({ mozSystem: true });
    ajaxHttp.open("GET", requestURL, true);

    ajaxHttp.onreadystatechange = function () {
        var versionsList = JSON.parse(ajaxHttp.response)
        versionSelector.innerHTML = '';

        let baseOption = document.createElement("option");
        baseOption.innerHTML = "select a different version";
        baseOption.disabled = true;
        baseOption.selected = 'selected';

        versionSelector.appendChild(baseOption);

        versionDictionary[id] = versionsList;

        versionsList.forEach(version => {
            let option = createNewVersionOption(version);
            versionSelector.appendChild(option);
        });
    }
    ajaxHttp.send();
}

function versionSelect(elem) {
    version = elem.value;
    id = elem.parentElement.parentElement.childNodes[0].textContent;
    packageSection = elem.parentElement.parentElement.parentElement;



    let url = baseURL + '/getPackage?id=' + id + '&version=' + version;

    let ajaxHttp = new XMLHttpRequest({ mozSystem: true });
    ajaxHttp.open("GET", url, true);
    setAjaxHeaders(ajaxHttp);

    ajaxHttp.onreadystatechange = () => {

        var package = JSON.parse(ajaxHttp.response)
        packageSection.innerHTML = createPackageListItem(package).innerHTML;
        packageSection.style.display = "block";
    }


    ajaxHttp.send();
}


function setAjaxHeaders(ajaxHttp) {
    ajaxHttp.setRequestHeader("content-type", "application/json");
    ajaxHttp.setRequestHeader("Access-Control-Allow-Methods", "*");
    ajaxHttp.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    ajaxHttp.setRequestHeader('Access-Control-Allow-Credentials', 'true');
    ajaxHttp.setRequestHeader('Access-Control-Allow-Origin', '*');
}

function createNewVersionOption(version) {
    let option = document.createElement("option");
    option.setAttribute('onclick', 'versionSelect(this)');
    option.innerHTML = version;
    return option;
}