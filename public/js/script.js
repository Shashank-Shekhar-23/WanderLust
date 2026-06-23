(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

// 18% GST
document.addEventListener("DOMContentLoaded", () => {
  const taxToggler = document.getElementById("flexSwitchCheck");
  taxToggler.addEventListener("click", () => {
    const basePrices = document.getElementsByClassName("base-price");
    const taxedPrices = document.getElementsByClassName("taxed-price");
    for (let i = 0; i < basePrices.length; i++) {
      if (basePrices[i].style.display !== "none") {
        basePrices[i].style.display = "none";
        taxedPrices[i].style.display = "inline";
      } else {
        basePrices[i].style.display = "inline";
        taxedPrices[i].style.display = "none";
      }
    }
  });
});