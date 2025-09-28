/**
 * Dynamic content loader for Publications, Professional Services, and Friends sections
 */

class DataLoader {
  constructor() {
    this.basePath = './data/';
  }

  /**
   * Load JSON data from a file
   * @param {string} filename - The JSON filename to load
   * @returns {Promise<Object>} - The parsed JSON data
   */
  async loadJSON(filename) {
    try {
      const response = await fetch(`${this.basePath}${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return null;
    }
  }

  /**
   * Render publications section with timeline effect
   */
  async renderPublications() {
    const data = await this.loadJSON('publications.json');
    if (!data || !data.publications) return;

    const container = document.getElementById('publications-content');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Group publications by year
    const publicationsByYear = {};
    data.publications.forEach(publication => {
      const year = publication.year || 'Unknown';
      if (!publicationsByYear[year]) {
        publicationsByYear[year] = [];
      }
      publicationsByYear[year].push(publication);
    });

    // Create timeline container
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'timeline';

    // Sort years in descending order (newest first)
    const sortedYears = Object.keys(publicationsByYear).sort((a, b) => b - a);

    // Render each year group
    sortedYears.forEach(year => {
      const yearDiv = document.createElement('div');
      yearDiv.className = 'timeline-year';

      // Year header
      const yearHeader = document.createElement('h3');
      yearHeader.textContent = year;
      yearDiv.appendChild(yearHeader);

      // Publications container for this year
      const publicationsContainer = document.createElement('div');
      publicationsContainer.className = 'timeline-publications';

      // Render each publication for this year
      publicationsByYear[year].forEach(publication => {
        const publicationDiv = document.createElement('div');
        publicationDiv.className = 'timeline-publication-item';

        // Title
        const titleDiv = document.createElement('div');
        titleDiv.className = 'publication-title';
        const titleLink = document.createElement('a');
        titleLink.href = publication.links[0]?.url || '#';
        titleLink.target = '_blank';
        titleLink.innerHTML = publication.title;
        titleDiv.appendChild(titleLink);

        // Authors
        const authorsDiv = document.createElement('div');
        authorsDiv.className = 'publication-authors';
        authorsDiv.innerHTML = publication.authors;

        // Venue
        const venueDiv = document.createElement('div');
        venueDiv.className = 'publication-venue';
        venueDiv.innerHTML = publication.venue;

        // Links
        const linksDiv = document.createElement('div');
        linksDiv.className = 'publication-links';
        publication.links.forEach(link => {
          const linkElement = document.createElement('a');
          linkElement.href = link.url;
          linkElement.target = '_blank';
          linkElement.className = 'publication-link';
          linkElement.textContent = link.type;
          linksDiv.appendChild(linkElement);
        });

        publicationDiv.appendChild(titleDiv);
        publicationDiv.appendChild(authorsDiv);
        publicationDiv.appendChild(venueDiv);
        publicationDiv.appendChild(linksDiv);
        publicationsContainer.appendChild(publicationDiv);
      });

      yearDiv.appendChild(publicationsContainer);
      timelineContainer.appendChild(yearDiv);
    });

    container.appendChild(timelineContainer);
  }

  /**
   * Render professional services section
   */
  async renderServices() {
    const data = await this.loadJSON('services.json');
    if (!data || !data.services) return;

    const container = document.getElementById('services-content');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Render each service
    data.services.forEach(service => {
      const serviceDiv = document.createElement('div');
      serviceDiv.className = 'service-item';

      const iconDiv = document.createElement('div');
      iconDiv.className = 'service-icon';
      iconDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14,2 14,8 20,8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10,9 9,9 8,9"></polyline>
        </svg>
      `;

      const contentDiv = document.createElement('div');
      contentDiv.className = 'service-content';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'service-title';
      titleDiv.textContent = service.title;

      const journalDiv = document.createElement('div');
      journalDiv.className = 'service-journal';
      journalDiv.textContent = service.journal;

      contentDiv.appendChild(titleDiv);
      contentDiv.appendChild(journalDiv);

      serviceDiv.appendChild(iconDiv);
      serviceDiv.appendChild(contentDiv);
      container.appendChild(serviceDiv);
    });
  }

  /**
   * Render friends section
   */
  async renderFriends() {
    const data = await this.loadJSON('friends.json');
    if (!data || !data.friends) return;

    // Find the friends content container
    const container = document.getElementById('friends-content');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Render each friend link
    data.friends.forEach((friend, index) => {
      const link = document.createElement('a');
      link.href = friend.url;
      link.target = '_blank';
      link.textContent = friend.name;
      
      container.appendChild(link);
      
      // Add line breaks between links (except for the last one)
      if (index < data.friends.length - 1) {
        container.appendChild(document.createElement('br'));
        container.appendChild(document.createElement('br'));
      }
    });
  }

  /**
   * Initialize all sections
   */
  async init() {
    try {
      await Promise.all([
        this.renderPublications(),
        this.renderServices(),
        this.renderFriends()
      ]);
      console.log('All sections loaded successfully');
    } catch (error) {
      console.error('Error initializing sections:', error);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const loader = new DataLoader();
  loader.init();
});
