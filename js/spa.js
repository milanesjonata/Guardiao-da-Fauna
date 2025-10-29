const mainContent = document.getElementById('app-content');

//função principal
const loadContent = async (url) => {
    if (!mainContent) return;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const newContent = doc.getElementById('app-content');

        if (newContent) {
            mainContent.innerHTML = newContent.innerHTML;

            document.title = doc.title;

            updateActiveLinks(url.pathname);

            const { setupValidator } = await import('./validator.js');
            setupValidator();
        }
    } catch (error) {
        console.error('Falha ao carregar o conteúdo da página:', error);
        window.location.href = url;
    }
};

const handleNavigation = (e) => {
    const target = e.target.closest('a');
    if (target && target.href && !target.target) {
        const url = new URL(target.href);

        if (url.origin === window.location.origin && url.hash === '') {
            e.preventDefault();
            history.pushState(null, '', url.pathname);

            loadContent(url.pathname);
        }
    }
};

const setupSPA = () => {
    document.addEventListener('click', handleNavigation);

    window.addEventListener('popstate', () => loadContent(window.location.pathname));

    updateActiveLinks(window.location.pathname);

    document.querySelectorAll('.nav-list a').forEach(a => {
        if (a.pathname === window.location.pathname) {
            a.classList.add('is-active');
        }
    });
};

export { setupSPA };