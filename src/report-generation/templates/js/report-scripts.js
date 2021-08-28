function selectAll(metricSelected, metricNames, fileNames) {
    toggleSelection('array-', metricSelected, metricNames);
    toggleGloballyVisibility(fileNames, metricSelected, metricNames);
}

function toggleSelection(rootId, metricSelected, metricNames) {
    for (const metricName of metricNames) {
        document.getElementById(`${rootId}${metricName}`).className = 'not-selected';
    }
    document.getElementById(`${rootId}${metricSelected}`).className = 'selected';
}

function toggleGloballyVisibility(fileNames, metricSelected, metricNames) {
    for (const fileName of fileNames) {
        selectOne(fileName, metricSelected, metricNames);
    }
}

function selectOne(fileName, metricSelected, metricNames) {
    toggleSelection(`div-file-${fileName}-`, metricSelected, metricNames);
    toggleVisibilityForOneFile(fileName, metricSelected, metricNames);
}

function toggleVisibilityForOneFile(fileName, metricSelected, metricNames) {
    for (const metricName of metricNames) {
        document.getElementById(`tr-${fileName}-${metricName}`).style.display = 'none';
    }
    document.getElementById(`tr-${fileName}-${metricSelected}`).style.display = 'table';
}
