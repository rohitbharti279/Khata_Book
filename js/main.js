// Get values from input fields
const nameInput = document.getElementById("name");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const borrowForm = document.getElementById("borrowForm");
const borrowList = document.getElementById("borrowList");
const saveButton = document.getElementById("save-button");
const addButton = document.getElementById("edit-button");

// For first entry - empty array or retrieve data from local storage
const borrowRecords = JSON.parse(localStorage.getItem("borrowRecords")) || [];
let flag = 0;

// Function to add a borrowing record
function addBorrowing(event) {
  event.preventDefault();

  const customerName = nameInput.value.trim();
  const amount = amountInput.value.trim();
  const date = dateInput.value.trim();

  // Check if name already exists
  const existingRecord = borrowRecords.find(
    (record) => record.customerName.toLowerCase() === customerName.toLowerCase()
  );
  if (existingRecord) {
    alert("Name already exists...");
    return;
  } else if (!customerName || !amount || amount <= 0 || !date) {
    alert("Please enter a proper name and a proper amount.");
  } else {
    const id = new Date().getTime(); //Generate random number
    // Add record to the array
    borrowRecords.push({ customerName, amount, id, date });

    // Update borrowing list display status or show function
    updateBorrowingList();

    // Save borrowRecords array to local storage
    localStorage.setItem("borrowRecords", JSON.stringify(borrowRecords));
  }

  // Clear input fields when you click on add button
  nameInput.value = "";
  amountInput.value = "";
  dateInput.value = "";
}

// Function to update borrowing list display
function updateBorrowingList() {
  let totalAmount = 0;
  borrowList.innerHTML = "";
  nameInput.value = "";
  amountInput.value = "";
  nameInput.removeAttribute("readonly", true);

  saveButton.classList.remove("hidden");
  addButton.classList.add("hidden");

  borrowRecords.forEach((record) => {
    const listItem = document.createElement("li");
    const nameSpan = document.createElement("span");
    const amountSpan = document.createElement("span");
    const dateSpan = document.createElement("span");
    const removeButton = document.createElement("button");
    const updateButton = document.createElement("button");

    nameSpan.innerText = "🧍" + "Name:" + " " + record.customerName + " ";
    amountSpan.innerText = " " + "💵💰" + " " + "Amount:" + " " + "₹" + record.amount;
    dateSpan.innerText = " " + "📅" + " " + "Date:" + " " + record.date;

    listItem.setAttribute("data-id", record.id);

    removeButton.innerText = "Remove";
    removeButton.style.padding = "2px";
    removeButton.style.marginLeft = "1rem";
    removeButton.style.color = "red";
    removeButton.addEventListener("click", removeData);

    updateButton.innerText = "Update";
    updateButton.style.padding = "2px";
    updateButton.style.marginLeft = "1rem";
    updateButton.style.color = "green";
    updateButton.addEventListener("click", updateBorrowing);

    listItem.appendChild(nameSpan);
    listItem.appendChild(amountSpan);
    listItem.appendChild(dateSpan);
    listItem.appendChild(removeButton);
    listItem.appendChild(updateButton);
    borrowList.appendChild(listItem);

    totalAmount += Number(record.amount);
  });
  document.getElementById("totalAmountValue").innerHTML = totalAmount;
}

// Function to update a borrowing record
function updateBorrowing(event) {
  const listItem = event.target.parentNode;
  const id = Number(listItem.getAttribute("data-id")); // Retrieve data-id from the li-tag

  //Show name and amount when u click on update
  const index = borrowRecords.findIndex((record) => record.id === id);
  nameInput.value = borrowRecords[index].customerName;
  nameInput.setAttribute("readonly", true);
  amountInput.value = borrowRecords[index].amount;
  dateInput.value = borrowRecords[index].date;
  flag = id;

  saveButton.classList.add("hidden");
  addButton.classList.remove("hidden");

}


function addFunction(e) {
  const newAmount = amountInput.value;
  const newDate = dateInput.value;

  if (!isNaN(newAmount) && newAmount !== "" && newAmount > 0) {
    borrowRecords.map((record) => {
      if (record.id === flag && e) {
        record.amount = Number(record.amount) + Number(newAmount);
        record.date = newDate;
      }
      else if (record.id === flag) {
        record.amount = Number(record.amount) - Number(newAmount);
        record.date = newDate;
      }
      else
        return record;
    });

    updateBorrowingList();
    // when you update, then again update & Save borrowRecords array to local storage
    localStorage.setItem("borrowRecords", JSON.stringify(borrowRecords));
  }
  else {
    alert("Enter a valid amount");
  }
}

function removeData(event) {
  const listItem = event.target.parentNode;
  const id = Number(listItem.getAttribute("data-id")); // Retrieve data-id from the li-tag
  const index = borrowRecords.findIndex((record) => record.id === id);
  borrowRecords.splice(index, 1);
  updateBorrowingList();

  // Save borrowRecords array to local storage
  localStorage.setItem("borrowRecords", JSON.stringify(borrowRecords));
}

// Delete all records (also from Local Storage)
function deleteAll() {
  borrowRecords.splice(0, borrowRecords.length);
  updateBorrowingList();
  localStorage.clear();
}

// Event listener for form submission
borrowForm.addEventListener("submit", addBorrowing);

// On page load - Update borrowing list display
updateBorrowingList();