(function () {
  "use strict";

  var interesSelect = document.getElementById('interes');
  var descripcionWrapper = document.getElementById('descripcionWrapper');
  var descripcionInput = document.getElementById('descripcion');
  
  if (interesSelect) {
    function toggleDescripcion() {
      if (interesSelect.value === 'No sé, necesito orientación') {
        descripcionWrapper.hidden = false;
        if (descripcionInput) {
          descripcionInput.required = true;
          descripcionInput.focus();
        }
      } else {
        descripcionWrapper.hidden = true;
        if (descripcionInput) {
          descripcionInput.required = false;
        }
      }
    }
    interesSelect.addEventListener('change', toggleDescripcion);
    toggleDescripcion();
  }
})();