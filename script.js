document.addEventListener('DOMContentLoaded', () => {

    const authView = document.getElementById('auth-view');
    const appView = document.getElementById('app-view');
    const userDisplay = document.getElementById('user-display');

   
    const loginView = document.getElementById('login-view');
    const signupView = document.getElementById('signup-view');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupBtn = document.getElementById('show-signup');
    const showLoginBtn = document.getElementById('show-login');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const logoutBtn = document.getElementById('logout-btn');

 
    const linkForm = document.getElementById('link-form');
    const titleInput = document.getElementById('link-title-input');
    const urlInput = document.getElementById('link-url-input');
    const categoryInput = document.getElementById('link-category-input');
    const linksContainer = document.getElementById('links-container');


    let links = JSON.parse(localStorage.getItem('userLinks')) || [];

    const performLogin = (email) => {
        console.log(`Simulating login for: ${email}`); 
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', email);
        updateView(); 
    };

    
    const updateView = () => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

        if (isLoggedIn) {
          
            authView.classList.add('hidden');
            appView.classList.remove('hidden');
            userDisplay.textContent = `Signed in as ${sessionStorage.getItem('userEmail')}`;
            displayLinks();
        } else {
            
            authView.classList.remove('hidden');
            appView.classList.add('hidden');
            userDisplay.textContent = '';
        }
    };
    
    showSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.add('hidden');
        signupView.classList.remove('hidden');
    });

   
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupView.classList.add('hidden');
        loginView.classList.remove('hidden');
    });

    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const email = document.getElementById('login-email').value;
        performLogin(email);
    });

    
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        performLogin(email);
    });

   
    googleLoginBtn.addEventListener('click', () => {
        performLogin('user@google.com'); 
    });
    
   
    logoutBtn.addEventListener('click', () => {
        console.log('Logging out.'); 
        sessionStorage.clear();
        updateView(); 
    });

    const saveLinks = () => {
        localStorage.setItem('userLinks', JSON.stringify(links));
    };

    const displayLinks = () => {
        linksContainer.innerHTML = '';
        if (links.length === 0) {
            linksContainer.innerHTML = '<p style="text-align: center; color: #888;">No links saved yet. Add one above!</p>';
            return;
        }
        const groupedLinks = links.reduce((acc, link) => {
            const category = link.category || 'Uncategorized';
            if (!acc[category]) acc[category] = [];
            acc[category].push(link);
            return acc;
        }, {});
        for (const category in groupedLinks) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'category-group';
            groupDiv.innerHTML = `<h2 class="category-title">${category}</h2>`;
            groupedLinks[category].forEach(link => {
                const linkItem = document.createElement('div');
                linkItem.className = 'link-item';
                linkItem.innerHTML = `<div class="link-info"><a href="${link.url}" target="_blank">${link.title}</a><p>${link.url}</p></div><button class="delete-btn" data-id="${link.id}">✖</button>`;
                groupDiv.appendChild(linkItem);
            });
            linksContainer.appendChild(groupDiv);
        }
    };
    
    linkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        links.push({ id: Date.now(), title: titleInput.value.trim(), url: urlInput.value.trim(), category: categoryInput.value.trim() });
        saveLinks();
        displayLinks();
        linkForm.reset();
    });

    linksContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const linkId = parseInt(e.target.getAttribute('data-id'));
            links = links.filter(link => link.id !== linkId);
            saveLinks();
            displayLinks();
        }
    });

    
    updateView();
});