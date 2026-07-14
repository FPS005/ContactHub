var imgInp = document.querySelector("#imgInp");
var fullNameInp = document.querySelector("#fullNameInp");
var phoneNumberInp = document.querySelector("#phoneNumberInp");
var emailInp = document.querySelector("#emailInp");
var addressInp = document.querySelector("#addressInp");
var groupInp = document.querySelector("#groupInp");
var notesInp = document.querySelector("#notesInp");
var favoriteCheckbox = document.querySelector("#favoriteCheckbox");
var emergencyCheckbox = document.querySelector("#emergencyCheckbox");

var contactsList = [];
var favoritesList = [];
var emergencyList = [];

var contactsContainer = document.querySelector(".contactsContainer");
var favoritesContainer = document.querySelectorAll(".favoritesContainer");
var emergencyContainer = document.querySelectorAll(".emergencyContainer");

var saveBtn = document.querySelector("#saveBtn");
var editBtn = document.querySelector("#editBtn");

if (localStorage.getItem("contactsList") == null) {
  contactsList = [];
} else {
  contactsList = JSON.parse(localStorage.getItem("contactsList"));
  printContactsInMainContainer();
  addContactsInFavoritesList();
  addContactsInEmergencyList();
  printEmergencyContactsInEmergencyContainer();
  printFavoriteContactsInFavoriteContainer();
}
// main function
function saveInputsValue() {
  if (
    fullNameInp.classList.contains("is-valid") &&
    phoneNumberInp.classList.contains("is-valid") &&
    emailInp.classList.contains("is-valid")
  ) {
    var contact = {
      img: imgInp.value,
      fullName: fullNameInp.value,
      phoneNUmber: phoneNumberInp.value,
      email: emailInp.value,
      address: addressInp.value,
      group: groupInp.value,
      note: notesInp.value,
      favorite: favoriteCheckbox.checked,
      emergency: emergencyCheckbox.checked,
    };
    contactsList.push(contact);
    clearInputs();
    removeValidateClassFromInputs();

    Swal.fire({
      title: "Added!",
      text: "Contact has been added successfully.",
      icon: "success",
      draggable: true,
      timer: 1500,
    });
    var modalElement = document.querySelector("#staticBackdrop");
    var modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    localStorage.setItem("contactsList", JSON.stringify(contactsList));
  } else {
    missingMassageOnSaveInput();
  }
  printContactsInMainContainer();
  totalContacts();
  addContactsInFavoritesList();
  addContactsInEmergencyList();
  printFavoriteContactsInFavoriteContainer();
  printEmergencyContactsInEmergencyContainer();
  favoritesContactsNumber();
  emergencyContactsNumber();
  removeEmptyMassage();
  favoriteIconToggle();
  toggleEmergencyIcon();
}

function addContactsInFavoritesList() {
  favoritesList = [];
  for (var j = 0; j < contactsList.length; j++) {
    if (contactsList[j].favorite === true) {
      var FavoriteContact = {
        img: contactsList[j].img,
        fullName: contactsList[j].fullName,
        phoneNUmber: contactsList[j].phoneNUmber,
      };
      favoritesList.push(FavoriteContact);
    }
  }
}

function addContactsInEmergencyList() {
  emergencyList = [];
  for (var j = 0; j < contactsList.length; j++) {
    if (contactsList[j].emergency === true) {
      var EmergencyContact = {
        img: contactsList[j].img,
        fullName: contactsList[j].fullName,
        phoneNUmber: contactsList[j].phoneNUmber,
      };
      emergencyList.push(EmergencyContact);
    }
  }
}

function clearInputs() {
  imgInp.value = null;
  fullNameInp.value = null;
  phoneNumberInp.value = null;
  emailInp.value = null;
  addressInp.value = null;
  groupInp.value = null;
  notesInp.value = null;
  favoriteCheckbox.checked = false;
  emergencyCheckbox.checked = false;
}

function removeValidateClassFromInputs() {
  fullNameInp.classList.remove("is-valid");
  phoneNumberInp.classList.remove("is-valid");
  emailInp.classList.remove("is-valid");
}

