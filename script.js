// Function to update champion list based on multiple filters
function updateChampionList() {
    const genderFilter = $('#genderFilter').val() || [];
    const positionsFilter = $('#positionsFilter').val() || [];
    const speciesFilter = $('#speciesFilter').val() || [];
    const resourceFilter = $('#resourceFilter').val() || [];
    const rangeFilter = $('#rangeFilter').val() || [];
    const regionFilter = $('#regionFilter').val() || [];
    const releaseDateFilterStart = $('#releaseDateFilterStart').val() || 0;
    const releaseDateFilterEnd = $('#releaseDateFilterEnd').val() || Infinity;

    // Fetch and filter data from data.json
    $.getJSON('data.json', function(championsData) {
        const filteredChampions = championsData.filter(champion => {
            const championYear = new Date(champion["Release Date"]).getFullYear();
            return (genderFilter.length === 0 || genderFilter.includes(champion.Gender)) &&
                   (positionsFilter.length === 0 || positionsFilter.some(position => champion.Positions.includes(position))) &&
                   (speciesFilter.length === 0 || speciesFilter.some(species => champion.Species.includes(species))) &&
                   (resourceFilter.length === 0 || resourceFilter.includes(champion.Resource)) &&
                   (rangeFilter.length === 0 || rangeFilter.includes(champion.Range)) &&
                   (regionFilter.length === 0 || regionFilter.includes(champion.Region)) &&
                   (championYear >= releaseDateFilterStart && championYear <= releaseDateFilterEnd);
        });

        // Display the filtered champions
        const championList = $('#championList');
        championList.empty();
        filteredChampions.forEach(champion => {
            const championElement = $('<div>').text(champion.Name);
            championList.append(championElement);
        });
    });
}

// Function to populate multi-select filters and sort by numeric value
function populateMultiSelectFilter(filterId, options, withCheckboxes = false) {
    const filter = $(filterId);

    if (withCheckboxes) {
        options.sort(); // Sort options alphabetically

        options.forEach(option => {
            const optionElement = $('<option>').attr('value', option).text(option);
            filter.append(optionElement);
        });
    } else {
        options.forEach(option => {
            const optionElement = $('<option>').attr('value', option).text(option);
            filter.append(optionElement);
        });

        // Remove duplicates
        filter.html(filter.find('option').sort().filter(function (i, e) {
            return i === 0 || $(e).text() !== $(e).prev().text();
        }));
    }
}

// Event listeners for filter changes
$('#genderFilter, #positionsFilter, #speciesFilter, #resourceFilter, #rangeFilter, #regionFilter, #releaseDateFilterStart, #releaseDateFilterEnd').change(updateChampionList);

// Initial setup
// Fetch and populate options from data.json
$.getJSON('data.json', function(championsData) {
    const uniqueGenders = [...new Set(championsData.map(champion => champion.Gender))];
    populateMultiSelectFilter('#genderFilter', uniqueGenders, true);

    const uniquePositions = [...new Set(championsData.flatMap(champion => champion.Positions))];
    populateMultiSelectFilter('#positionsFilter', uniquePositions, true);

    const uniqueSpecies = [...new Set(championsData.flatMap(champion => champion.Species).flat())];
    populateMultiSelectFilter('#speciesFilter', uniqueSpecies, true);

    const uniqueResource = [...new Set(championsData.map(champion => champion.Resource))];
    populateMultiSelectFilter('#resourceFilter', uniqueResource, true);

    const uniqueRange = [...new Set(championsData.map(champion => champion.Range))];
    populateMultiSelectFilter('#rangeFilter', uniqueRange, true);

    const uniqueRegion = [...new Set(championsData.map(champion => champion.Region))];
    populateMultiSelectFilter('#regionFilter', uniqueRegion, true);

    const uniqueReleaseYears = [...new Set(championsData.map(champion => new Date(champion["Release Date"]).getFullYear()))];
    const releaseFilterOptions = uniqueReleaseYears.sort().map(year => `${year}`);
    
    // Populate the release date filter options
    populateMultiSelectFilter('#releaseDateFilterStart', releaseFilterOptions, false);
    populateMultiSelectFilter('#releaseDateFilterEnd', releaseFilterOptions, false);

    // Trigger initial update
    updateChampionList();
});

// Function to reset all filters
function resetFilters() {
    // Reset filter selections
    $('#genderFilter, #positionsFilter, #speciesFilter, #resourceFilter, #rangeFilter, #regionFilter, #releaseDateFilterStart, #releaseDateFilterEnd').val([]);
    
    // Trigger update to refresh the champion list
    updateChampionList();
}

// Event listener for the "Reset filters" button
$('#resetFiltersBtn').click(resetFilters);
