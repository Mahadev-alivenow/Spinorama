document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("form");

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(signupForm);

    console.log(formData);
    fetch(signupForm.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          // Redirect or handle success
          window.location.href = "/success";
        } else {
          // Handle errors (e.g., email already in use)
          return response.json().then((data) => {
            // alert(data.error || "An error occurred");
            return data.error;
          });
        }
      })
      .catch((error) => {
        alert("An error occurred during form submission");
      });
  });
});