// validation name input
fullNameInp.addEventListener("input", validateNameInput);
function validateNameInput(e) {
  var nameRegex = /^[A-Za-z][A-Za-z ]{1,30}$/i;
  var result = nameRegex.test(fullNameInp.value);
  var nameError = document.querySelector(".nameError");

  if (result === true) {
    nameError.classList.add("d-none");
    e.target.classList.remove("border-red");
    e.target.classList.add("is-valid");
  } else {
    e.target.classList.remove("is-valid");
    e.target.classList.add("border-red");
    nameError.classList.remove("d-none");
  }
}

// validation phone number input
phoneNumberInp.addEventListener("input", validatePhoneNumber);
function validatePhoneNumber(e) {
  var nameRegex = /^(\+20|20|0)1(0|1|2|5)[0-9]{8}$/;
  var result = nameRegex.test(phoneNumberInp.value);
  var phoneNumberError = document.querySelector(".phoneNumberError");
  if (result === true) {
    phoneNumberError.classList.add("d-none");
    e.target.classList.remove("border-red");
    e.target.classList.add("is-valid");
  } else {
    e.target.classList.remove("is-valid");
    e.target.classList.add("border-red");
    phoneNumberError.classList.remove("d-none");
  }
}

// validation email input
emailInp.addEventListener("input", validateEmail);
function validateEmail(e) {
  var regex = /^\w{3,20}@(gmail|yahoo).com$/i;
  var result = regex.test(emailInp.value);
  var emailError = document.querySelector(".emailError");
  if (result === true) {
    emailError.classList.add("d-none");
    e.target.classList.remove("border-red");
    e.target.classList.add("is-valid");
  } else {
    e.target.classList.remove("is-valid");
    e.target.classList.add("border-red");
    emailError.classList.remove("d-none");
  }
}

function missingMassageOnSaveInput() {
  var title;
  var text;
  if (!fullNameInp.classList.contains("is-valid")) {
    title = "Missing Name";
    text = "Please enter a name for the contact!";
  } else if (!phoneNumberInp.classList.contains("is-valid")) {
    title = "Invalid Phone";
    text =
      "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)";
  } else {
    title = "Invalid Email";
    text = "Please enter a valid email address";
  }

  Swal.fire({
    icon: "error",
    title: title,
    text: text,
  });
}

function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
}

