document.getElementById('issueForm').addEventListener('submit', addIssue);

function addIssue(e) {
    e.preventDefault();

    const issueTitle = document.getElementById('issueTitle').value;
    const issueDescription = document.getElementById('issueDescription').value;
    const issuePriority = document.getElementById('issuePriority').value;

    const issue = {
        id: generateTicketNumber(),
        title: issueTitle,
        description: issueDescription,
        priority: issuePriority,
        status: 'Open',
        createdAt: new Date().toLocaleString()
    };

    let issues = JSON.parse(localStorage.getItem('issues')) || [];
    issues.push(issue);
    localStorage.setItem('issues', JSON.stringify(issues));

    document.getElementById('issueForm').reset();
    fetchIssues();
}

function generateTicketNumber() {
    return 'ISSUE-' + Math.floor(Math.random() * 100000);
}

function fetchIssues() {
    let issues = JSON.parse(localStorage.getItem('issues')) || [];
    issues = issues.filter(issue => issue.title && issue.description && issue.priority && issue.status); // Clear undefined issues

    const issuesList = document.getElementById('issuesList');
    const filterStatus = document.getElementById('filterStatus').value;
    const filterPriority = document.getElementById('filterPriority').value;

    issuesList.innerHTML = '';

    for (const issue of issues) {
        if ((filterStatus !== 'All' && issue.status !== filterStatus) || (filterPriority !== 'All' && issue.priority !== filterPriority)) {
            continue;
        }

        const issueElement = document.createElement('div');
        issueElement.className = 'issue';
        issueElement.innerHTML = `
            <h3>${issue.title} <span class="ticket-number">(${issue.id})</span></h3>
            <p><strong>Status:</strong> ${issue.status}</p>
            <p><strong>Priority:</strong> ${issue.priority}</p>
            <p>${issue.description}</p>
            <p><strong>Created At:</strong> ${issue.createdAt}</p>
            <select onchange="updateIssueStatus('${issue.id}', this.value)">
                <option value="Open" ${issue.status === 'Open' ? 'selected' : ''}>Open</option>
                <option value="In Progress" ${issue.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Closed" ${issue.status === 'Closed' ? 'selected' : ''}>Closed</option>
            </select>
            <button class="update" onclick="editIssue('${issue.id}')">Edit</button>
            <button class="delete" onclick="confirmDeleteIssue('${issue.id}')">Delete</button>
        `;
        issuesList.appendChild(issueElement);
    }
}

function updateIssueStatus(id, status) {
    let issues = JSON.parse(localStorage.getItem('issues')) || [];

    for (const issue of issues) {
        if (issue.id === id) {
            issue.status = status;
            break;
        }
    }

    localStorage.setItem('issues', JSON.stringify(issues));
    fetchIssues();
}

function editIssue(id) {
    let issues = JSON.parse(localStorage.getItem('issues')) || [];
    const issue = issues.find(issue => issue.id === id);

    if (issue) {
        document.getElementById('issueTitle').value = issue.title;
        document.getElementById('issueDescription').value = issue.description;
        document.getElementById('issuePriority').value = issue.priority;

        issues = issues.filter(issue => issue.id !== id);
        localStorage.setItem('issues', JSON.stringify(issues));
    }
}

function confirmDeleteIssue(id) {
    if (confirm('Are you sure you want to delete this issue?')) {
        deleteIssue(id);
    }
}

function deleteIssue(id) {
    let issues = JSON.parse(localStorage.getItem('issues')) || [];

    issues = issues.filter(issue => issue.id !== id);

    localStorage.setItem('issues', JSON.stringify(issues));
    fetchIssues();
}

window.onload = fetchIssues;