const IMAGE = 'https://coding-platform.s3.amazonaws.com/dev/lms/tickets/5e80fcb6-3f8e-480c-945b-30a5359eb40e/JNmYjkVr3WOjsrbu.png';

let fleets = JSON.parse(localStorage.getItem('fleets') || '[]');

const els = {
  container: document.getElementById('cardsContainer'),
  regNo: document.getElementById('regNo'),
  category: document.getElementById('category'),
  driver: document.getElementById('driver'),
  isAvailable: document.getElementById('isAvailable'),
  addFleet: document.getElementById('addFleet'),
  filterCategory: document.getElementById('filterCategory'),
  filterAvailability: document.getElementById('filterAvailability'),
  clearFilters: document.getElementById('clearFilters')
};

function save() {
  localStorage.setItem('fleets', JSON.stringify(fleets));
}

function render(filtered) {
  const data = filtered || fleets;
  els.container.innerHTML = '';
  if (data.length === 0) {
    els.container.innerHTML = '<div class="card">No vehicles yet. Add some from sidebar.</div>';
    return;
  }

  data.forEach((v, idx) => {
    const div = document.createElement('div');
    div.className = 'card-item';
    div.innerHTML = `
      <img src="${IMAGE}" alt="vehicle">
      <div class="meta"><b>Reg No:</b> ${v.reg}</div>
      <div class="meta"><b>Category:</b> ${v.category}</div>
      <div class="meta"><b>Driver:</b> ${v.driver || '<i>Not set</i>'}</div>
      <div class="meta"><b>Availability:</b> ${v.available ? 'Available' : 'Unavailable'}</div>
      <div class="actions">
        <button class="update">Update Driver</button>
        <button class="toggle">${v.available ? 'Make Unavailable' : 'Make Available'}</button>
        <button class="delete">Delete</button>
      </div>
    `;

    div.querySelector('.update').addEventListener('click', () => {
      const name = prompt('Enter new driver name:', v.driver || '');
      if (name === null) return;
      if (!name.trim()) {
        alert('Driver name cannot be empty.');
        return;
      }
      fleets[idx].driver = name.trim();
      save();
      applyFilters();
    });

    div.querySelector('.toggle').addEventListener('click', () => {
      fleets[idx].available = !fleets[idx].available;
      save();
      applyFilters();
    });

    div.querySelector('.delete').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this vehicle?')) {
        fleets.splice(idx, 1);
        save();
        applyFilters();
      }
    });

    els.container.appendChild(div);
  });
}

function validateInput(reg, driver) {
  if (!reg.trim()) {
    alert('Reg No required');
    return false;
  }
  if (!driver.trim()) {
    alert('Driver required');
    return false;
  }
  return true;
}

els.addFleet.addEventListener('click', (e) => {
  e.preventDefault();
  const reg = els.regNo.value || '';
  const category = els.category.value;
  const driver = els.driver.value || '';
  const available = els.isAvailable.checked;

  if (!validateInput(reg, driver)) return;

  fleets.push({
    reg: reg.trim(),
    category,
    driver: driver.trim(),
    available
  });

  save();
  els.regNo.value = '';
  els.driver.value = '';
  els.isAvailable.checked = true;
  applyFilters();
});

function applyFilters() {
  const cat = els.filterCategory.value;
  const av = els.filterAvailability.value;
  let res = fleets.slice();

  if (cat && cat !== 'All') {
    res = res.filter(r => r.category === cat);
  }

  if (av && av !== 'All') {
    res = res.filter(r => (av === 'Available') ? r.available : !r.available);
  }

  render(res);
}

els.filterCategory.addEventListener('change', applyFilters);
els.filterAvailability.addEventListener('change', applyFilters);
els.clearFilters.addEventListener('click', () => {
  els.filterCategory.value = 'All';
  els.filterAvailability.value = 'All';
  applyFilters();
});

render();