var contactCards;
function printContactsInMainContainer() {
  contactCards = ``;
  for (var i = 0; i < contactsList.length; i++) {
    var groupContainer = ``;
    if (contactsList[i].group == "other") {
      groupContainer = ` <div
          style="width: fit-content; background-color: #F3F4F6; color: #333"
          class="p-1 rounded-2 fs-12 fw-medium"
        >
          <p>${contactsList[i].group}</p>
        </div>`;
    } else if (contactsList[i].group == "family") {
      groupContainer = `<div
          style="width: fit-content; background-color: #dbeafe; color: #1447e6"
          class="p-1 rounded-2 fs-12 fw-medium"
        >
          <p>Family</p>
        </div>`;
    } else if (contactsList[i].group == "friends") {
      groupContainer = ` <div
          style="width: fit-content; background-color: #dbfce7; color: #008235"
          class="p-1 rounded-2 fs-12 fw-medium"
        >
          <p>${contactsList[i].group}</p>
        </div>`;
    } else if (contactsList[i].group == "work") {
      groupContainer = `<div
          style="width: fit-content; background-color: #f3e8ff; color: #8200db"
          class="p-1 rounded-2 fs-12 fw-medium"
        >
          <p>${contactsList[i].group}</p>
        </div>`;
    } else if (contactsList[i].group == "school") {
      groupContainer = `<div
          style="width: fit-content; background-color: #fef3c6; color: #bb4d00"
          class="p-1 rounded-2 fs-12 fw-medium"
        >
          <p>${contactsList[i].group}</p>
        </div>`;
    } else {
      groupContainer = ``;
    }

    contactCards += `
    
                      <div>
  <div class="contact-card bg-white rounded-4 main-box-shadow overflow-hidden">
    <div class="d-flex gap-3 px-3 pt-3">
      <div
        class="position-relative purple-linear-gradient rounded-4 text-white d-flex justify-content-center align-items-center"
        style="width: 56px; height: 56px"
      >
        <img class="rounded-4 d-none" src="image/avatar-2.jpg" alt="image" />
        <p class="fs-4 fw-medium">${getInitials(contactsList[i].fullName)}</p>
        <div
          class="emergencyPopup d-none justify-content-center align-items-center bg-danger position-absolute rounded-circle fs-8 border-solid border-white bottom-0 end-0"
          style="width: 20px; height: 20px; transform: translateX(5px)"
        >
          <i class="fa-solid fa-heart-pulse"></i>
        </div>
        <div
          class="favorite-star-popup d-none justify-content-center align-items-center bg-warning position-absolute rounded-circle fs-8 border-solid border-white top-0 end-0"
          style="width: 20px; height: 20px; transform: translateX(5px)"
        >
          <i class="fa-solid fa-star"></i>
        </div>
      </div>
      <div>
        <p class="mb-1 fw-bold">${contactsList[i].fullName}</p>
        <div class="d-flex gap-1">
          <div
            class="rounded-3 me-1 d-flex fs-12 justify-content-center align-items-center"
            style="
              background-color: #dbeafe;
              width: 24px;
              height: 24px;
              color: #155dfc;
            "
          >
            <i class="fa-solid fa-phone"></i>
          </div>
          <span class="fs-14 gray-color">${contactsList[i].phoneNUmber}</span>
        </div>
      </div>
    </div>
    <div class="mt-3 d-flex flex-column gap-2 px-3">
      <div class="d-flex gap-1 align-items-center">
        <div
          class="d-flex justify-content-center align-items-center rounded-2 me-1 fs-12"
          style="
            width: 28px;
            height: 28px;
            background-color: #ede9fe;
            color: #7f22fe;
          "
        >
          <i class="fa-solid fa-envelope"></i>
        </div>
        <p class="fs-14 gray-color">${contactsList[i].email}</p>
      </div>
      <div class="d-flex gap-1 align-items-center">
        <div
          class="d-flex justify-content-center align-items-center rounded-2 me-1 fs-12"
          style="
            width: 28px;
            height: 28px;
            background-color: #d0fae5;
            color: #009966;
          "
        >
          <i class="fa-solid fa-location-dot"></i>
        </div>
        <p class="fs-14 gray-color">${contactsList[i].address}</p>
      </div>
    </div>
     <div class="py-2 px-3 d-flex gap-2">
      ${groupContainer}
      <div
  style="width: fit-content; background-color: #FFF1F2; color: oklch(0.586 0.253 17.585)"
  class="d-none Emergency-tag gap-2 align-items-center py-1 px-1 rounded-2 fs-12 fw-medium "
>
  <i class="fa-solid fa-heart-pulse"></i>
  <p>Emergency</p>
</div>
      </div>
    <div
      class="mt-2 px-3 py-2 d-flex justify-content-between"
      style="background-color: #fafbfc; border-top: 1px solid #00000010"
    >
      <div class="d-flex gap-2">
        <a
          href="tel:${contactsList[i].phoneNUmber}"
          class="call-link fs-12 d-flex justify-content-center align-items-center rounded-3"
        >
          <i class="fa-solid fa-phone"></i>
        </a>
        <a
          href="mailto:${contactsList[i].email}"
          class="mail-link fs-12 d-flex justify-content-center align-items-center rounded-3"
        >
          <i class="fa-solid fa-envelope"></i>
        </a>
      </div>
      <div class="d-flex gap-1">
        <button
          onclick="toggleFavorite(${i})"
          class="Favorite-btn rounded-2 btn d-flex justify-content-center align-items-center border-0"
          style="width: 36px; height: 36px"
        >
          <i class="fa-regular fa-star star-icon"></i>
        </button>
        <button
          onclick="toggleEmergency(${i})"
          class="Emergency-btn rounded-2 btn d-flex justify-content-center align-items-center border-0"
          style="width: 36px; height: 36px"
        >
          <i class="fa-regular fa-heart emergency-icon"></i>
        </button>
        <button
        
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          onclick="editContact(${i})"
          class="edit-btn rounded-2 btn d-flex justify-content-center align-items-center border-0"
          style="width: 36px; height: 36px"
        >
          <i class="fa-solid fa-pen"></i>
        </button>
        <button
          
          class="trash-btn rounded-2 btn d-flex justify-content-center align-items-center border-0"
          onclick="deleteContact(${i})"
          style="width: 36px; height: 36px"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</div>
`;
  }
  contactsContainer.innerHTML = contactCards;
}

