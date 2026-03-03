(function () {
    var storageKey = 'theme-preference';
    var root = document.documentElement;
    var buttons = document.querySelectorAll('[data-theme-option]');

    if (!buttons.length) {
        return;
    }

    function applyTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            root.setAttribute('data-theme', theme);
        } else {
            root.removeAttribute('data-theme');
        }

        buttons.forEach(function (button) {
            var isActive = button.getAttribute('data-theme-option') === theme;
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    }

    var initialTheme = localStorage.getItem(storageKey);
    applyTheme(initialTheme === 'light' || initialTheme === 'dark' ? initialTheme : null);

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            var selectedTheme = button.getAttribute('data-theme-option');
            localStorage.setItem(storageKey, selectedTheme);
            applyTheme(selectedTheme);
        });
    });
})();
