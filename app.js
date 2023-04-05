// load data
const loadData = () => {
  toggleSpinner(true, "spinner");
  fetch("https://openapi.programming-hero.com/api/ai/tools")
    .then((res) => res.json())
    .then((data) => sortData(data.data.tools));
};

// sort descending order by date
const sortData = (allData) => {
  document.getElementById("sort-by-date").addEventListener("click", function () {
    toggleSpinner(true, "spinner");
    allData.sort(function (a, b) {
      return new Date(b.published_in) - new Date(a.published_in);
    });
    productHandler(allData);
  });
  productHandler(allData);
};

// handle see more button
const productHandler = (allData) => {
  const showAllBtnContainer = document.getElementById("show-allbtn-container");

  if (allData.length < 7) {
    showAllBtnContainer.style.display = "none";
    showData(phones);
  } else {
    showAllBtnContainer.style.display = "block";

    showData(allData.slice(0, 6));
    document.getElementById("show-all").addEventListener("click", function () {
      toggleSpinner(true, "spinner");
      showData(allData);
    });
  }
};
// show data from api to card
const showData = (allData) => {
  // see more and less button handling
  const showAllBtnContainer = document.getElementById("show-allbtn-container");
  const showLessBtnContainer = document.getElementById("show-less-btn-container");
  if (allData.length === 12) {
    showAllBtnContainer.style.display = "none";
    showLessBtnContainer.style.display = "block";
    showLessBtnContainer.addEventListener("click", function () {
      showData(allData.slice(0, 6));
    });
  } else {
    showAllBtnContainer.style.display = "block";
    showLessBtnContainer.style.display = "none";
  }
  console.log(allData);

  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";

  allData.forEach((data) => {
    const cardDiv = document.createElement("div");
    cardDiv.innerHTML = `
        <div class="card card-compact bg-base-100 shadow-xl">
                <figure><img class="h-56 bg-cover" src="${data.image}" alt="Shoes" /></figure>
              <div class="card-body ">
                    <h2 class="card-title">Features</h2>
                    <ul id="" class="list-decimal h-24  mx-3">
                       ${showFeatures(data.features)}
                    </ul>
                   
                  <div class="flex card-footer py-5 border-t-2  justify-between items-center ">
                    <div>
                        <h3 class="text-2xl font-semibold mb-2">${data.name}</h3>
                        <p><i class="fa-solid fa-calendar-days text-gray-400"></i> ${
                          data.published_in
                        }</p>
                    </div>
                      <label onclick="loadDetails('${
                        data.id
                      }')" for="detailsModal" class=" text-2xl rounded-full bg-pink-100 text-red-500 px-3 py-1.5"><i class="fa-solid fa-arrow-right"></i></label>
                  </div>
              </div>
          </div>
        `;

    cardContainer.appendChild(cardDiv);
  });
  toggleSpinner(false, "spinner");
};

// show features
const showFeatures = (features) => {
  let featureList = "";
  features.forEach((feature) => {
    featureList += `<li>${feature}</li>`;
  });
  return featureList;
};
// load details using id
const loadDetails = (id) => {
  toggleSpinner(true, "modal-spinner");
  fetch(`https://openapi.programming-hero.com/api/ai/tool/${id}`)
    .then((res) => res.json())
    .then((data) => showDetails(data.data));
};
// show details in modal
const showDetails = (data) => {
  //   modal left part
  document.getElementById("description").innerText = data.description;

  if (data.pricing === null) {
    // basic plan
    document.getElementById("basic-charge").innerText = "Free of Cost/";
    document.getElementById("basic-label").innerText = "Basic";
    //   pro plan
    document.getElementById("pro-charge").innerText = "Free of Cost/";
    document.getElementById("pro-label").innerText = "Pro";
    //   enterprise plan
    document.getElementById("enterprise-charge").innerText = "Free of Cost/";
    document.getElementById("enterprise-label").innerText = "Enterprise";
  } else {
    // basic plan
    document.getElementById("basic-charge").innerText = data.pricing[0].price;
    document.getElementById("basic-label").innerText = data.pricing[0].plan;
    //   pro plan
    document.getElementById("pro-charge").innerText = data.pricing[1].price;
    document.getElementById("pro-label").innerText = data.pricing[1].plan;
    //   enterprise plan
    document.getElementById("enterprise-charge").innerText = data.pricing[2].price;
    document.getElementById("enterprise-label").innerText = data.pricing[2].plan;
  }
  // features null handling
  const featureListContainer = document.getElementById("feature-list");
  featureListContainer.innerHTML = "";
  if (data.features) {
    for (const feature in data.features) {
      const featureList = document.createElement("li");
      featureList.innerText = data.features[feature]?.feature_name;
      featureListContainer.appendChild(featureList);
    }
  } else {
    featureListContainer.innerHTML = `
    <li>No data Found</li>
    `;
  }

  const integrationListContainer = document.getElementById("integration-list");
  integrationListContainer.innerHTML = "";
  // Null handling on integration part
  if (data.integrations === null) {
    integrationListContainer.innerHTML = `
    <li>No data Found</li>
    `;
  } else {
    data.integrations.forEach((integration) => {
      const integrationList = document.createElement("li");
      integrationList.innerText = integration;
      integrationListContainer.appendChild(integrationList);
    });
  }

  // modal right part
  console.log(data.image_link[0]);
  document.getElementById("image").innerHTML = `
    <img src=${data.image_link[0]} class="rounded-lg" alt="...">
    `;
  // accuracy badge data shown and null handled
  const accuracyBadge = document.getElementById("accuracy-badge");
  if (data.accuracy.score) {
    accuracyBadge.innerHTML = `
      <badge class="bg-red-500 px-2 py-1 font-semibold text-xs rounded text-white">
      ${data.accuracy.score * 100}% Accuracy
      </badge>`;
  } else {
    accuracyBadge.innerHTML = "";
  }

  // Null handling on question ans part
  if (data.input_output_examples === null) {
    document.getElementById("question").innerText = "NO Question Found";
    document.getElementById("ans").innerText = "";
  } else {
    if (data.input_output_examples[0].input) {
      document.getElementById("question").innerText = data?.input_output_examples[0]?.input;
      if (data.input_output_examples[0].output) {
        document.getElementById("ans").innerText = data?.input_output_examples[0]?.output;
      } else {
        document.getElementById("ans").innerText = "No! Not Yet! Take a break!!!";
      }
    } else {
      document.getElementById("question").innerText = "No Question is Available!!!";
    }
  }
  toggleSpinner(false, "modal-spinner");
};
// spinner Handler
const toggleSpinner = (isLoading, id) => {
  const spinner = document.getElementById(id);
  if (isLoading) {
    spinner.style.display = "block";
  } else {
    spinner.style.display = "none";
  }
};

loadData();
