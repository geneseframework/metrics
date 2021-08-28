function selectAll(metricName, isSelected, metricNames) {
    console.log('ZZZZZZ', metricName, isSelected);
    console.log('ZZZZZZssss', metricNames);
    toggleSelection('all-', metricName, isSelected, metricNames);
    toggleGloballyVisibility(metricName, isSelected, metricNames);
}

function selectOne(fileName, metricSelected, metricNames) {
    console.log('AAAAAA', fileName, metricSelected);
    console.log('AAAAAAssss', metricNames);
    toggleSelection(`div-file-${fileName}-`, metricSelected, metricNames);
    toggleVisibilityForOneFile(fileName, metricSelected, metricNames);
}

function toggleSelection(rootId, metricSelected, metricNames) {
    for (const name of metricNames) {
        document.getElementById(`${rootId}${name}`).className = 'not-selected';
    }
    document.getElementById(`${rootId}${metricSelected}`).className = 'selected';
}

function toggleGloballyVisibility(metricName, isSelected, metricNames) {
    for (const name of metricNames) {
        document.getElementById(`div-metric-${name}`).style.display = 'none';
    }
    document.getElementById(`div-metric-${metricName}`).style.display = 'block';
}

function toggleVisibilityForOneFile(fileName, metricSelected, metricNames) {
    console.log('METRIC NAMESSSS', metricNames);
    for (const metricName of metricNames) {
        console.log('METRIC NAMEEEEE', `tr-${fileName}-${metricName}`);
        document.getElementById(`tr-${fileName}-${metricName}`).style.display = 'none';
    }
    document.getElementById(`tr-${fileName}-${metricSelected}`).style.display = 'table';
}