var favoriteContacts;
function printFavoriteContactsInFavoriteContainer() {
  favoriteContacts = ``;
  for (var i = 0; i < favoritesList.length; i++) {
    favoriteContacts += `
    <div><div
                        class="d-flex justify-content-between align-items-center p-2 Favorite-card"
                      >
                        <div class="d-flex gap-2 align-items-center">
                          <div
                            class="purple-linear-gradient d-flex justify-content-center align-items-center rounded-3"
                            style="width: 40px; height: 40px"
                          >
                            <p class="fw-medium text-white">MM</p>
                          </div>
                          <div class="fs-12">
                            <p class="fw-medium">${favoritesList[i].fullName}</p>
                            <span class="gray-color fw-medium"
                              >${favoritesList[i].phoneNUmber}</span
                            >
                          </div>
                        </div>
                        <a class="call-icon" href="tel:${favoritesList[i].phoneNUmber}">
                          <i class="fa-solid fa-phone"></i>
                        </a>
                      </div></div>`;
  }
  for (var k = 0; k < favoritesContainer.length; k++) {
    favoritesContainer[k].innerHTML = favoriteContacts;
  }
}

var emergencyContacts;
function printEmergencyContactsInEmergencyContainer() {
  emergencyContacts = ``;
  for (var i = 0; i < emergencyList.length; i++) {
    emergencyContacts += `<div> <div
                        class="d-flex justify-content-between align-items-center p-2 Emergency-card"
                      >
                        <div class="d-flex gap-2 align-items-center">
                          <div
                            class="purple-linear-gradient d-flex justify-content-center align-items-center rounded-3"
                            style="width: 40px; height: 40px"
                          >
                            <p class="fw-medium text-white">MM</p>
                          </div>
                          <div class="fs-12">
                            <p class="fw-medium">${emergencyList[i].fullName}</p>
                            <span class="gray-color fw-medium"
                              >${emergencyList[i].phoneNUmber}</span
                            >
                          </div>
                        </div>
                        <a class="call-icon">
                          <i class="fa-solid fa-phone"></i>
                        </a>
                      </div></div>`;
  }
  for (var k = 0; k < emergencyContainer.length; k++) {
    emergencyContainer[k].innerHTML = emergencyContacts;
  }
}

function totalContacts() {
  var totalContacts = document.querySelector("#total");

  totalContacts.innerHTML = contactsList.length;
}

function favoritesContactsNumber() {
  var favoritesContactsNumber = document.querySelector("#Favorites");
  favoritesContactsNumber.innerHTML = favoritesList.length;
}

function emergencyContactsNumber() {
  var emergencyContactsNumber = document.querySelector("#Emergency");
  emergencyContactsNumber.innerHTML = emergencyList.length;
}

var form = document.querySelector("form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
});

function removeEmptyMassage() {
  var mainContactContainer = document.querySelector(".mainContactContainer");
  if (contactsList.length === 0) {
    mainContactContainer.classList.remove("d-none");
  } else {
    mainContactContainer.classList.add("d-none");
  }

  var favoriteEmptyMassage = document.querySelectorAll(".favoriteEmptyMassage");
  if (favoritesList.length == 0) {
    for (var k = 0; k < favoriteEmptyMassage.length; k++) {
      favoriteEmptyMassage[k].classList.remove("d-none");
    }
  } else {
    for (var k = 0; k < favoriteEmptyMassage.length; k++) {
      favoriteEmptyMassage[k].classList.add("d-none");
    }
  }

  var emergencyEmptyMassage = document.querySelectorAll(
    ".emergencyEmptyMassage",
  );
  if (emergencyList.length == 0) {
    for (var k = 0; k < emergencyEmptyMassage.length; k++) {
      emergencyEmptyMassage[k].classList.remove("d-none");
    }
  } else {
    for (var k = 0; k < emergencyEmptyMassage.length; k++) {
      emergencyEmptyMassage[k].classList.add("d-none");
    }
  }
}

var cancelBtn = document.querySelector("#cancelbtn");
cancelbtn.addEventListener("click", clearInputs);

