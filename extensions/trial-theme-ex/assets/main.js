function toUrlEncoded(formData) {
  const urlEncoded = new URLSearchParams(formData).toString();
  return urlEncoded;
}
const thankyouModal = document.getElementById("thankyou-modal");

document.addEventListener("DOMContentLoaded", function () {
  let partyButton = document.querySelector("[is=party-button]");
  let signupForm = document.getElementById("formtheme");
  let formError = document.getElementById("form-error");

  partyButton.addEventListener("click", async function (e) {
    e.preventDefault();
    document.getElementById("formtheme").style.width = "100%";
    document.getElementById("formtheme").style.display = "flex";
    document.getElementById("backdrop").style.display = "flex";
    document.getElementById("alivenow-game").style.display = "flex";
  });

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Use FormData to capture the form values
    const formData = new FormData(signupForm);

    // Convert FormData into a plain object
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    console.log("Form object:", formObject);
    console.log("signupForm.action: ", signupForm.action);
    // Make the POST request with the form data
    fetch("https://stingray-app-eevdq.ondigitalocean.app/user", {
      // fetch("https://condo-scanning-white-partial.trycloudflare.com/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: toUrlEncoded(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json().then((data) => {
            console.log("Data received:", data);
            if (data.error === "Email is already in use") {
              formError.style.display = "flex";
              formError.innerHTML = "Email is already in use";
            } else {
              thankyouModal.style.display = "block";
              document.getElementById("backdrop").style.display = "none";
              document.getElementById("formtheme").style.display = "none";
              formError.innerHTML = "User Created!";
            }
          });
        } else {
          return response.json().then((data) => {
            formError.innerHTML = data.error || "An error occurred";
            console.error(data.error || "An error occurred");
          });
        }
      })
      .catch((error) => {
        console.error("Error during form submission:", error);
        formError.innerHTML = "An error occurred during form submission";
      });
  });
});

const closeModalBtn = document.getElementById("close-modal");
const container = document.getElementById("party");
closeModalBtn.addEventListener("click", () => {
  thankyouModal.style.display = "none";
  document.getElementById("formtheme").style.width = "none";
  document.getElementById("alivenow-game").style.display = "none";
  container.style.display = "none";
});
