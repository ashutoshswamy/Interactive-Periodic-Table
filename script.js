document.addEventListener("DOMContentLoaded", () => {
  const periodicTable = document.getElementById("periodic-table");
  const elementDetails = document.getElementById("element-details");
  const legendItemsContainer = document.getElementById("legend-items"); // Get legend container

  // Fetch the element data from the JSON file
  fetch("elements.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((elements) => {
      // Render the periodic table
      elements.forEach((element) => {
        const elementDiv = document.createElement("div");
        elementDiv.classList.add("element");
        // Add category class for styling - replace spaces with hyphens
        const categoryClass = element.category
          .replace(/\s+/g, "-")
          .toLowerCase();
        elementDiv.classList.add(categoryClass);

        // Set grid position using inline styles from JSON data
        elementDiv.style.gridColumn = element.xpos;
        elementDiv.style.gridRow = element.ypos;

        // Add data attributes to easily retrieve element info on click
        elementDiv.dataset.number = element.number;

        // Create the content inside the element box
        elementDiv.innerHTML = `
                    <div class="atomic-number">${element.number}</div>
                    <div class="symbol">${element.symbol}</div>
                    <div class="name">${element.name}</div>
                `;

        // Add click event listener
        elementDiv.addEventListener("click", () => {
          displayElementDetails(element);
        });

        periodicTable.appendChild(elementDiv);
      });

      // After rendering elements, build the legend
      buildLegend(elements);
    })
    .catch((error) => {
      console.error("Error fetching elements:", error);
      periodicTable.innerHTML = "<p>Error loading periodic table data.</p>";
      elementDetails.innerHTML =
        "<h2>Element Details</h2><p>Could not load element data.</p>";
    });

  // Function to display details of a selected element
  function displayElementDetails(element) {
    elementDetails.innerHTML = `
            <h2>${element.name} (${element.symbol})</h2>
            <p><strong>Atomic Number:</strong> ${element.number}</p>
            <p><strong>Atomic Mass:</strong> ${
              element.mass ? element.mass.toFixed(4) : "N/A"
            }</p>
            <p><strong>Category:</strong> ${element.category.replace(
              /-/g,
              " "
            )}</p>
            ${
              element.description
                ? `<p><strong>Description:</strong> ${element.description}</p>`
                : ""
            }
            <!-- Add more details here if available in JSON -->
        `;
  }

  // Function to build the legend dynamically
  function buildLegend(elements) {
    // Get unique categories using a Set
    const categories = new Set(elements.map((element) => element.category));

    // Clear existing legend items (if any)
    legendItemsContainer.innerHTML = "";

    // Create a legend item for each unique category
    categories.forEach((category) => {
      const legendItemDiv = document.createElement("div");
      legendItemDiv.classList.add("legend-item");

      const colorSwatchSpan = document.createElement("span");
      colorSwatchSpan.classList.add("legend-color-swatch");
      // Add the category class to the swatch to apply the color
      const categoryClass = category.replace(/\s+/g, "-").toLowerCase();
      colorSwatchSpan.classList.add(categoryClass);

      const legendTextSpan = document.createElement("span");
      legendTextSpan.classList.add("legend-text");
      // Display the category name nicely (replace hyphens with spaces, capitalize first letter)
      const displayCategoryName = category.replace(/-/g, " "); // Replace hyphens with spaces
      // Optional: Capitalize the first letter of each word
      // .split(' ')
      // .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      // .join(' ');
      legendTextSpan.textContent = displayCategoryName;

      legendItemDiv.appendChild(colorSwatchSpan);
      legendItemDiv.appendChild(legendTextSpan);

      legendItemsContainer.appendChild(legendItemDiv);
    });
  }
});
