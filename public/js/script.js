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

// Choices (only on pages that have a #category select)
const categoryEl = document.getElementById('category');
if (categoryEl) {
    new Choices(categoryEl, {
        searchEnabled: true,
        itemSelectText: '',
        shouldSort: true
    });
}

// 18% GST Toggle
document.addEventListener("DOMContentLoaded", () => {
  const taxToggler = document.getElementById("flexSwitchCheck");
  if (taxToggler) {
    taxToggler.addEventListener("change", () => {
      const basePrices = document.getElementsByClassName("base-price");
      const taxedPrices = document.getElementsByClassName("taxed-price");
      for (let i = 0; i < basePrices.length; i++) {
        if (taxToggler.checked) {
          basePrices[i].style.display = "none";
          taxedPrices[i].style.display = "inline";
        } else {
          basePrices[i].style.display = "inline";
          taxedPrices[i].style.display = "none";
        }
      }
    });
  }

  // Drag and Drop Zone Implementation
  const dragDropZone = document.getElementById("dragDropZone");
  const fileInput = document.getElementById("image");
  const previewContainer = document.getElementById("previewContainer");
  const imagePreview = document.getElementById("imagePreview");
  const fileNameSpan = document.getElementById("fileName");
  const fileSizeSpan = document.getElementById("fileSize");
  const removeFileBtn = document.getElementById("removeFileBtn");
  const fileError = document.getElementById("fileError");
  const form = document.querySelector("form.needs-validation");

  if (dragDropZone && fileInput) {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dragDropZone.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
      dragDropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dragDropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dragDropZone.addEventListener('drop', handleDrop, false);

    // Handle file selection via input click/change
    fileInput.addEventListener('change', handleFileSelect, false);

    // Remove file action
    if (removeFileBtn) {
      removeFileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent triggering file input click
        resetFileInput();
      });
    }
  }

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function highlight() {
    dragDropZone.classList.add('dragover');
  }

  function unhighlight() {
    dragDropZone.classList.remove('dragover');
  }

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length) {
      fileInput.files = files;
      validateAndPreviewFile(files[0]);
    }
  }

  function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length) {
      validateAndPreviewFile(files[0]);
    }
  }

  function validateAndPreviewFile(file) {
    clearError();

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showError("Invalid file type. Only JPG, JPEG, and PNG are supported.");
      resetFileInput();
      return;
    }

    // Check file size (3MB limit)
    const maxSize = 3 * 1024 * 1024; // 3MB
    if (file.size > maxSize) {
      showError("File size exceeds 3MB limit. Please upload a smaller image.");
      resetFileInput();
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (imagePreview) imagePreview.src = reader.result;
      if (fileNameSpan) {
        fileNameSpan.textContent = file.name.length > 25 ? file.name.substring(0, 22) + "..." : file.name;
      }
      if (fileSizeSpan) {
        fileSizeSpan.textContent = `(${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
      }
      if (previewContainer) {
        previewContainer.style.display = 'flex';
      }
    };
  }

  function resetFileInput() {
    fileInput.value = "";
    if (previewContainer) previewContainer.style.display = 'none';
    if (imagePreview) imagePreview.src = "";
    clearError();
  }

  function showError(msg) {
    if (fileError) {
      fileError.textContent = msg;
      fileError.style.display = "block";
    }
  }

  function clearError() {
    if (fileError) {
      fileError.textContent = "";
      fileError.style.display = "none";
    }
  }

  // Prevent form submission if there's an invalid file size/type
  if (form && fileInput) {
    form.addEventListener("submit", (e) => {
      if (fileInput.files.length) {
        const file = fileInput.files[0];
        const maxSize = 3 * 1024 * 1024;
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (!validTypes.includes(file.type)) {
          showError("Invalid file type. Only JPG, JPEG, and PNG are supported.");
          e.preventDefault();
          e.stopPropagation();
        } else if (file.size > maxSize) {
          showError("File size exceeds 3MB limit. Please upload a smaller image.");
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });
  }

});