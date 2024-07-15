document.addEventListener('DOMContentLoaded', () => {
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    const baseURL = 'https://api.github.com';
    const headers = {
      Accept: 'application/vnd.github.v3+json'
    };
  
    githubForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (searchTerm === '') {
        alert('Please enter a GitHub username.');
        return;
      }
      await searchUsers(searchTerm);
    });
  
    async function searchUsers(username) {
      const searchURL = `${baseURL}/search/users?q=${username}`;
      try {
        const response = await fetch(searchURL, { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        displayUsers(data.items);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to fetch user data from GitHub.');
      }
    }
  
    function displayUsers(users) {
      userList.innerHTML = '';
      users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
          <div>
            <h3>${user.login}</h3>
            <a href="${user.html_url}" target="_blank">Profile</a>
          </div>
        `;
        userItem.addEventListener('click', () => {
          fetchUserRepos(user.login);
        });
        userList.appendChild(userItem);
      });
    }
  
    async function fetchUserRepos(username) {
      const reposURL = `${baseURL}/users/${username}/repos`;
      try {
        const response = await fetch(reposURL, { headers });
        if (!response.ok) {
          throw new Error('Failed to fetch repository data');
        }
        const repos = await response.json();
        displayRepos(repos);
      } catch (error) {
        console.error('Error fetching repositories:', error);
        alert('Failed to fetch repository data from GitHub.');
      }
    }
  
    function displayRepos(repos) {
      reposList.innerHTML = '';
      repos.forEach(repo => {
        const repoItem = document.createElement('li');
        repoItem.innerHTML = `
          <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
          <p>${repo.description || 'No description'}</p>
        `;
        reposList.appendChild(repoItem);
      });
    }
  });