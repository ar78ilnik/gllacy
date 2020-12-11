(() => {
    let buttonNavigation = document.querySelector('.button_navigation'),
        navigationList = document.querySelector('.navigation__list');
    
    buttonNavigation.addEventListener('click', () => {
        let expanded = buttonNavigation.getAttribute('aria-expanded') === 'true' || false;
        buttonNavigation.setAttribute('aria-expanded', !expanded);
        buttonNavigation.classList.toggle('button_navigation-open');
        navigationList.classList.toggle('navigation__list_open');
    })
})();