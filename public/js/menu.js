document.addEventListener("DOMContentLoaded", function () {
  var scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: "#categories-list",
  });


  var firstScrollSpyEl = document.querySelector('[data-bs-spy="scroll"]');
  firstScrollSpyEl.addEventListener("activate.bs.scrollspy", function (event) {
    var activeLink = event.relatedTarget;
    var scrollmenu = document.getElementById("categories-list");
    var scrollmenuWidth = scrollmenu.offsetWidth;
    var activeLinkWidth = activeLink.offsetWidth;
    var activeLinkOffsetLeft = activeLink.offsetLeft;

    // Calculate the scroll position to center the active link
    var scrollPosition =
      activeLinkOffsetLeft - scrollmenuWidth / 2 + activeLinkWidth / 2;

    /*// Ensure the scroll position doesn't exceed the scrollable range
    var maxScrollPosition = scrollmenu.scrollWidth - scrollmenuWidth;
    if (scrollPosition > maxScrollPosition) {
      scrollPosition = maxScrollPosition;
    }
    if (scrollPosition < 0) {
      scrollPosition = 0;
    }*/

      var maxScrollPosition = scrollmenu.scrollWidth - scrollmenuWidth;
      scrollPosition = Math.max(0, Math.min(scrollPosition, maxScrollPosition));

    scrollmenu.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  });

  // Add click event listener to the nav-links for smooth scroll
  var navLinks = document.querySelectorAll("#categories-list .nav-link");
  navLinks.forEach(function (navLink) {
    navLink.addEventListener("click", function (event) {
      event.preventDefault();
      var targetId = this.getAttribute("href").substring(1);
      var targetElement = document.getElementById(targetId);
      var offsetTop = targetElement.offsetTop;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    });
  });
});

// JavaScript to handle the modal
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

function openModal(name, price, description, image, allergies, foodType) {
  document.getElementById("modalItemName").innerText = name;
  document.getElementById("modalPrice").innerText = price;
  document.getElementById("modalDescription").innerText = description;
  document.getElementById("modalImage").src = image;

  if (allergies) {
    document.getElementById("modalAllergy").innerText = allergies;
  } else {
    document.getElementById("modalAllergy").innerText = "";
  }

  var foodTypeImage = "";
  if (foodType === "Vegan") {
    foodTypeImage = "/img/vegan.jpg";
  } else if (foodType === "Vegetarian") {
    foodTypeImage = "/img/vegetarian.jpg";
  } else {
    foodTypeImage = ""; // No image for other types
  }
  document.getElementById("modalFoodTypeImage").src = foodTypeImage;

  modal.style.display = "block";
  document.body.classList.add("modal-open");
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
  }
};