function deleteContact(deletedIndex) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });

      contactsList.splice(deletedIndex, 1);
      console.log(contactsList);
      addContactsInFavoritesList();
      addContactsInEmergencyList();
      printContactsInMainContainer();
      printFavoriteContactsInFavoriteContainer();
      printEmergencyContactsInEmergencyContainer();
      totalContacts();
      favoritesContactsNumber();
      emergencyContactsNumber();
      removeEmptyMassage();
      favoriteIconToggle();
      toggleEmergencyIcon();
      localStorage.setItem("contactsList", JSON.stringify(contactsList));
    }
  });
}

function toggleFavorite(selectedIndex) {
  contactsList[selectedIndex].favorite = !contactsList[selectedIndex].favorite;

  addContactsInFavoritesList();
  addContactsInEmergencyList();
  printContactsInMainContainer();
  printFavoriteContactsInFavoriteContainer();
  printEmergencyContactsInEmergencyContainer();
  totalContacts();
  favoritesContactsNumber();
  emergencyContactsNumber();
  removeEmptyMassage();
  favoriteIconToggle();
  toggleEmergencyIcon();
  localStorage.setItem("contactsList", JSON.stringify(contactsList));
}

function favoriteIconToggle() {
  var favoriteIcons = document.querySelectorAll(".star-icon");
  var favoriteStarPopups = document.querySelectorAll(".favorite-star-popup");

  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].favorite === true) {
      favoriteIcons[i].classList.remove("fa-regular");
      favoriteIcons[i].classList.add("fa-solid", "text-warning");
    } else {
      favoriteIcons[i].classList.remove("fa-solid", "text-warning");
      favoriteIcons[i].classList.add("fa-regular");
    }

    if (contactsList[i].favorite === true) {
      favoriteStarPopups[i].classList.remove("d-none");
      favoriteStarPopups[i].classList.add("d-flex");
    } else {
      favoriteStarPopups[i].classList.remove("d-flex");
      favoriteStarPopups[i].classList.add("d-none");
    }
  }
}

function toggleEmergency(selectedIndex) {
  contactsList[selectedIndex].emergency =
    !contactsList[selectedIndex].emergency;

  addContactsInFavoritesList();
  addContactsInEmergencyList();
  printContactsInMainContainer();
  printFavoriteContactsInFavoriteContainer();
  printEmergencyContactsInEmergencyContainer();
  totalContacts();
  favoritesContactsNumber();
  emergencyContactsNumber();
  removeEmptyMassage();
  toggleEmergencyIcon();
  favoriteIconToggle();
  localStorage.setItem("contactsList", JSON.stringify(contactsList));
}

function toggleEmergencyIcon() {
  var emergencyIcon = document.querySelectorAll(".emergency-icon");
  var emergencyPopup = document.querySelectorAll(".emergencyPopup");
  var EmergencyTag = document.querySelectorAll(".Emergency-tag");
  for (var i = 0; i < contactsList.length; i++) {
    if (contactsList[i].emergency === true) {
      emergencyIcon[i].classList.remove("fa-heart");
      emergencyIcon[i].classList.remove("fa-regular");
      emergencyIcon[i].classList.add("fa-solid");
      emergencyIcon[i].classList.add("fa-heart-pulse");
      emergencyIcon[i].classList.add("text-danger");
      EmergencyTag[i].classList.add("d-flex");
      EmergencyTag[i].classList.remove("d-none");
    } else {
      EmergencyTag[i].classList.remove("d-flex");
      EmergencyTag[i].classList.add("d-none");
      emergencyIcon[i].classList.add("fa-heart");
      emergencyIcon[i].classList.add("fa-regular");
      emergencyIcon[i].classList.remove("fa-solid");
      emergencyIcon[i].classList.remove("fa-heart-pulse");
      emergencyIcon[i].classList.remove("text-danger");
    }

    if (contactsList[i].emergency === true) {
      emergencyPopup[i].classList.add("d-flex");
      emergencyPopup[i].classList.remove("d-none");
    } else {
      emergencyPopup[i].classList.add("d-none");
      emergencyPopup[i].classList.remove("d-flex");
    }
  }
}

saveBtn.addEventListener("click", saveInputsValue);
totalContacts();
favoritesContactsNumber();
emergencyContactsNumber();
removeEmptyMassage();
favoriteIconToggle();
toggleEmergencyIcon();

