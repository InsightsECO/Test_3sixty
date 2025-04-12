// script.js
const navLinks = document.querySelectorAll('.nav-links li');
const contentSections = document.querySelectorAll('.content-section');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Remove active from all
    navLinks.forEach(item => item.classList.remove('active'));
    contentSections.forEach(sec => sec.classList.remove('active-section'));

    // Set current as active
    link.classList.add('active');
    const sectionId = link.getAttribute('data-section');
    document.getElementById(sectionId).classList.add('active-section');
  });
});

// New function to update revenue timeline
function updateRevenueTimeline() {
  const timelineBody = document.getElementById('timelineBody');
  const timelineHeaders = document.getElementById('timelineHeaders');

  // Get all unique months across all projects
  const allMonths = projectsData.flatMap(project => 
    project.monthlyRevenues.map(m => m.month)
  );
  const uniqueMonths = [...new Set(allMonths)].sort();

  // Update table headers
  timelineHeaders.innerHTML = `
    <th>Project Name</th>
    <th>Customer Name</th>
    ${uniqueMonths.map(month => `<th>${month}</th>`).join('')}
  `;

  // Update table body
  timelineBody.innerHTML = projectsData.map(project => {
    const monthlyData = uniqueMonths.map(month => {
      const revenue = project.monthlyRevenues.find(m => m.month === month);
      return `<td>${revenue ? `€${revenue.revenue.toFixed(2)}` : ''}</td>`;
    }).join('');

    return `
      <tr>
        <td>${project.projectName}</td>
        <td>${project.customerName}</td>
        ${monthlyData}
      </tr>
    `;
  }).join('');
}

// Monthly Revenue Timeline Logic
function updateMonthlyBreakdown(startDate, duration, monthlyRevenue) {
const breakdownContainer = document.getElementById('monthlyBreakdown');
breakdownContainer.innerHTML = '';

const start = new Date(startDate);
for (let i = 0; i < duration; i++) {
const monthDate = new Date(start);
monthDate.setMonth(start.getMonth() + i);

const monthElement = document.createElement('div');
monthElement.className = 'month-entry';
monthElement.innerHTML = `
  ${monthDate.toLocaleString('default', { month: 'short', year: 'numeric' })}: 
  €${monthlyRevenue.toFixed(2)}
`;

breakdownContainer.appendChild(monthElement);
}
}
