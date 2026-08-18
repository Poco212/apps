/* ==========================================================================
   Warehouse App - LOGIN VIEW CONTROLLER
   File: frontend/js/views/login.view.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  const loginForm = document.getElementById('loginForm');
  const toggleBtn = document.getElementById('passwordToggleBtn');
  const resetLink = document.getElementById('resetCodeLink');

  if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);
  if (toggleBtn) toggleBtn.addEventListener('click', togglePasswordVisibility);
  if (resetLink) {
    resetLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Silakan hubungi IT Support Gudang (Ext: 108) untuk mereset Access Code Anda.');
    });
  }
});

function togglePasswordVisibility() {
  const passwordInput = document.getElementById('accessCode');
  const eyeIcon = document.getElementById('eyeIcon');
  if (!passwordInput || !eyeIcon) return;

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.setAttribute('data-lucide', 'eye-off');
  } else {
    passwordInput.type = 'password';
    eyeIcon.setAttribute('data-lucide', 'eye');
  }
  if (window.lucide) lucide.createIcons();
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const operatorId = document.getElementById('operatorId').value.trim();
  const accessCode = document.getElementById('accessCode').value.trim();

  if (operatorId && accessCode) {
    StorageService.setSession({
      operatorId: operatorId,
      name: 'Budi Santoso',
      role: 'Operator Gudang Utama',
      warehouseId: 'WH-882'
    });
    window.location.href = 'index.html';
  }
}