var searchInp = document.querySelector("#search");
searchInp.addEventListener("input", search);
function search() {
  var searchWord = searchInp.value;
  contactCards = ``;
  var mainContactContainer = document.querySelector(".mainContactContainer");
  for (var i = 0; i < contactsList.length; i++) {
    if (
      contactsList[i].fullName.toLowerCase().includes(searchWord.toLowerCase())
    ) {
      var groupContainer = ``;
      if (contactsList[i].group == "other") {
        groupContainer = ` <div
          style="width: fit-content; background-color: #F3F4F6; color: #333"
          class="p-1 rounded-2 fs-12 fw-medium"
        >
          <p>${contactsList[i].group}</p>
        </div>`;
      } else if (contactsList[i].group == "family") {
        groupContainer = `<div
          style="width: fit-content; background-color: #dbeafe; color: #1447e6"
          class="p-1 rounded-2 fs-12 fw-medium"
        >
          <p>Family</p>
        </div>`;
      } else if (contactsList[i].group == "friends") {
        groupContainer = ` <div
          style="width: fit-content; background-color: #dbfce7; color: #008235"
          class="p-1 rounded-2 fs-12 fw-medium"
        >
          <p>${contactsList[i].group}</p>
        </div>`;
      } else if (contactsList[i].group == "work") {
        groupContainer = `<div
          style="width: fit-content; background-color: #f3e8ff; color: #8200db"
          class="p-1 rounded-2 fs-12 fw-medium"
        >
          <p>${contactsList[i].group}</p>
        </div>`;
      } else if (contactsList[i].group == "school") {
        groupContainer = `<div
          style="width: fit-content; background-color: #fef3c6; color: #bb4d00"
          class="p-1 rounded-2 fs-12 fw-medium"
        >
          <p>${contactsList[i].group}</p>
        </div>`;
      } else {
        groupContainer = ``;
      }
      contactCards += `
    
                      <div>
  <div class="contact-card bg-white rounded-4 main-box-shadow overflow-hidden">
    <div class="d-flex gap-3 px-3 pt-3">
      <div
        class="position-relative purple-linear-gradient rounded-4 text-white d-flex justify-content-center align-items-center"
        style="width: 56px; height: 56px"
      >
        <img class="rounded-4 d-none" src="image/avatar-2.jpg" alt="image" />
        <p class="fs-4 fw-medium">${getInitials(contactsList[i].fullName)}</p>
        <div
          class="emergencyPopup d-none justify-content-center align-items-center bg-danger position-absolute rounded-circle fs-8 border-solid border-white bottom-0 end-0"
          style="width: 20px; height: 20px; transform: translateX(5px)"
        >
          <i class="fa-solid fa-heart-pulse"></i>
        </div>
        <div
          class="favorite-star-popup d-none justify-content-center align-items-center bg-warning position-absolute rounded-circle fs-8 border-solid border-white top-0 end-0"
          style="width: 20px; height: 20px; transform: translateX(5px)"
        >
          <i class="fa-solid fa-star"></i>
        </div>
      </div>
      <div>
        <p class="mb-1 fw-bold">${contactsList[i].fullName}</p>
        <div class="d-flex gap-1">
          <div
            class="rounded-3 me-1 d-flex fs-12 justify-content-center align-items-center"
            style="
              background-color: #dbeafe;
              width: 24px;
              height: 24px;
              color: #155dfc;
            "
          >
            <i class="fa-solid fa-phone"></i>
          </div>
          <span class="fs-14 gray-color">${contactsList[i].phoneNUmber}</span>
        </div>
      </div>
    </div>
    <div class="mt-3 d-flex flex-column gap-2 px-3">
      <div class="d-flex gap-1 align-items-center">
        <div
          class="d-flex justify-content-center align-items-center rounded-2 me-1 fs-12"
          style="
            width: 28px;
            height: 28px;
            background-color: #ede9fe;
            color: #7f22fe;
          "
        >
          <i class="fa-solid fa-envelope"></i>
        </div>
        <p class="fs-14 gray-color">${contactsList[i].email}</p>
      </div>
      <div class="d-flex gap-1 align-items-center">
        <div
          class="d-flex justify-content-center align-items-center rounded-2 me-1 fs-12"
          style="
            width: 28px;
            height: 28px;
            background-color: #d0fae5;
            color: #009966;
          "
        >
          <i class="fa-solid fa-location-dot"></i>
        </div>
        <p class="fs-14 gray-color">${contactsList[i].address}</p>
      </div>
    </div>
     <div class="py-2 px-3 d-flex gap-2">
      ${groupContainer}
      <div
  style="width: fit-content; background-color: #FFF1F2; color: oklch(0.586 0.253 17.585)"
  class="d-none Emergency-tag gap-2 align-items-center py-1 px-1 rounded-2 fs-12 fw-medium "
>
  <i class="fa-solid fa-heart-pulse"></i>
  <p>Emergency</p>
</div>
      </div>
    <div
      class="mt-2 px-3 py-2 d-flex justify-content-between"
      style="background-color: #fafbfc; border-top: 1px solid #00000010"
    >
      <div class="d-flex gap-2">
        <a
          href="tel:${contactsList[i].phoneNUmber}"
          class="call-link fs-12 d-flex justify-content-center align-items-center rounded-3"
        >
          <i class="fa-solid fa-phone"></i>
        </a>
        <a
          href="mailto:${contactsList[i].email}"
          class="mail-link fs-12 d-flex justify-content-center align-items-center rounded-3"
        >
          <i class="fa-solid fa-envelope"></i>
        </a>
      </div>
      <div class="d-flex gap-1">
        <button
          onclick="toggleFavorite(${i})"
          class="Favorite-btn rounded-2 btn d-flex justify-content-center align-items-center border-0"
          style="width: 36px; height: 36px"
        >
          <i class="fa-regular fa-star star-icon"></i>
        </button>
        <button
          onclick="toggleEmergency(${i})"
          class="Emergency-btn rounded-2 btn d-flex justify-content-center align-items-center border-0"
          style="width: 36px; height: 36px"
        >
          <i class="fa-regular fa-heart emergency-icon"></i>
        </button>
        <button
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          onclick="editContact(${i})"
          class="edit-btn rounded-2 btn d-flex justify-content-center align-items-center border-0"
          style="width: 36px; height: 36px"
        >
          <i class="fa-solid fa-pen"></i>
        </button>
        <button
          
          class="trash-btn rounded-2 btn d-flex justify-content-center align-items-center border-0"
          onclick="deleteContact(${i})"
          style="width: 36px; height: 36px"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</div>
`;
      mainContactContainer.classList.add("d-none");
    } else {
      mainContactContainer.classList.remove("d-none");
    }
  }

  contactsContainer.innerHTML = contactCards;
  favoriteIconToggle();
  toggleEmergencyIcon();
}

