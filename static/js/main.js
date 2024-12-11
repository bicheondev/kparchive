function fnMoveMain() {
    window.location.href = "/main/main.do";
}

function submitForm(event) {
    var searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput === "") {
        alert("검색어를 입력해 주시기 바랍니다.");
        event.preventDefault();
    } else {
        // Get the current base path (e.g., KK, biyak, KEEK)
        var currentBase = window.location.pathname.split('/')[1];
        // Set the form action dynamically based on the current base
        document.getElementById("searchForm").action = `/${currentBase}/searchResult.do?search=${encodeURIComponent(searchInput)}`;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const settingsLink = document.getElementById('settingsLink');
    const settingsPopup = document.getElementById('settingsPopup');
    const settingsBackground = document.getElementById('settingsBackground');
    const closeIcon = document.querySelector('.close-icon');
    const useNorthKoreanFontCheckbox = document.getElementById('use-north-korean-font');

    // Function to apply the font based on localStorage value
    function applyFontPreference() {
        const useNorthKoreanFont = localStorage.getItem('useNorthKoreanFont') === 'true';
        if (useNorthKoreanFont) {
            document.body.classList.add('north-korean-font');
            useNorthKoreanFontCheckbox.checked = true;
        } else {
            document.body.classList.remove('north-korean-font');
            useNorthKoreanFontCheckbox.checked = false;
        }
    }

    // Apply the font preference on initial page load
    applyFontPreference();

    // Show the popup when the settings link is clicked with fade-in animation
    settingsLink.addEventListener('click', function () {
        settingsPopup.style.opacity = '0'; // Set initial opacity to 0
        settingsBackground.style.opacity = '0'; // Set initial opacity to 0
        settingsPopup.style.display = 'block'; // Ensure the popup is visible
        settingsBackground.style.display = 'block'; // Ensure the background is visible
        setTimeout(() => { // Delay to allow rendering before applying animation
            settingsPopup.style.opacity = '1'; // Fade in the popup
            settingsBackground.style.opacity = '0.5'; // You can adjust the opacity of the background here
        }, 50); // Adjust this delay as needed
    });

    // Hide the popup when the background is clicked or the close button is clicked
    settingsBackground.addEventListener('click', function () {
        settingsPopup.style.opacity = '0'; // Fade out the popup
        settingsBackground.style.opacity = '0'; // Fade out the background
        setTimeout(() => { // Delay hiding to match the transition duration
            settingsPopup.style.display = 'none';
            settingsBackground.style.display = 'none';
        }, 300);
    });

    closeIcon.addEventListener('click', function () {
        settingsPopup.style.opacity = '0'; // Fade out the popup
        settingsBackground.style.opacity = '0'; // Fade out the background
        setTimeout(() => { // Delay hiding to match the transition duration
            settingsPopup.style.display = 'none';
            settingsBackground.style.display = 'none';
        }, 300);
    });

    // Update font family based on checkbox state and save preference in localStorage
    useNorthKoreanFontCheckbox.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('north-korean-font');
            localStorage.setItem('useNorthKoreanFont', 'true');
        } else {
            document.body.classList.remove('north-korean-font');
            localStorage.setItem('useNorthKoreanFont', 'false');
        }
    });
    
    // Function to update the title based on the current URL
    function updateTitle() {
        const currentPath = window.location.pathname; // Get the current path
        let title;

        if (currentPath.includes('searchResult.do')) {
            const currentBase = currentPath.split('/')[1];
            switch (currentBase) {
                case 'KK':
                    title = '조선말대사전 - 찾기 결과'; // For KK search results
                    break;
                case 'biyak':
                    title = '비약과학기술용어사전 - 찾기 결과'; // For biyak search results
                    break;
                case 'KEEK':
                    title = '영조사전 - 찾기 결과'; // For KEEK search results
                    break;
                case 'KCCK':
                    title = '중조사전 - 찾기 결과'; // For KCCK search results
                    break;
                case 'KFFK':
                    title = '불조사전 - 찾기 결과'; // For KFFK search results
                    break;
                case 'KJJK':
                    title = '일조사전 - 찾기 결과'; // For KJJK search results
                    break;
                case 'KDDK':
                    title = '독조사전 - 찾기 결과'; // For KDDK search results
                    break;
                case 'KRRK':
                    title = '로조사전 - 찾기 결과'; // For KRRK search results
                    break;
                default:
                    title = '북한사전아카이브 - 찾기 결과'; // Fallback for other cases
                    break;
            }
        } else {
            const currentBase = currentPath.split('/')[1];
            switch (currentBase) {
                case 'KK':
                    title = '조선말대사전 - 북한사전아카이브';
                    break;
                case 'biyak':
                    title = '비약과학기술용어사전 - 북한사전아카이브';
                    break;
                case 'KEEK':
                    title = '영조사전 - 북한사전아카이브';
                    break;
                case 'KCCK':
                    title = '중조사전 - 북한사전아카이브';
                    break;
                case 'KFFK':
                    title = '불조사전 - 북한사전아카이브';
                    break;
                case 'KJJK':
                    title = '일조사전 - 북한사전아카이브';
                    break;
                case 'KDDK':
                    title = '독조사전 - 북한사전아카이브';
                    break;
                case 'KRRK':
                    title = '로조사전 - 북한사전아카이브';
                    break;
                default:
                    title = '북한사전아카이브'; // Default title
                    break;
            }
        }

        // Set the document title
        document.title = title; // Set the document title
    }

    // Call updateTitle on page load
    updateTitle();
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const autocompleteContainer = document.getElementById('autocomplete-container');
    const searchForm = document.getElementById('searchForm');

    searchInput.setAttribute('autocomplete', 'off'); // Ensure autocomplete is turned off

    let currentAbortController = null; // To keep track of the current abort controller

    searchInput.addEventListener('input', function() {
        const query = searchInput.value.trim();

        // Cancel the previous request if it exists
        if (currentAbortController) {
            currentAbortController.abort();
        }

        if (query) {
            // Create a new AbortController for the new request
            currentAbortController = new AbortController();
            const { signal } = currentAbortController;

            // Get the current base from the URL
            const currentBase = window.location.pathname.split('/')[1];

            // Adjust the fetch URL based on the current base
            fetch(`/${currentBase}/search/suggestions?query=${encodeURIComponent(query)}`, { signal })
                .then(response => response.json())
                .then(data => {
                    autocompleteContainer.innerHTML = ''; // Clear previous suggestions
                    if (data.length > 0) {
                        const uniqueSuggestions = new Set(); // Use a Set to avoid duplicates

                        data.forEach(item => {
                            // Remove trailing numbers and superscript characters
                            const baseWord = item.word.replace(/[\d¹²³⁴⁵⁶⁷⁸⁹⁰]+$/, '');
                            uniqueSuggestions.add(baseWord);
                        });

                        uniqueSuggestions.forEach(baseWord => {
                            const div = document.createElement('div');
                            div.classList.add('autocomplete-item');

                            // Highlight only the prefix that matches the query
                            const baseWordLower = baseWord.toLowerCase();
                            const queryLower = query.toLowerCase();
                            let highlightedWord = '';

                            if (baseWordLower.startsWith(queryLower)) {
                                highlightedWord = `<b>${baseWord.substring(0, query.length)}</b>${baseWord.substring(query.length)}`;
                            } else {
                                highlightedWord = baseWord;
                            }

                            div.innerHTML = highlightedWord;

                            // Add click event listener for the suggestion
                            div.addEventListener('click', () => {
                                searchInput.value = baseWord; // Set the value to the base word
                                searchForm.submit(); // Submit the form with the selected keyword
                            });

                            autocompleteContainer.appendChild(div);
                        });
                    } else {
                        const message = document.createElement('div');
                        message.classList.add('autocomplete-item', 'no-results'); // Add no-results class
                        message.textContent = '해당 단어로 시작하는 검색어가 없습니다.';
                        autocompleteContainer.appendChild(message);
                    }
                    autocompleteContainer.style.display = 'block'; // Show the container
                })
                .catch(err => {
                    // Handle fetch errors and aborted requests
                    if (err.name === 'AbortError') {
                        console.log('Previous request aborted');
                    } else {
                        console.error('Fetch error:', err);
                    }
                });
        } else {
            autocompleteContainer.innerHTML = ''; // Clear suggestions
            autocompleteContainer.style.display = 'none'; // Hide the container
        }
    });

    // Hide autocomplete when clicking outside the search input or autocomplete container
    document.addEventListener('mousedown', function(event) {
        if (!autocompleteContainer.contains(event.target) && !searchInput.contains(event.target)) {
            autocompleteContainer.style.display = 'none'; // Hide the container
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const autocompleteContainer = document.getElementById('autocomplete-container');

    // Show the autocomplete container when the input box is focused, even if text is already present
    searchInput.addEventListener('focus', function () {
        autocompleteContainer.style.display = 'block'; // Show the container
    });

    // Hide the autocomplete container when clicking outside the input box
    document.addEventListener('click', function (event) {
        if (!searchInput.contains(event.target) && !autocompleteContainer.contains(event.target)) {
            autocompleteContainer.style.display = 'none'; // Hide the container
        }
    });

    // Optionally, hide the autocomplete container when the input loses focus
    searchInput.addEventListener('blur', function () {
        setTimeout(function() {
            if (!autocompleteContainer.contains(document.activeElement)) {
                autocompleteContainer.style.display = 'none';
            }
        }, 100); // Delay to allow interaction with suggestions
    });

    // If the user starts typing, the container should reappear
    searchInput.addEventListener('input', function () {
        if (searchInput.value.trim() !== '') {
            autocompleteContainer.style.display = 'block'; // Show the container while typing
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const currentUrl = window.location.pathname; // Get the current URL path
    const helpLink = document.getElementById('helpLink'); // Get the 도움말 link
    const settingsLink = document.getElementById('settingsLink'); // Get the 설정 link
    const vLine = document.getElementById('v-line'); // Get the v-line element

    // Log current URL for debugging
    console.log('Current URL:', currentUrl);

    // Show or hide elements based on URL
    if (currentUrl === '/KK' || currentUrl === '/KK/searchResult.do' || 
        currentUrl === '/KK/help/uriminzokkiri' || currentUrl === '/KK/help/dprktoday') {
        helpLink.style.display = 'block'; // Show 도움말 link
        settingsLink.style.display = 'block'; // Show 설정 link
        vLine.style.display = 'block'; // Show v-line
    } else if (currentUrl === '/biyak' || currentUrl === '/biyak/searchResult.do') {
        helpLink.style.display = 'none'; // Hide 도움말 link
        settingsLink.style.display = 'block'; // Show 설정 link
        vLine.style.display = 'none'; // Show v-line
    } else if (currentUrl === '/KEEK' || currentUrl === '/KEEK/searchResult.do') {
        helpLink.style.display = 'none'; // Hide 도움말 link
        settingsLink.style.display = 'block'; // Show 설정 link
        vLine.style.display = 'none'; // Show v-line
    } else {
        helpLink.style.display = 'none'; // Hide 도움말 link
        settingsLink.style.display = 'block'; // Hide 설정 link
        vLine.style.display = 'none'; // Hide v-line
    }
});
