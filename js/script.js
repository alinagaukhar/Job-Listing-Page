async function getData() {
    let response = await fetch("data.json");
    if (response.status === 200) {
        const data = await response.json();
        return data;
    } else {
        console.log("Could not fetch data");
    }
}

function removeFilter(event){
    const filter = event.target.getAttribute("data-value");
    filters.delete(filter);
    const element = document.getElementById(filter);
    element.remove();
    renderData();
}
function clearFilters(){
    filters.forEach( x => {
        const element = document.getElementById(x);
        element.remove();
    })
    filters = new Set();
    renderData();
}
function addFilter(event){
    let tag = event.target.innerText;
    console.log(tag);
    if (!filters.has(tag)) {
        document.querySelector(".text").innerHTML += `<button id="${tag}" type="button" class="filter" onclick="removeFilter(event)" data-value="${tag}">${tag}</button>`;
    }
    filters.add(tag);
    renderData();
}

function generateTags(item) {
    const tags = new Set();
    item.languages.forEach(x => tags.add(x));
    item.tools.forEach(x => tags.add(x));
    tags.add(item.role);
    tags.add(item.level);
    return tags;
}

function filter(item){
    tags = generateTags(item);
    var flag = true;
    filters.forEach( item => {
        if (!(tags.has(item))) {
            flag = false;
            return false;
        }
    });
    if (flag) return true;
    return false;
}

async function renderData() {
    const data = await getData();
    const filteredData = data.filter(filter);
    const element = document.querySelector(".main-content");
    element.innerHTML = "";
    console.log(filteredData);
    filteredData.forEach(x => {
        const tags = [...generateTags(x)].map(x => `<p class="tag" onclick="addFilter(event)">${x}</p>`).join("");
        // console.log(tags);
        var html = "";
        if (x.featured) {
            html += `<div class="item--featured">`;
        }
        else {
            html += `<div class="item">`;
        }
        html += `<div class="tmp">
        <img class="logo img-responsive" src="${x.logo}">
        <div class="description">
          <div class="top">
            <span class="name">${x.company}</span>`;
        if (x.new) {
            html += `<span class="new">New!</span>`;
        }
        if (x.featured) {
            html += `<span class="featured">Featured</span>`;
        }
        html += `</div>
          <div class="position">${x.position}</div>
          <div class="shorts">
            <span class="posted">${x.postedAt}</span>
            <span class="dot">.</span>
            <span class="type">${x.contract}</span>
            <span class="dot">.</span>
            <span class="location">${x.location}</span>
          </div>
        </div>
      </div>
      <hr>
      <div class="tags">
        ${tags}
      </div>
      </div>`;
      element.innerHTML += html;
    });
}
var filters = new Set();
renderData();






