document.addEventListener('DOMContentLoaded', () => {
    const element1 = document.getElementById('sidenavclass');
    const toggleBtn = document.getElementById('iconNavbarSidenav');
    const closeBtn = document.getElementById('closeBtn');

    toggleBtn.addEventListener('click', () => {
        element1.classList.toggle('g-sidenav-pinned');
    });

    closeBtn.addEventListener('click', () => {
        element1.classList.remove('g-sidenav-pinned');
    });
});
