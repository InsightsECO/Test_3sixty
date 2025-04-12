// panel.js
function loadModule(moduleName) {
    // Load the corresponding HTML into #module-content
    fetch(`modules/${moduleName}.html`)
      .then(res => res.text())
      .then(html => {
        document.getElementById("module-content").innerHTML = html;
      });
  
    // Update sidebar active class
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const items = document.querySelectorAll('.nav-item');
    items.forEach(item => {
      if (item.textContent.includes(moduleName.replace('-', ' '))) {
        item.classList.add('active');
      }
    });
  }
  
  // Load default module
  window.onload = () => loadModule('manage-project');
  
  document.getElementById('calculateBtn').addEventListener('click', () => {
    const value = parseFloat(document.getElementById('estimatedValue').value);
    const duration = parseInt(document.getElementById('duration').value);
    const prob = parseFloat(document.getElementById('probability').value);
    const startDateStr = document.getElementById('startDate').value;
  
    if (isNaN(value) || isNaN(duration) || isNaN(prob) || !startDateStr) {
      alert('Please fill all fields.');
      return;
    }
  
    const weightedRevenue = (value * prob) / duration;
    document.getElementById('revenuePerMonth').innerText = `€ ${weightedRevenue.toFixed(2)} / month`;
  
    // Generate month-by-month allocation
    const startDate = new Date(startDateStr);
    const tableBody = document.querySelector('#monthlyAllocationTable tbody');
    tableBody.innerHTML = '';
  
    for (let i = 0; i < duration; i++) {
      const d = new Date(startDate);
      d.setMonth(startDate.getMonth() + i);
      const monthLabel = d.toLocaleString('default', { month: 'short', year: 'numeric' });
  
      const row = `<tr><td>${monthLabel}</td><td>€ ${weightedRevenue.toFixed(2)}</td></tr>`;
      tableBody.insertAdjacentHTML('beforeend', row);
    }
  });
  function submitProjectToFirebase() {
    const estimatedValue = parseFloat(document.getElementById('estimatedValue').value);
    const duration = parseInt(document.getElementById('duration').value);
    const probability = parseFloat(document.getElementById('probability').value);
    const startDate = document.getElementById('startDate').value;
  
    const monthlyRevenue = ((estimatedValue * probability) / duration).toFixed(2);
  
    const monthlyBreakdown = [];
    const sDate = new Date(startDate);
    for (let i = 0; i < duration; i++) {
      const d = new Date(sDate);
      d.setMonth(sDate.getMonth() + i);
      const label = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyBreakdown.push({
        month: label,
        revenue: parseFloat(monthlyRevenue)
      });
    }
  
    const projectData = {
      estimatedValue,
      duration,
      probability,
      startDate,
      weightedRevenuePerMonth: parseFloat(monthlyRevenue),
      monthlyRevenueAllocation: monthlyBreakdown,
      createdAt: new Date().toISOString()
    };
  
    // Example Firebase push (adjust to your config)
    firebase.firestore().collection('projects').add(projectData)
      .then(() => alert('Project saved with revenue breakdown!'))
      
      .catch(error => console.error('Error:', error));
  }
  firebase.firestore().collection('projects').add(projectData)
  .then(() => {
    alert('Project saved with revenue breakdown!');
    updateRevenueTable(projectData); // ✅ Update the revenue table here
  })
  .catch(error => console.error('Error:', error));

    // Dynamic Weighted Revenue Calculation
const inputsToWatch = ['estimatedValue', 'probability', 'duration'];
inputsToWatch.forEach(id => {
  document.getElementById(id).addEventListener('input', updateRevenueField);
});

function updateRevenueField() {
  const estimatedValue = parseFloat(document.getElementById('estimatedValue').value);
  const probability = parseFloat(document.getElementById('probability').value);
  const duration = parseInt(document.getElementById('duration').value);
  const revenueInput = document.getElementById('revenue');

  if (!isNaN(estimatedValue) && !isNaN(probability) && !isNaN(duration) && duration > 0) {
    const weightedRevenue = (estimatedValue * probability) / duration;
    revenueInput.value = weightedRevenue.toFixed(2);
  } else {
    revenueInput.value = '';
  }
}

