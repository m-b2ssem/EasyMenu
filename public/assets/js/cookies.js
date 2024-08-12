document.addEventListener('DOMContentLoaded', () => {
    // Check if cookie preferences are already saved
    const savedPreferences = localStorage.getItem('cookiePreferences');
  
  if (!savedPreferences) {
    // Show the cookie consent popup if no preferences are found
    const cookieConsentPopup = document.getElementById('cookieConsentPopup');
    cookieConsentPopup.style.display = 'block';
  } else {
    // Apply the saved cookie preferences
    const preferences = JSON.parse(savedPreferences);
    //applyCookiePreferences(preferences);
  }
});

function acceptAllCookies() {
  // Set all cookie preferences to true
  document.getElementById('performanceCookies').checked = true;
  document.getElementById('functionalityCookies').checked = true;
  document.getElementById('advertisingCookies').checked = true;
  
  saveCookiePreferences();
}

function saveCookiePreferences() {
  const performanceCookies = document.getElementById('performanceCookies').checked;
  const functionalityCookies = document.getElementById('functionalityCookies').checked;
  const advertisingCookies = document.getElementById('advertisingCookies').checked;
  
  // Save preferences to localStorage or send to server
  localStorage.setItem('cookiePreferences', JSON.stringify({
    performanceCookies,
    functionalityCookies,
    advertisingCookies
  }));
  
  // Hide the cookie consent popup
  document.getElementById('cookieConsentPopup').style.display = 'none';
}

function showCookies(event) {
  event.preventDefault();
  let savedPreferences = localStorage.getItem('cookiePreferences');
  savedPreferences = JSON.parse(savedPreferences);

  const performanceCookies = document.getElementById('performanceCookies');
  const functionalityCookies = document.getElementById('functionalityCookies');
  const advertisingCookies = document.getElementById('advertisingCookies');

  performanceCookies.checked = savedPreferences.performanceCookies;
  functionalityCookies.checked = savedPreferences.functionalityCookies;
  advertisingCookies.checked = savedPreferences.advertisingCookies;
  
  document.getElementById('cookieConsentPopup').style.display = 'block';
}

/*function applyCookiePreferences(preferences) {
  // Logic to enable/disable cookies based on preferences
  console.log('Applying cookie preferences:', preferences);

  // Example of handling different types of cookies
  if (preferences.performanceCookies) {
    // Enable performance cookies
  } else {
    // Disable performance cookies
  }

  if (preferences.functionalityCookies) {
    // Enable functionality cookies
  } else {
    // Disable functionality cookies
  }

  if (preferences.advertisingCookies) {
    // Enable advertising cookies
  } else {
    // Disable advertising cookies
  }*/