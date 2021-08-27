function selectAll(metricName, isSelected, metricNames) {
    console.log('ZZZZZZ', metricName);
    console.log('ZZZZZZ isSelected', isSelected);
    console.log('ZZZZZZssss', metricNames);
    toggleColorsInArray(metricName, isSelected, metricNames);
    toggleGloballyVisibility(metricName, isSelected, metricNames);
}

function toggleColorsInArray(metricName, isSelected, metricNames) {
    for (const name of metricNames) {
        document.getElementById(`all-${name}`).className = 'not-selected';
    }
    document.getElementById(`all-${metricName}`).className = 'selected';
}

function toggleGloballyVisibility(metricName, isSelected, metricNames) {
    for (const name of metricNames) {
        document.getElementById(`div-metric-${name}`).style.display = 'none';
    }
    document.getElementById(`div-metric-${metricName}`).style.display = 'block';
}
