
let currentRole = 'customer';

function setRole(role, el) {
  currentRole = role;
  document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function doLogin() {
  const destinations = {
    customer: 'page-customer-shop',
    staff: 'page-staff',
    admin: 'page-admin',
    owner: 'page-owner'
  };
  navigate(destinations[currentRole] || 'page-customer-shop');
}

function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }
}

function showAdminTab(tab, navEl) {
  const tabs = ['dashboard','products','orders','customers','staff','categories','inventory'];
  tabs.forEach(t => {
    const el = document.getElementById('admin-tab-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('#page-admin .nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
  const titles = {
    dashboard: 'Tổng quan',
    products: 'Quản lý sản phẩm',
    orders: 'Quản lý đơn hàng',
    customers: 'Khách hàng',
    staff: 'Nhân viên',
    categories: 'Danh mục',
    inventory: 'Kho hàng'
  };
  const titleEl = document.getElementById('admin-page-title');
  if (titleEl) titleEl.textContent = titles[tab] || 'Tổng quan';
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
function closeModalOutside(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}
