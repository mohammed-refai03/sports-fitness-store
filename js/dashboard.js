/* =======================================================
   STACKLY PLATFORM CORE DASHBOARD ENGINE (js/dashboard.js)
   Sports & Fitness Store Telemetry Engine
   ======================================================= */

window.dashboardApp = (() => {
  let userRole = null;
  let activeUser = null;
  let charts = {};

  // Color constants for Chart.js
  const COLORS = {
    primary: '#FF6B35',
    primaryLight: '#FF8C5A',
    primaryGlow: 'rgba(255, 107, 53, 0.1)',
    blue: '#3B82F6',
    blueLight: '#60A5FA',
    blueGlow: 'rgba(59, 130, 246, 0.1)',
    green: '#10B981',
    yellow: '#F59E0B',
    purple: '#8B5CF6',
    textDark: '#64748B',
    textBlack: '#0F172A',
    gridColor: '#E2E8F0',
    darkGridColor: '#334155'
  };

  // --- Sports & Fitness Store Mock Data ---
  const MOCK_DATA = {
    inventory: [
      { sku: 'STK-EQP-001', name: 'Pro-Duty Olympic Barbell 20kg', category: 'Strength', stock: 140, price: '$349.00', status: 'In Stock' },
      { sku: 'STK-EQP-002', name: 'Commercial Power Rack Heavy-Duty', category: 'Strength', stock: 28, price: '$1,299.00', status: 'In Stock' },
      { sku: 'STK-EQP-003', name: 'Titanium Smart Dumbbell Set (5-50 lbs)', category: 'Strength', stock: 65, price: '$649.00', status: 'In Stock' },
      { sku: 'STK-CAR-101', name: 'Hydro-Drive Pro Curved Treadmill', category: 'Cardio', stock: 12, price: '$2,499.00', status: 'Low Stock' },
      { sku: 'STK-CAR-102', name: 'Aerobic Magnetic Air Rower', category: 'Cardio', stock: 34, price: '$899.00', status: 'In Stock' },
      { sku: 'STK-NUT-301', name: 'Stackly Iso-Whey Protein Isolate 5lbs', category: 'Supplements', stock: 420, price: '$69.99', status: 'In Stock' },
      { sku: 'STK-NUT-302', name: 'BCAA Recovery Fuel Matrix (30 Servings)', category: 'Supplements', stock: 5, price: '$39.99', status: 'Low Stock' },
      { sku: 'STK-APP-501', name: 'Pro-Perform Moisture-Wicking Hoodie', category: 'Apparel', stock: 0, price: '$59.00', status: 'Out of Stock' }
    ],
    storeOrders: [
      { orderId: '#ORD-9021', customer: 'Gold Strength Gym', items: 'Commercial Power Racks (x4), Olympic Barbells (x6)', amount: '$7,290.00', carrier: 'FedEx Freight', status: 'Delivered', date: '2026-06-02' },
      { orderId: '#ORD-9022', customer: 'Metro Athletic Club', items: 'Curved Treadmills (x2), Air Rowers (x3)', amount: '$7,695.00', carrier: 'DHL Express', status: 'In Transit', date: '2026-06-03' },
      { orderId: '#ORD-9023', customer: 'Apex Training Center', items: 'Titanium Dumbbell Sets (x5)', amount: '$3,245.00', carrier: 'UPS Ground', status: 'Processing', date: '2026-06-03' },
      { orderId: '#ORD-9024', customer: 'Sarah Connor (Pro Athlete)', items: 'Stackly Iso-Whey 5lbs (x2), BCAA Fuel (x1)', amount: '$179.97', carrier: 'USPS Priority', status: 'Delivered', date: '2026-06-01' },
      { orderId: '#ORD-9025', customer: 'Velocity Fitness Hub', items: 'Pro-Duty Barbells (x10), Bumper Plates 45lbs (x20)', amount: '$5,980.00', carrier: 'FedEx Freight', status: 'Processing', date: '2026-06-03' }
    ],
    customers: [
      { name: 'Gold Strength Gym', email: 'procurement@goldstrength.com', type: 'Commercial Gym', ordersCount: 18, totalSpent: '$54,200', phone: '+1 (555) 304-9844', status: 'active' },
      { name: 'Metro Athletic Club', email: 'orders@metroathletics.com', type: 'Commercial Gym', ordersCount: 14, totalSpent: '$42,500', phone: '+1 (555) 777-1939', status: 'active' },
      { name: 'Velocity Fitness Hub', email: 'gear@velocityfit.net', type: 'Commercial Gym', ordersCount: 9, totalSpent: '$28,900', phone: '+1 (555) 888-0001', status: 'active' },
      { name: 'Sarah Connor', email: 'sarah@resistance.org', type: 'Pro Athlete', ordersCount: 6, totalSpent: '$1,850', phone: '+1 (555) 902-8347', status: 'active' },
      { name: 'Bruce Wayne', email: 'bruce@gotham.net', type: 'Pro Athlete', ordersCount: 12, totalSpent: '$14,200', phone: '+1 (555) 201-9874', status: 'active' }
    ],
    userOrders: [
      { orderId: '#STK-8812', item: 'Titanium Smart Dumbbell Set 50lbs', amount: '$649.00', status: 'Delivered', tracking: 'TRK-99021-X', date: '2026-05-28' },
      { orderId: '#STK-8845', item: 'Stackly Iso-Whey Protein Isolate 5lbs', amount: '$69.99', status: 'In Transit', tracking: 'TRK-44102-Y', date: '2026-06-01' },
      { orderId: '#STK-8890', item: 'Pro-Perform Moisture-Wicking Hoodie', amount: '$59.00', status: 'Processing', tracking: 'TRK-11204-Z', date: '2026-06-03' }
    ],
    userActivities: [
      { date: '2026-06-03 08:30', type: 'Speed Sprint Drill', duration: 45, burn: '520 kcal', complexity: 'Intermediate' },
      { date: '2026-06-02 17:15', type: 'Hypertrophy Powerlifting', duration: 60, burn: '480 kcal', complexity: 'Advanced' },
      { date: '2026-05-31 09:00', type: 'Aerobic Threshold Swim', duration: 50, burn: '440 kcal', complexity: 'Intermediate' }
    ],
    achievements: [
      { icon: 'fa-solid fa-trophy', title: 'Centurion Burner', desc: 'Burn over 1,000 kcal in a single day.', date: 'May 28, 2026' },
      { icon: 'fa-solid fa-fire', title: 'Stackly Streak', desc: 'Achieved a 7-day training consistency.', date: 'June 01, 2026' },
      { icon: 'fa-solid fa-dumbbell', title: 'Heavy Lifter Medal', desc: 'Successfully tracked 15 strength sessions.', date: 'June 03, 2026' },
      { icon: 'fa-solid fa-person-swimming', title: 'Aerobic Master', desc: 'Completed 10 endurance swim sessions.', date: 'June 02, 2026' }
    ]
  };

  // --- Initialize Storage ---
  const initLocalStorageData = () => {
    if (!localStorage.getItem('stackly_inventory')) {
      localStorage.setItem('stackly_inventory', JSON.stringify(MOCK_DATA.inventory));
    }
    if (!localStorage.getItem('stackly_store_orders')) {
      localStorage.setItem('stackly_store_orders', JSON.stringify(MOCK_DATA.storeOrders));
    }
    if (!localStorage.getItem('stackly_customers')) {
      localStorage.setItem('stackly_customers', JSON.stringify(MOCK_DATA.customers));
    }
    if (!localStorage.getItem('stackly_user_orders')) {
      localStorage.setItem('stackly_user_orders', JSON.stringify(MOCK_DATA.userOrders));
    }
    if (!localStorage.getItem('stackly_user_activities')) {
      localStorage.setItem('stackly_user_activities', JSON.stringify(MOCK_DATA.userActivities));
    }
    if (!localStorage.getItem('stackly_achievements')) {
      localStorage.setItem('stackly_achievements', JSON.stringify(MOCK_DATA.achievements));
    }
  };

  // --- Count-up Stat Numbers Animation ---
  const animateCountUp = (elementId, targetValue, duration = 1.5, format = '') => {
    const el = document.getElementById(elementId);
    if (!el) return;

    let obj = { val: 0 };
    gsap.to(obj, {
      val: targetValue,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (format === 'cals') {
          el.textContent = Math.floor(obj.val).toLocaleString();
        } else if (format === 'percent') {
          el.textContent = Math.floor(obj.val) + '%';
        } else if (format === 'currency') {
          el.textContent = '$' + Math.floor(obj.val).toLocaleString();
        } else {
          el.textContent = Math.floor(obj.val).toLocaleString();
        }
      }
    });
  };

  // --- Navigation Tab Switching Logic ---
  const setupNavTabs = () => {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const targetTab = item.getAttribute('data-tab');
        if (!targetTab) return;

        // Toggle active navigation buttons
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Toggle target pages
        const sections = document.querySelectorAll('.page-section');
        sections.forEach(sec => sec.classList.remove('active'));

        const activeSection = document.getElementById(`sect-${targetTab}`);
        if (activeSection) {
          activeSection.classList.add('active');

          gsap.from(activeSection.querySelectorAll('.info-card, .chart-card, .table-card, .stat-card, .profile-header-card, .settings-section'), {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            clearProps: "all"
          });
        }

        // Always scroll to top of window and content area when switching tab
        window.scrollTo(0, 0);
        const mainContent = document.querySelector('.main-content, .dashboard-main, .content-area');
        if (mainContent) mainContent.scrollTop = 0;
        if (activeSection) activeSection.scrollTop = 0;

        // Close mobile sidebar and restore scrolling
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          overlay.classList.remove('open');
          document.documentElement.style.overflow = "";
          document.body.style.overflow = "";
          document.body.style.touchAction = "";
        }
      });
    });
  };

  // --- Sidebar Mobile Toggle ---
  const setupMobileSidebar = () => {
    const btn = document.getElementById('navbarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('sidebarCloseBtn');

    if (!btn || !sidebar || !overlay) return;

    btn.addEventListener('click', () => {
      sidebar.classList.add('open');
      overlay.classList.add('open');
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    });

    const closeSidebar = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };

    overlay.addEventListener('click', closeSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  };

  // --- Render Dynamic Tables & Content ---
  const renderAllTables = () => {
    const listInventory = JSON.parse(localStorage.getItem('stackly_inventory')) || [];
    const listOrders = JSON.parse(localStorage.getItem('stackly_store_orders')) || [];
    const listCustomers = JSON.parse(localStorage.getItem('stackly_customers')) || [];
    const listUserOrders = JSON.parse(localStorage.getItem('stackly_user_orders')) || [];
    const listUserActivities = JSON.parse(localStorage.getItem('stackly_user_activities')) || [];

    // --- Admin Views ---
    if (userRole === 'admin') {
      // 1. Dashboard Tab: Recent Orders Table
      const recentTbody = document.getElementById('recentOrdersList');
      if (recentTbody) {
        recentTbody.innerHTML = '';
        listOrders.slice(0, 5).forEach((ord) => {
          let badgeClass = 'active';
          if (ord.status === 'Processing') badgeClass = 'pending';
          if (ord.status === 'In Transit') badgeClass = 'warning';

          const row = document.createElement('tr');
          row.innerHTML = `
            <td><strong>${ord.orderId}</strong></td>
            <td>
              <div class="avatar-name" style="font-weight:600;">${ord.customer}</div>
              <div style="font-size:11px; color:var(--text-mid);">${ord.date}</div>
            </td>
            <td>${ord.items}</td>
            <td><strong>${ord.amount}</strong></td>
            <td><span class="status-badge ${badgeClass}">${ord.status}</span></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="window.location.href='404.html'">Manage</button>
            </td>
          `;
          recentTbody.appendChild(row);
        });
      }

      // 2. Inventory Tab: Equipment Inventory Catalog Table
      const invTbody = document.getElementById('inventoryList');
      if (invTbody) {
        invTbody.innerHTML = '';
        listInventory.forEach((item) => {
          let statusBadge = '<span class="status-badge active">In Stock</span>';
          if (item.status === 'Low Stock') statusBadge = '<span class="status-badge warning">Low Stock</span>';
          if (item.status === 'Out of Stock') statusBadge = '<span class="status-badge inactive">Out of Stock</span>';

          const row = document.createElement('tr');
          row.innerHTML = `
            <td><code>${item.sku}</code></td>
            <td><strong>${item.name}</strong></td>
            <td><span class="role-badge user">${item.category}</span></td>
            <td><strong>${item.stock}</strong> units</td>
            <td>${item.price}</td>
            <td>${statusBadge}</td>
          `;
          invTbody.appendChild(row);
        });
      }

      // 3. Orders Tab: All Orders Table
      const ordersTbody = document.getElementById('adminOrdersList');
      if (ordersTbody) {
        ordersTbody.innerHTML = '';
        listOrders.forEach((ord) => {
          let badgeClass = 'active';
          if (ord.status === 'Processing') badgeClass = 'pending';
          if (ord.status === 'In Transit') badgeClass = 'warning';

          const row = document.createElement('tr');
          row.innerHTML = `
            <td><strong>${ord.orderId}</strong></td>
            <td>${ord.customer}</td>
            <td>${ord.items}</td>
            <td><strong>${ord.amount}</strong></td>
            <td><i class="fa-solid fa-truck" style="margin-right:4px; color:var(--primary);"></i> ${ord.carrier}</td>
            <td><span class="status-badge ${badgeClass}">${ord.status}</span></td>
          `;
          ordersTbody.appendChild(row);
        });
      }

      // 4. Customers Tab: Accounts Roster Table
      const custTbody = document.getElementById('customersList');
      if (custTbody) {
        custTbody.innerHTML = '';
        listCustomers.forEach((cust) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>
              <div class="table-avatar">
                <div class="avatar-circle" style="background:var(--gradient-primary)">${cust.name.charAt(0)}</div>
                <div>
                  <div class="avatar-name">${cust.name}</div>
                  <div class="avatar-email">${cust.email}</div>
                </div>
              </div>
            </td>
            <td><span class="role-badge user">${cust.type}</span></td>
            <td><strong>${cust.ordersCount}</strong> orders</td>
            <td><strong>${cust.totalSpent}</strong></td>
            <td>${cust.phone}</td>
            <td><span class="status-badge active">${cust.status}</span></td>
          `;
          custTbody.appendChild(row);
        });
      }

      // 5. Live Store Activity Feed
      const storeActsList = document.getElementById('recentStoreActivities');
      if (storeActsList) {
        storeActsList.innerHTML = `
          <div class="activity-item">
            <div class="activity-icon" style="background:var(--gradient-primary)"><i class="fa-solid fa-cart-shopping"></i></div>
            <div class="activity-info">
              <div class="activity-title">New Order #ORD-9025 placed by Velocity Fitness Hub</div>
              <div class="activity-meta">10x Olympic Barbells &bull; Value: $5,980.00</div>
            </div>
            <div class="activity-time">5m ago</div>
          </div>
          <div class="activity-item">
            <div class="activity-icon" style="background:var(--gradient-blue)"><i class="fa-solid fa-truck-fast"></i></div>
            <div class="activity-info">
              <div class="activity-title">Freight Shipment #ORD-9021 Delivered</div>
              <div class="activity-meta">Received by Gold Strength Gym warehouse manager.</div>
            </div>
            <div class="activity-time">1 hour ago</div>
          </div>
          <div class="activity-item">
            <div class="activity-icon" style="background:linear-gradient(135deg, #10B981, #34D399)"><i class="fa-solid fa-credit-card"></i></div>
            <div class="activity-info">
              <div class="activity-title">Payment Cleared ($7,695.00)</div>
              <div class="activity-meta">Metro Athletic Club account balance updated.</div>
            </div>
            <div class="activity-time">3 hours ago</div>
          </div>
        `;
      }

      // 6. Warehouse Alert Feed
      const alertsList = document.getElementById('warehouseAlertsList');
      if (alertsList) {
        alertsList.innerHTML = `
          <div class="activity-item">
            <div class="activity-icon" style="background:linear-gradient(135deg, #F59E0B, #FCD34D)"><i class="fa-solid fa-box-open"></i></div>
            <div class="activity-info">
              <div class="activity-title">Low Stock Alert: BCAA Recovery Fuel Matrix</div>
              <div class="activity-meta">Current level: 5 units left (Reorder point: 10 units)</div>
            </div>
            <div class="activity-time">Urgent</div>
          </div>
          <div class="activity-item">
            <div class="activity-icon" style="background:linear-gradient(135deg, #EF4444, #F87171)"><i class="fa-solid fa-circle-xmark"></i></div>
            <div class="activity-info">
              <div class="activity-title">Out of Stock: Pro-Perform Wicking Hoodie</div>
              <div class="activity-meta">Backorder queue: 14 pending requests</div>
            </div>
            <div class="activity-time">Action Needed</div>
          </div>
        `;
      }
    }

    // --- Athlete/User Views ---
    if (userRole === 'user') {
      // 1. User Gear Orders Table
      const userOrdTbody = document.getElementById('userOrdersList');
      if (userOrdTbody) {
        userOrdTbody.innerHTML = '';
        listUserOrders.forEach((ord) => {
          let badgeClass = 'active';
          if (ord.status === 'Processing') badgeClass = 'pending';
          if (ord.status === 'In Transit') badgeClass = 'warning';

          const row = document.createElement('tr');
          row.innerHTML = `
            <td><strong>${ord.orderId}</strong></td>
            <td>${ord.date}</td>
            <td><strong>${ord.item}</strong></td>
            <td>${ord.amount}</td>
            <td><span class="status-badge ${badgeClass}">${ord.status}</span></td>
            <td><code>${ord.tracking}</code></td>
          `;
          userOrdTbody.appendChild(row);
        });
      }

      // 2. User Activities List
      const actTbody = document.getElementById('userActivitiesList');
      if (actTbody) {
        actTbody.innerHTML = '';
        listUserActivities.forEach((a) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${a.date}</td>
            <td><strong>${a.type}</strong></td>
            <td>${a.duration} min</td>
            <td><span class="status-badge active">${a.burn}</span></td>
            <td>${a.complexity}</td>
            <td><span class="status-badge active">Synced</span></td>
          `;
          actTbody.appendChild(row);
        });
      }

      // 3. User Progress Timeline
      const timeline = document.getElementById('progressTimelineList');
      if (timeline) {
        timeline.innerHTML = '';
        listUserActivities.slice(0, 3).forEach((a) => {
          const item = document.createElement('div');
          item.className = 'activity-item';
          item.innerHTML = `
            <div class="activity-icon" style="background:var(--gradient-blue)"><i class="fa-solid fa-circle-check"></i></div>
            <div class="activity-info">
              <div class="activity-title">Completed ${a.type}</div>
              <div class="activity-meta">Burned ${a.burn} in ${a.duration} mins.</div>
            </div>
            <div class="activity-time">${a.date}</div>
          `;
          timeline.appendChild(item);
        });
      }

      // 4. Render Unlocked Achievements in Image 4 Green Marked Area
      const achGrid = document.getElementById('achievementsGrid');
      if (achGrid) {
        const listAchievements = JSON.parse(localStorage.getItem('stackly_achievements')) || MOCK_DATA.achievements;
        achGrid.innerHTML = '';
        listAchievements.forEach(ac => {
          const item = document.createElement('div');
          item.className = 'activity-item';
          item.innerHTML = `
            <div class="activity-icon" style="background:var(--gradient-primary)"><i class="${ac.icon}"></i></div>
            <div class="activity-info">
              <div class="activity-title">${ac.title}</div>
              <div class="activity-meta">${ac.desc}</div>
            </div>
            <div class="activity-time">${ac.date}</div>
          `;
          achGrid.appendChild(item);
        });
      }
    }
  };

  // --- Chart.js Initializers ---
  const initCharts = () => {
    const isDark = document.body.classList.contains('dark-mode');
    const gridColor = isDark ? COLORS.darkGridColor : COLORS.gridColor;

    if (userRole === 'admin') {
      // 1. Revenue Growth Line Chart
      const revCtx = document.getElementById('revenueGrowthChart');
      if (revCtx) {
        charts.revenueGrowth = new Chart(revCtx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Actual Store Revenue ($)',
              data: [45000, 62000, 88000, 105000, 118000, 128450],
              borderColor: COLORS.primary,
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
              tension: 0.4,
              fill: true,
              borderWidth: 3
            }, {
              label: 'Projected Target ($)',
              data: [40000, 55000, 75000, 95000, 110000, 125000],
              borderColor: COLORS.blue,
              borderDash: [5, 5],
              fill: false,
              borderWidth: 2
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 2. Sales by Product Category Doughnut Chart
      const catCtx = document.getElementById('categoryRevenueChart');
      if (catCtx) {
        charts.categoryRevenue = new Chart(catCtx, {
          type: 'doughnut',
          data: {
            labels: ['Strength Gear', 'Cardio Equipment', 'Supplements & Fuel', 'Apparel'],
            datasets: [{
              data: [45, 30, 15, 10],
              backgroundColor: [COLORS.primary, COLORS.blue, COLORS.green, COLORS.yellow],
              borderWidth: 0
            }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
        });
      }

      // 3. Top Selling Equipment Units Bar Chart
      const equipCtx = document.getElementById('equipmentSalesChart');
      if (equipCtx) {
        charts.equipmentSales = new Chart(equipCtx, {
          type: 'bar',
          data: {
            labels: ['Barbells', 'Dumbbells', 'Air Rowers', 'Treadmills', 'Iso-Whey'],
            datasets: [{
              label: 'Units Sold',
              data: [140, 95, 62, 38, 420],
              backgroundColor: COLORS.blue,
              borderRadius: 6
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 4. Equipment Inventory Category Bar Chart
      const invCatCtx = document.getElementById('inventoryCategoryChart');
      if (invCatCtx) {
        charts.invCategory = new Chart(invCatCtx, {
          type: 'bar',
          data: {
            labels: ['Strength SKUs', 'Cardio SKUs', 'Supplements SKUs', 'Apparel SKUs'],
            datasets: [{
              label: 'Stock Units',
              data: [2800, 1200, 1400, 440],
              backgroundColor: COLORS.primary,
              borderRadius: 6
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 5. Warehouse Capacity Doughnut Chart
      const whCapCtx = document.getElementById('warehouseCapacityChart');
      if (whCapCtx) {
        charts.whCapacity = new Chart(whCapCtx, {
          type: 'doughnut',
          data: {
            labels: ['Occupied Bay Capacity', 'Available Reserve Storage', 'In-Transit Docking'],
            datasets: [{
              data: [72, 21, 7],
              backgroundColor: [COLORS.blue, COLORS.green, COLORS.yellow],
              borderWidth: 0
            }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
        });
      }

      // 6. Daily Order Volume Line Chart
      const ordVolCtx = document.getElementById('orderVolumeChart');
      if (ordVolCtx) {
        charts.ordVolume = new Chart(ordVolCtx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Dispatched Consignments',
              data: [120, 185, 210, 190, 245, 310, 130],
              borderColor: COLORS.green,
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.3,
              fill: true
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 7. Shipping Carrier Share Doughnut Chart
      const carCtx = document.getElementById('carrierShareChart');
      if (carCtx) {
        charts.carrierShare = new Chart(carCtx, {
          type: 'doughnut',
          data: {
            labels: ['FedEx Freight', 'DHL Express', 'UPS Ground', 'USPS Priority'],
            datasets: [{
              data: [48, 28, 16, 8],
              backgroundColor: [COLORS.primary, COLORS.blue, COLORS.yellow, COLORS.purple],
              borderWidth: 0
            }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
        });
      }

      // 8. Monthly Account Growth Line Chart
      const custCtx = document.getElementById('customerGrowthChart');
      if (custCtx) {
        charts.custGrowth = new Chart(custCtx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Active Gym Accounts',
              data: [180, 220, 260, 290, 315, 342],
              borderColor: COLORS.blue,
              tension: 0.4,
              fill: false
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 9. Account Revenue Contribution Bar Chart
      const accRevCtx = document.getElementById('accountRevenueChart');
      if (accRevCtx) {
        charts.accRevenue = new Chart(accRevCtx, {
          type: 'bar',
          data: {
            labels: ['Commercial Gyms', 'Pro Athletes', 'Retail Athletes'],
            datasets: [{
              label: 'Revenue Contribution ($)',
              data: [820000, 280000, 140000],
              backgroundColor: [COLORS.primary, COLORS.blue, COLORS.green]
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 10. Server Telemetry Latency Line Chart (Settings)
      const latCtx = document.getElementById('serverLatencyChart');
      if (latCtx) {
        charts.serverLatency = new Chart(latCtx, {
          type: 'line',
          data: {
            labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
            datasets: [{
              label: 'API Request Latency (ms)',
              data: [14, 11, 15, 18, 12, 10],
              borderColor: COLORS.green,
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.3,
              fill: true
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 11. Fulfillment Velocity Bar Chart (Settings)
      const velCtx = document.getElementById('fulfillmentVelocityChart');
      if (velCtx) {
        charts.fulfillmentVel = new Chart(velCtx, {
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Shipments Dispatched',
              data: [142, 180, 210, 195, 240, 280, 160],
              backgroundColor: COLORS.primary,
              borderRadius: 6
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }
    }

    if (userRole === 'user') {
      // 1. User Workout Line Chart (Dashboard)
      const uCtx = document.getElementById('userWorkoutProgressChart');
      if (uCtx) {
        charts.userProgress = new Chart(uCtx, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Minutes Trained',
              data: [45, 60, 0, 50, 75, 90, 30],
              borderColor: COLORS.blue,
              backgroundColor: COLORS.blueGlow,
              fill: true,
              borderWidth: 3,
              tension: 0.4
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 2. Calories Burned Chart (Dashboard)
      const ucCtx = document.getElementById('userCaloriesBurnedChart');
      if (ucCtx) {
        charts.userCalories = new Chart(ucCtx, {
          type: 'bar',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Active Burn (kcal)',
              data: [380, 520, 0, 440, 650, 742, 280],
              backgroundColor: COLORS.primary,
              borderRadius: 6
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 3. Activity Distribution Doughnut (Dashboard)
      const uadCtx = document.getElementById('userActivityDistributionChart');
      if (uadCtx) {
        charts.userActDist = new Chart(uadCtx, {
          type: 'doughnut',
          data: {
            labels: ['Running & Speed', 'Powerlifting', 'Aerobic Swim'],
            datasets: [{
              data: [50, 35, 15],
              backgroundColor: [COLORS.blue, COLORS.primary, COLORS.green],
              borderWidth: 0
            }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
        });
      }

      // 4. Monthly Gear Expenditure Bar Chart (Gear & Orders)
      const gExpCtx = document.getElementById('gearExpenditureChart');
      if (gExpCtx) {
        charts.gearExp = new Chart(gExpCtx, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Gear Expenditure ($)',
              data: [120, 340, 210, 450, 649, 128],
              backgroundColor: COLORS.primary,
              borderRadius: 6
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 5. Gear Category Share Doughnut Chart (Gear & Orders)
      const gCatCtx = document.getElementById('gearCategoryShareChart');
      if (gCatCtx) {
        charts.gearCat = new Chart(gCatCtx, {
          type: 'doughnut',
          data: {
            labels: ['Strength Dumbbells', 'Supplements & Whey', 'Apparel & Wear'],
            datasets: [{
              data: [52, 33, 15],
              backgroundColor: [COLORS.blue, COLORS.primary, COLORS.green],
              borderWidth: 0
            }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
        });
      }

      // 6. Heart Rate & Cardio Intensity Curve Line Chart (Workout Telemetry)
      const hrCtx = document.getElementById('heartRateIntensityChart');
      if (hrCtx) {
        charts.hrIntensity = new Chart(hrCtx, {
          type: 'line',
          data: {
            labels: ['0m', '10m', '20m', '30m', '40m', '50m', '60m'],
            datasets: [{
              label: 'Heart Rate (BPM)',
              data: [110, 135, 155, 168, 174, 160, 125],
              borderColor: COLORS.primary,
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 7. Muscle Group Volume Bar Chart (Workout Telemetry)
      const mgCtx = document.getElementById('muscleGroupVolumeChart');
      if (mgCtx) {
        charts.muscleGroup = new Chart(mgCtx, {
          type: 'bar',
          data: {
            labels: ['Quads & Glutes', 'Back & Lats', 'Chest & Arms', 'Core & Abs'],
            datasets: [{
              label: 'Weekly Lift Volume (kg)',
              data: [4200, 3800, 3100, 1900],
              backgroundColor: COLORS.blue,
              borderRadius: 6
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 8. Hourly Calorie & Protein Intake Line Chart (Nutrition Tracker)
      const hNutrCtx = document.getElementById('hourlyNutrIntakeChart');
      if (hNutrCtx) {
        charts.hourlyNutr = new Chart(hNutrCtx, {
          type: 'line',
          data: {
            labels: ['08:00', '11:00', '14:00', '17:00', '20:00'],
            datasets: [{
              label: 'Protein Intake (g)',
              data: [40, 15, 55, 20, 25],
              borderColor: COLORS.green,
              tension: 0.3,
              fill: false
            }, {
              label: 'Energy (kcal)',
              data: [520, 200, 650, 340, 510],
              borderColor: COLORS.primary,
              borderDash: [5, 5],
              fill: false
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 9. Macro Balance Doughnut Chart (Nutrition Tracker)
      const mbCtx = document.getElementById('macroBalanceChart');
      if (mbCtx) {
        charts.macroBal = new Chart(mbCtx, {
          type: 'doughnut',
          data: {
            labels: ['Carbohydrates (310g)', 'Protein (210g)', 'Fats & Lipids (68g)'],
            datasets: [{
              data: [52, 35, 13],
              backgroundColor: [COLORS.blue, COLORS.primary, COLORS.green],
              borderWidth: 0
            }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
        });
      }

      // 10. Fitness Score Progression Line Chart (Profile)
      const ufsCtx = document.getElementById('userFitnessScoreChart');
      if (ufsCtx) {
        charts.userFitness = new Chart(ufsCtx, {
          type: 'line',
          data: {
            labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'],
            datasets: [{
              label: 'Endurance Score Index',
              data: [74, 76, 79, 82, 85, 88],
              borderColor: COLORS.green,
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.3,
              fill: true
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }

      // 11. Monthly Energy Burn Bar Chart (Profile)
      const uwpCtx = document.getElementById('userWeeklyPerformanceChart');
      if (uwpCtx) {
        charts.userPerformance = new Chart(uwpCtx, {
          type: 'bar',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Energy Burn (kcal)',
              data: [18000, 22000, 25000, 28000, 31000, 34000],
              backgroundColor: COLORS.primary,
              borderRadius: 6
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }
    }
  };

  // --- Search Filters Setup ---
  const setupTableSearch = () => {
    const bindSearch = (inputId, tableBodyId) => {
      const input = document.getElementById(inputId);
      if (input) {
        input.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase();
          const rows = document.querySelectorAll(`#${tableBodyId} tr`);
          rows.forEach(row => {
            row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
          });
        });
      }
    };

    bindSearch('recentOrdersSearch', 'recentOrdersList');
    bindSearch('inventorySearch', 'inventoryList');
    bindSearch('ordersSearch', 'adminOrdersList');
    bindSearch('customersSearch', 'customersList');
    bindSearch('userOrdersSearch', 'userOrdersList');
  };

  // --- Dynamic Table Sorting ---
  let sortDirection = {};
  const sortTable = (columnKey) => {
    const list = JSON.parse(localStorage.getItem('stackly_store_orders')) || [];
    sortDirection[columnKey] = !sortDirection[columnKey];

    list.sort((a, b) => {
      let valA = a[columnKey] || '';
      let valB = b[columnKey] || '';
      if (typeof valA === 'string') {
        return sortDirection[columnKey] 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      return sortDirection[columnKey] ? valA - valB : valB - valA;
    });

    localStorage.setItem('stackly_store_orders', JSON.stringify(list));
    renderAllTables();
  };

  // --- Profile Displays (Top Line: Email ID, Second Line: Role Name) ---
  const updateProfileDisplays = () => {
    activeUser = AUTH.getActiveUser();
    const storedEmail = localStorage.getItem('stackly_active_user_email') || (activeUser ? activeUser.email : null) || (userRole === 'admin' ? 'admin@stackly.com' : 'user@stackly.com');
    const storedRole = localStorage.getItem('stackly_active_user_role') || (userRole === 'admin' ? 'admin' : 'user');
    
    const displayEmail = storedEmail;
    const displayRole = storedRole === 'admin' ? 'Admin / Store Manager' : 'Customer User';
    const char = displayEmail.charAt(0).toUpperCase();

    // Side nav profile
    const sideName = document.getElementById('sidebarName');
    const sideAv = document.getElementById('sidebarAvatar');
    const sideRole = document.getElementById('sidebarRole');
    if (sideName) sideName.textContent = displayEmail;
    if (sideAv) sideAv.textContent = char;
    if (sideRole) sideRole.textContent = displayRole;

    // Top Nav Profile (Top line: Email ID, Second line: Role Title)
    const navName = document.getElementById('navName');
    const navAv = document.getElementById('navAvatar');
    const navEmail = document.getElementById('navEmail');
    if (navName) navName.textContent = displayEmail;
    if (navAv) navAv.textContent = char;
    if (navEmail) navEmail.textContent = displayRole;

    // Section 5 Big Profile Banner fields
    const settingsAvatar = document.getElementById('settingsAvatar');
    const settingsName = document.getElementById('settingsName');
    const settingsEmail = document.getElementById('settingsEmail');

    if (settingsAvatar) settingsAvatar.textContent = char;
    if (settingsName) settingsName.textContent = displayEmail;
    if (settingsEmail) settingsEmail.textContent = displayRole;

    const profileAvatarBig = document.getElementById('profileAvatarBig');
    const profileNameBig = document.getElementById('profileNameBig');
    const profileEmailBig = document.getElementById('profileEmailBig');

    if (profileAvatarBig) profileAvatarBig.textContent = char;
    if (profileNameBig) profileNameBig.textContent = displayEmail;
    if (profileEmailBig) profileEmailBig.textContent = displayRole;
  };

  return {
    init: (role) => {
      const entries = (performance.getEntriesByType && performance.getEntriesByType('navigation')) || [];
      const navType = entries.length > 0 ? entries[0].type : '';
      if (navType === 'reload') {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
      } else {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'auto';
        }
      }

      userRole = role;
      activeUser = AUTH.getActiveUser();

      initLocalStorageData();

      // Screen loader fadeout
      setTimeout(() => {
        const loader = document.getElementById(role === 'admin' ? 'adminLoader' : 'userLoader');
        if (loader) {
          gsap.to(loader, {
            opacity: 0,
            duration: 0.4,
            onComplete: () => {
              loader.style.display = 'none';
              gsap.from('.stat-card', {
                scale: 0.8,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'back.out(1.5)',
                clearProps: "all"
              });
            }
          });
        }
      }, 1000);

      // Populate dashboard count-up numbers
      if (role === 'admin') {
        animateCountUp('valMonthlyRevenue', 128450, 2, 'currency');
        animateCountUp('valTotalOrders', 1420);
        animateCountUp('valStockSKUs', 5840);
        animateCountUp('valActiveCustomers', 342);
        animateCountUp('valFulfillmentRate', 99, 1.5, 'percent');
      } else {
        animateCountUp('valCalories', 2850, 1.5, 'cals');
        animateCountUp('valSessions', 6);
        animateCountUp('valFitnessScore', 88);
        animateCountUp('valWeeklyProgress', 85, 1.5, 'percent');
        animateCountUp('valAchievements', 4);
      }

      updateProfileDisplays();

      setupNavTabs();
      setupMobileSidebar();
      renderAllTables();
      initCharts();
      setupTableSearch();

      if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
          max: 6,
          speed: 300,
          glare: true,
          "max-glare": 0.05
        });
      }

      const logout = document.getElementById('logoutBtn');
      if (logout) {
        logout.addEventListener('click', () => {
          setTimeout(() => AUTH.logout(), 500);
        });
      }
    },

    sortTable: (key) => sortTable(key)
  };
})();
