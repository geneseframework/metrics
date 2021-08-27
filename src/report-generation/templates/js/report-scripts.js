function selectAll(metricName, isSelected, metricNames) {
    console.log('ZZZZZZ', metricName);
    console.log('ZZZZZZ isSelected', isSelected);
    console.log('ZZZZZZssss', metricNames);
    for (const name of metricNames) {
        document.getElementById(`all-${name}`).className = 'not-selected';
    }
    document.getElementById(`all-${metricName}`).className = 'selected';
}
