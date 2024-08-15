window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const mainNav = document.getElementById('main-nav');
    const stickyNav = document.querySelector('.sticky-navbar');
    const stickyNavHeight = stickyNav.offsetHeight;

    if (window.scrollY > header.offsetHeight) {
        stickyNav.style.display = 'flex';
        mainNav.style.display = 'none';
        document.body.classList.add('sticky-nav');
    } else {
        stickyNav.style.display = 'none';
        mainNav.style.display = 'flex';
        document.body.classList.remove('sticky-nav');
    }
});