let proxy = "proxy";
let userForm = document.getElementById("submit-btn");
// const userForm = document.getElementById("form");
const thankyouModal = document.getElementById("thankyou-modal");
const closeModalBtn = document.getElementById("close-modal");
let formError = document.getElementById("form-error");
const container = document.getElementById("party");

let partyButton = document.querySelector("[is=party-button]");
console.log("formError");
console.log(formError);

document.addEventListener("DOMContentLoaded", function () {
  partyButton.addEventListener("click", async function (e) {
    e.preventDefault();
    document.getElementById("formtheme").style.width = "100%";
    document.getElementById("formtheme").style.display = "flex";
    document.getElementById("backdrop").style.display = "flex";
    console.log("flex");
    document.getElementById("alivenow-game").style.display = "flex";
  });
  const signupForm = document.getElementById("formtheme");

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(signupForm);

    console.log(formData);
    console.log("updated url main js");
    fetch("https://stingray-app-eevdq.ondigitalocean.app/usertheme", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // Redirect or handle success
          // window.location.href = "/success";
          return response.json().then((data) => {
            // const data = await response.json();
            console.log("outer");
            console.log(data);
            if (!data) {
              console.log("undefined data");
              console.log(data);
              return;
            } else if (data === "Email is already in use") {
              console.log("exits");
              console.log(data);
              formError.style.display = "flex";
              formError.innerHTML = "Email is already in use";
              console.log(formError);
            } else {
              thankyouModal.style.display = "block";
              document.getElementById("backdrop").style.display = "none";
              document.getElementById("formtheme").style.display = "none";
              console.log("data");
              console.log(data);
              console.log(data, "User created!");
              formError.innerHTML = "User Created!";
              console.log(formError);
            }
          });
        } else {
          // Handle errors (e.g., email already in use)
          return response.json().then((data) => {
            formError.innerHTML = "Email is already in use";
            console.log(data.error || "An error occurred");
            // alert(data.error || "An error occurred");
          });
        }
      })
      .catch((error) => {
        alert("An error occurred during form submission");
      });
  });
});

// userForm.addEventListener("click", async function (e) {
//   e.preventDefault();

//   console.log("form clicked : <> ");
//   let formdata = new FormData();
//   console.log(formdata);
//   formdata.username = document.getElementById("name").value;
//   formdata.useremail = document.getElementById("email").value;
//   console.log(location.origin);
//   const fetchData = async () => {
//     try {
//       // Replace https://your-app-url.com with your actual deployed Remix app URL'

//       const response = await fetch(
//         "https://spiny-wheel.myshopify.com/proxy/user",
//       );
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       const data = await response.json();
//       console.log("Data received from API:", data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   // Call the function on page load or a specific event
//   fetchData();
//   // const response = await fetch(
//   //   // `${location.origin}/apps/userinfo?shop=${Shopify.shop}`,
//   //   "https://spiny-wheel.myshopify.com/api/register",
//   //   {
//   //     method: "POST",
//   //     headers: {
//   //       Accept: "application/json, text/plain, */*",
//   //       "Content-Type": "application/json",
//   //       "Access-Control-Allow-Origin": "*",
//   //     },
//   //     //   body: JSON.stringify({ name: "venki", email: "venki@gmail.com" }),
//   //     body: JSON.stringify(formdata),
//   //   },
//   // );
//   // if (!response.ok) {
//   //   return;
//   // }
//   // const data = await response.json();
//   // console.log("outer");
//   // console.log(data);
//   // if (!data) {
//   //   console.log("undefined data");
//   //   console.log(data);
//   //   return;
//   // } else if (data === "- User Already exits -") {
//   //   console.log("exits");
//   //   console.log(data);
//   //   formError.style.display = "flex";
//   //   // formError.innerHTML = data+"";
//   // } else {
//   //   thankyouModal.style.display = "block";
//   //   document.getElementById("backdrop").style.display = "none";
//   //   document.getElementById("form").style.display = "none";
//   //   console.log("data");
//   //   console.log(data);
//   //   console.log(data, "- User Already exits -");
//   // }
// });

closeModalBtn.addEventListener("click", () => {
  thankyouModal.style.display = "none";
  document.getElementById("formtheme").style.width = "none";
  document.getElementById("alivenow-game").style.display = "none";
  // document.getElementById("pop-up").style.display = "none";
  container.style.display = "none";
});