function updateCalculations() {
  const estimatedValue = parseFloat(document.getElementById('estimatedValue').value) || 0;
  const probability = parseFloat(document.getElementById('probability').value) || 0;
  const duration = parseInt(document.getElementById('duration').value) || 0;
  const startDate = document.getElementById('startDate').value;

  // Calculate Weighted Revenue
  let weightedRevenue = 0;
  if (probability >= 0.75 && duration > 0) {
    weightedRevenue = (estimatedValue * probability) / duration;
  }
  document.getElementById('revenue').value = weightedRevenue.toFixed(2);

  // Update Monthly Breakdown
  if (startDate && duration > 0) {
    updateMonthlyBreakdown(startDate, duration, weightedRevenue);
  }

  if (startDate && duration > 0) {
    const breakdownArray = updateMonthlyBreakdown(startDate, duration, weightedRevenue);
    monthlyBreakdown = breakdownArray; // capture it globally or pass into projectData
  }
  
}

// Monthly Revenue Timeline Logic
function updateMonthlyBreakdown(startDate, duration, monthlyRevenue) {
  const breakdownContainer = document.getElementById('monthlyBreakdown');
  breakdownContainer.innerHTML = '';

  const breakdownArray = [];
  const start = new Date(startDate);

  for (let i = 0; i < duration; i++) {
    const monthDate = new Date(start);
    monthDate.setMonth(start.getMonth() + i);
    const monthLabel = monthDate.toLocaleString('default', { month: 'short', year: 'numeric' });

    breakdownArray.push(monthlyRevenue); // Push value for table use

    const monthElement = document.createElement('div');
    monthElement.className = 'month-entry';
    monthElement.innerHTML = `${monthLabel}: €${monthlyRevenue.toFixed(2)}`;
    breakdownContainer.appendChild(monthElement);
  }

  return breakdownArray; // ✅ new
}


// Toggle visibility
document.getElementById("toggleRevenueTable").addEventListener("click", () => {
  const container = document.getElementById("revenueTableContainer");
  const btn = document.getElementById("toggleRevenueTable");

  if (container.style.display === "none") {
    container.style.display = "block";
    btn.innerText = "Hide Monthly Revenue Table";
  } else {
    container.style.display = "none";
    btn.innerText = "Show Monthly Revenue Table";
  }
});


const projectName = document.getElementById("projectName").value;
const customerName = document.getElementById("customerName").value;

const projectData = {
  projectName,
  customerName,
  estimatedValue,
  duration,
  probability,
  startDate,
  weightedRevenuePerMonth: parseFloat(monthlyRevenue),
  monthlyRevenueAllocation: monthlyBreakdown,
  createdAt: new Date().toISOString()
};

function updateRevenueTable(projectData) {
  const headerRow = document.getElementById("revenueTableHeader");
  const body = document.getElementById("revenueTableBody");

  // Clear header (except the first 2 columns)
  while (headerRow.children.length > 2) {
    headerRow.removeChild(headerRow.lastChild);
  }

  // Create month headers dynamically
  const start = new Date(projectData.startDate);
  for (let i = 0; i < projectData.duration; i++) {
    const month = new Date(start);
    month.setMonth(start.getMonth() + i);
    const monthLabel = month.toLocaleString('default', { month: 'short', year: 'numeric' });

    const th = document.createElement("th");
    th.innerText = monthLabel;
    headerRow.appendChild(th);
  }

  // Create the row with project and customer names
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${projectData.projectName}</td>
    <td>${projectData.customerName}</td>
  `;

  // Add revenue per month dynamically from allocation
  for (let i = 0; i < projectData.monthlyRevenueAllocation.length; i++) {
    const td = document.createElement("td");
    td.innerText = "€" + parseFloat(projectData.monthlyRevenueAllocation[i]).toFixed(2);
    row.appendChild(td);
  }

  body.appendChild(row);
}
