function selectAll(metricName, isSelected, metricNames) {
    console.log('ZZZZZZ', metricName, isSelected);
    console.log('ZZZZZZssss', metricNames);
    toggleSelection('all-', metricName, isSelected, metricNames);
    toggleGloballyVisibility(metricName, isSelected, metricNames);
}

function toggleSelection(rootId, metricName, isSelected, metricNames) {
    for (const name of metricNames) {
        document.getElementById(`${rootId}${name}`).className = 'not-selected';
    }
    document.getElementById(`${rootId}${metricName}`).className = 'selected';
}

function toggleGloballyVisibility(metricName, isSelected, metricNames) {
    for (const name of metricNames) {
        document.getElementById(`div-metric-${name}`).style.display = 'none';
    }
    document.getElementById(`div-metric-${metricName}`).style.display = 'block';
}
function selectOne(fileName, metricName, isSelected, metricNames) {
    console.log('AAAAAA', fileName, metricName, isSelected);
    console.log('AAAAAAssss', metricNames);
    toggleSelection(`div-code-${fileName}-`, metricName, isSelected, metricNames);
    toggleGloballyVisibility(metricName, isSelected, metricNames);
}