var index;
function editContact(contactIndex) {
  index = contactIndex;
  fullNameInp.value = contactsList[contactIndex].fullName;
  phoneNumberInp.value = contactsList[contactIndex].phoneNUmber;
  emailInp.value = contactsList[contactIndex].email;
  addressInp.value = contactsList[contactIndex].address;
  groupInp.value = contactsList[contactIndex].group;
  favoriteCheckbox.checked = contactsList[contactIndex].favoriteCheckbox;
  emergencyCheckbox.checked = contactsList[contactIndex].emergencyCheckbox;

  editBtn.classList.add("d-block");
  editBtn.classList.remove("d-none");
  saveBtn.classList.add("d-none");
}

editBtn.addEventListener("click", update);
function update() {
  contactsList[index].fullName = fullNameInp.value;
  contactsList[index].phoneNUmber = phoneNumberInp.value;
  contactsList[index].email = emailInp.value;
  contactsList[index].address = addressInp.value;
  contactsList[index].group = groupInp.value;
  contactsList[index].favoriteCheckbox = favoriteCheckbox.checked;
  contactsList[index].emergencyCheckbox = emergencyCheckbox.checked;

  editBtn.classList.remove("d-block");
  editBtn.classList.add("d-none");
  saveBtn.classList.remove("d-none");

  printContactsInMainContainer();

  favoriteIconToggle();
  toggleEmergencyIcon();
  localStorage.setItem("contactsList", JSON.stringify(contactsList));
  var modalElement = document.querySelector("#staticBackdrop");
  var modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide();
  Swal.fire({
    title: "Added!",
    text: "Contact has been added successfully.",
    icon: "success",
    draggable: true,
    timer: 1500,
  });
}
