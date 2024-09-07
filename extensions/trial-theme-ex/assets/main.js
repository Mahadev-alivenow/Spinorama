// pure javascript to scale the game
function resize() {
  var canvas = document.querySelector("canvas");
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var windowRatio = windowWidth / windowHeight;
  var gameRatio = game.config.width / game.config.height;
  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowWidth / gameRatio + "px";
  } else {
    canvas.style.width = windowHeight * gameRatio + "px";
    canvas.style.height = windowHeight + "px";
  }
}

// let userForm = document.querySelector("[type=app-form]");

// userForm.addEventListener("submit", function (e) {
//   e.preventDefault();
//   console.log("form btn data click");
//   let formData = new FormData(userForm);
//   let data = [...formData.values()];
//   fetch(`${location.origin}/apps/proxy-5/userinfo?shop=${Shopify.shop}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((data) => console.log(data))
//     .catch((error) => console.log(error));
// });

// $("root").css("overflow", "hidden");

// Example: shopify app extension script
// document.addEventListener("DOMContentLoaded", function () {
//   var iframe = document.createElement("iframe");
//   iframe.src = "https://seahorse-app-fstfy.ondigitalocean.app/";
//   iframe.width = "100%";
//   iframe.height = "600";
//   iframe.sandbox = "allow-scripts allow-same-origin allow-forms allow-popups";
//   iframe.frameBorder = "0";
//   document.body.appendChild(iframe);
// });

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
    fetch(signupForm.action, {
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
