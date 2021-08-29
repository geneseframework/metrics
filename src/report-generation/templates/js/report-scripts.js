function selectAll(metricSelected, metricNames, codeSnippetNames) {
    toggleSelection('array-', metricSelected, metricNames);
    toggleGloballyVisibility(codeSnippetNames, metricSelected, metricNames);
}

function toggleSelection(rootId, metricSelected, metricNames) {
    for (const metricName of metricNames) {
        document.getElementById(`${rootId}${metricName}`).className = 'not-selected';
    }
    document.getElementById(`${rootId}${metricSelected}`).className = 'selected';
}

function toggleGloballyVisibility(codeSnippetNames, metricSelected, metricNames) {
    for (const codeSnippetName of codeSnippetNames) {
        selectOne(codeSnippetName, metricSelected, metricNames);
    }
}

function selectOne(codeSnippetName, metricSelected, metricNames) {
    toggleSelection(`div-snippet-${codeSnippetName}-`, metricSelected, metricNames);
    toggleVisibilityForOneFile(codeSnippetName, metricSelected, metricNames);
}

function toggleVisibilityForOneFile(codeSnippetName, metricSelected, metricNames) {
    for (const metricName of metricNames) {
        document.getElementById(`tr-${codeSnippetName}-${metricName}`).style.display = 'none';
    }
    document.getElementById(`tr-${codeSnippetName}-${metricSelected}`).style.display = 'table';
}
