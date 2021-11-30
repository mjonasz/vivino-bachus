import debounce from "lodash/debounce";
import get from "lodash/get";
import getRating from "./api/getRating";

function initializeScript() {
  appendRatings();
  window.addEventListener("scroll", debounce(appendRatings, 1000));
}

function appendRatings() {
  const wineListItems = document.querySelectorAll(
    'h2.product-title a[href*="/"]'
  );

  wineListItems.forEach((item) => {
    if (!item.parentNode.style.position) {
      appendRating(item);
    }
  });
}

async function appendRating(element) {
  element.parentElement.style.position = "relative";
  const wineName = element.innerText;

  if (!wineName) {
    return;
  }

  try {
    const { score, numOfReviews, url } = await getRating(wineName);

    const priceElement = document.createElement("a");
    priceElement.href = url;
    priceElement.innerText = `Score: ${score} (${numOfReviews} reviews)`;
    priceElement.style.position = "relative";
    priceElement.style.bottom = "5px";
    priceElement.style.color = "blue";

    element.parentElement.parentElement.appendChild(priceElement);
  } catch (e) {
    console.error(`${wineName} is not found on Vivino`);
  }
}

window.addEventListener("load", initializeScript);
