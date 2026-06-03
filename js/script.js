
(() => {
  /* ───── CUSTOM CURSOR: dùng chung cho trang chủ + đăng kí ───── */
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (cursor) cursor.style.transform = `translate(${mx - 7}px, ${my - 7}px)`;
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    if (ring) ring.style.transform = `translate(${rx - 19}px, ${ry - 19}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  function setHover(on) {
    if (!cursor || !ring) return;
    cursor.classList.toggle('is-hover', on);
    ring.classList.toggle('is-hover', on);
  }

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a,button,input,select,textarea,label,[onclick],.feat-card,.role-card,.member-card,.step-item,.dash-order,.product-card,.cart-item,.admin-stat,.staff-card,.app-card')) setHover(true);
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a,button,input,select,textarea,label,[onclick],.feat-card,.role-card,.member-card,.step-item,.dash-order,.product-card,.cart-item,.admin-stat,.staff-card,.app-card')) setHover(false);
  });

  /* ───── PAGE NAVIGATION ───── */
  window.goAuth = function(tab = 'register') {
    document.getElementById('pageLanding')?.classList.remove('active');
    document.getElementById('pageAuth')?.classList.add('active');
    switchForm(tab || 'register');
    history.replaceState(null, '', '#auth');
    window.scrollTo(0, 0);
  };

  window.goLanding = function() {
    document.getElementById('pageAuth')?.classList.remove('active');
    document.getElementById('pageLanding')?.classList.add('active');
    history.replaceState(null, '', location.pathname);
    window.scrollTo(0, 0);
  };

  window.scrollToSection = function(id) {
    const go = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (!document.getElementById('pageLanding')?.classList.contains('active')) {
      goLanding();
      requestAnimationFrame(() => requestAnimationFrame(go));
    } else {
      go();
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#auth') {
        e.preventDefault();
        goAuth(a.classList.contains('nav-cta') ? 'register' : 'login');
        return;
      }
      if (href && href.length > 1) {
        const id = href.slice(1);
        if (document.getElementById(id)) {
          e.preventDefault();
          scrollToSection(id);
        }
      }
    });
  });

  /* ───── LANDING INTERACTIONS ───── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  function animateCounter(el, target, duration = 1500) {
    if (el.dataset.done === '1') return;
    el.dataset.done = '1';
    let start = 0;
    const step = Math.max(1, target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target + '+';
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start);
      }
    }, 16);
  }

  const statsSection = document.getElementById('stats');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('#stats .stat-num[data-target]').forEach(num => {
            animateCounter(num, parseInt(num.dataset.target, 10) || 0);
          });
          statsObs.disconnect();
        }
      });
    }, { threshold: 0.5 });
    statsObs.observe(statsSection);
  }

  const particles = document.getElementById('particles');
  if (particles && particles.children.length === 0) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${40 + Math.random() * 50}%;
        animation-delay: ${Math.random() * 6}s;
        animation-duration: ${4 + Math.random() * 4}s;
        width: ${3 + Math.random() * 4}px;
        height: ${3 + Math.random() * 4}px;
      `;
      particles.appendChild(p);
    }
  }

  document.querySelectorAll('.nav-links a:not(.nav-cta)').forEach(link => {
    link.addEventListener('click', function() {
      document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ───── AUTH FORM LOGIC ───── */
  window.switchForm = function(name = 'login') {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));

    const key = name.charAt(0).toUpperCase() + name.slice(1);
    const form = document.getElementById('form' + key);
    if (form) form.classList.add('active');

    const tabs = document.getElementById('authTabs');
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    if (!tabs) return;

    if (name === 'login') {
      tabLogin?.classList.add('active');
      tabs.style.display = 'flex';
    } else if (name === 'register') {
      tabRegister?.classList.add('active');
      tabs.style.display = 'flex';
    } else {
      tabs.style.display = 'none';
    }
  };

  window.togglePwd = function(id, btn) {
    const inp = document.getElementById(id);
    if (!inp) return;
    if (inp.type === 'password') {
      inp.type = 'text';
      if (btn) btn.textContent = '🙈';
    } else {
      inp.type = 'password';
      if (btn) btn.textContent = '👁';
    }
  };

  window.checkPwdStrength = function(val) {
    const bar = document.getElementById('pwdBar');
    const hint = document.getElementById('pwdHint');
    if (!bar || !hint) return;
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
    const labels = ['Quá yếu', 'Yếu', 'Trung bình', 'Mạnh'];
    bar.style.width = (s * 25) + '%';
    bar.style.background = colors[s - 1] || '#e5e7eb';
    hint.textContent = val.length === 0 ? 'Nhập mật khẩu để kiểm tra độ mạnh' : (labels[s - 1] || '');
  };

  window.handleLogin = function(btn) {
    const email = document.getElementById('loginEmail')?.value.trim() || '';
    const pwd = document.getElementById('loginPwd')?.value || '';
    if (!email || !pwd) return showToast('⚠️ Vui lòng điền đầy đủ thông tin!', 'warn');
    if (!email.includes('@')) return showToast('⚠️ Email không hợp lệ!', 'warn');
    btn.innerHTML = '<span class="spinner"></span>';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '🔑 Đăng nhập';
      btn.disabled = false;
      showToast('✅ Đăng nhập thành công! Chào mừng bạn trở lại!', 'success');
    }, 900);
  };

  window.handleRegister = function(btn) {
    const ln = document.getElementById('regLastName')?.value.trim() || '';
    const fn = document.getElementById('regFirstName')?.value.trim() || '';
    const email = document.getElementById('regEmail')?.value.trim() || '';
    const pwd = document.getElementById('regPwd')?.value || '';
    const terms = document.getElementById('regTerms')?.checked;
    if (!ln || !fn || !email || !pwd) return showToast('⚠️ Vui lòng điền đầy đủ thông tin!', 'warn');
    if (!email.includes('@')) return showToast('⚠️ Email không hợp lệ!', 'warn');
    if (pwd.length < 8) return showToast('⚠️ Mật khẩu cần ít nhất 8 ký tự!', 'warn');
    if (!terms) return showToast('⚠️ Vui lòng đồng ý với điều khoản!', 'warn');
    btn.innerHTML = '<span class="spinner"></span>';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '🛒 Tạo tài khoản khách hàng';
      btn.disabled = false;
      showToast('🎉 Tạo tài khoản thành công! Chào mừng bạn đến StyleShop!', 'success');
    }, 1000);
  };

  window.handleForgot = function(btn) {
    const email = document.getElementById('forgotEmail')?.value.trim() || '';
    if (!email || !email.includes('@')) return showToast('⚠️ Vui lòng nhập email hợp lệ!', 'warn');
    btn.innerHTML = '<span class="spinner"></span>';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '📧 Gửi link đặt lại mật khẩu';
      btn.disabled = false;
      showToast('📬 Đã gửi email! Kiểm tra hộp thư của bạn.', 'success');
    }, 900);
  };

  window.handleAdminLogin = function(btn) {
    const email = document.getElementById('adminEmail')?.value.trim() || '';
    const pwd = document.getElementById('adminPwd')?.value || '';
    const role = document.getElementById('adminRole')?.value || 'admin';
    if (!email || !pwd) return showToast('⚠️ Vui lòng điền đầy đủ thông tin!', 'warn');
    if (!email.includes('@')) return showToast('⚠️ Email không hợp lệ!', 'warn');
    btn.innerHTML = '<span class="spinner"></span>';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '🛠️ Đăng nhập hệ thống quản trị';
      btn.disabled = false;
      const names = { owner: 'Chủ shop', admin: 'Quản lý', staff: 'Nhân viên' };
      showToast('✅ Đăng nhập thành công! Chào ' + (names[role] || 'bạn') + '!', 'success');
    }, 1000);
  };

  window.socialLogin = function(provider) {
    showToast('🔗 Kết nối ' + provider + ' đang được cập nhật...', 'info');
  };

  window.showToast = function(msg, type = 'success') {
    const t = document.getElementById('toast');
    if (!t) return;
    const colors = { success: 'var(--teal-deeper)', warn: '#d97706', info: '#6366f1' };
    t.style.background = colors[type] || colors.success;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3200);
  };


  /* ═══════════════════════════════════
     WEB APP CUSTOMER + ADMIN LOGIC - PRO UPGRADE
  ═══════════════════════════════════ */
  let currentRole = 'customer';
  const ADMIN_DEMO = { email: 'admin@styleshop.vn', password: 'admin123' };
  const VIP_LEVELS = [
    {name:'Member', icon:'🌿', min:0, next:500000},
    {name:'Silver', icon:'🥈', min:500000, next:1500000},
    {name:'Gold', icon:'🥇', min:1500000, next:3000000},
    {name:'Diamond', icon:'💎', min:3000000, next:null}
  ];
  const cuteAvatars = ['🐱','🐶','🐰','🐼','🦊','🐻','🐨','🐯','🐸','🐹'];
  let currentUser = {name:'Khách hàng StyleShop', email:'customer@styleshop.vn', avatar:'🐱', password:'12345678'};
  let customerAddress = { phone:'0900000000', address:'Bình Thuận - địa chỉ demo', note:'Giao giờ hành chính' };
  let activeCoupon = null;
  const COUPONS = {
    MINT10:{code:'MINT10', label:'Giảm 10% đơn hàng', type:'percent', value:.10, min:0},
    FREESHIP499:{code:'FREESHIP499', label:'Miễn phí giao hàng từ 499k', type:'ship', value:30000, min:499000},
    VIPSTYLE:{code:'VIPSTYLE', label:'Giảm thêm 5% cho thành viên', type:'percent', value:.05, min:0}
  };
  let wishlist = [];


  // Product images are self-created SVG mockups with white background, embedded directly in this one-file HTML demo.
  // This keeps product names and visuals consistent without needing an external images folder.
  function svgUri(svg){ return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg); }
  function productImage(type, primary, secondary, label){
    const safeLabel = String(label || 'StyleShop').replace(/[<>&]/g, '');
    const shadow = `<ellipse cx="160" cy="252" rx="76" ry="13" fill="rgba(13,31,28,.10)"/>`;
    const tag = `<text x="160" y="284" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#07705E">${safeLabel}</text>`;
    let art = '';
    if(type==='tshirt') art = `<path d="M98 72 L126 52 H194 L222 72 L242 116 L212 130 L202 106 V218 Q202 229 191 229 H129 Q118 229 118 218 V106 L108 130 L78 116 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M132 52 Q160 74 188 52" fill="none" stroke="${secondary}" stroke-width="10" stroke-linecap="round"/><circle cx="160" cy="143" r="30" fill="${secondary}" opacity=".18"/><path d="M137 145 H183" stroke="${secondary}" stroke-width="7" stroke-linecap="round"/>`;
    else if(type==='shirt') art = `<path d="M112 62 H208 L232 114 L210 126 L199 102 V226 H121 V102 L110 126 L88 114 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M139 62 L160 92 L181 62" fill="white" opacity=".75"/><path d="M160 92 V224" stroke="${secondary}" stroke-width="4" opacity=".55"/><circle cx="150" cy="126" r="3" fill="${secondary}"/><circle cx="150" cy="151" r="3" fill="${secondary}"/><circle cx="150" cy="176" r="3" fill="${secondary}"/>`;
    else if(type==='polo') art = `<path d="M106 76 L130 56 H190 L214 76 L236 114 L212 128 L202 104 V224 H118 V104 L108 128 L84 114 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M136 58 L160 94 L184 58" fill="#fff" opacity=".84"/><path d="M160 94 V126" stroke="${secondary}" stroke-width="5"/><circle cx="150" cy="112" r="3" fill="${secondary}"/>`;
    else if(type==='hoodie') art = `<path d="M104 94 Q116 58 160 56 Q204 58 216 94 L240 134 L214 148 L202 124 V228 H118 V124 L106 148 L80 134 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M128 80 Q160 35 192 80 Q184 108 160 111 Q136 108 128 80" fill="${secondary}" opacity=".22"/><path d="M142 125 H178" stroke="${secondary}" stroke-width="7" stroke-linecap="round"/><path d="M137 87 Q160 104 183 87" fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="4"/>`;
    else if(type==='jacket') art = `<path d="M96 78 L132 55 H188 L224 78 L236 226 H84 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M132 55 L160 126 L188 55" fill="${secondary}" opacity=".24"/><path d="M160 70 V226" stroke="#fff" stroke-opacity=".65" stroke-width="5"/><path d="M102 138 H136 M184 138 H218" stroke="#fff" stroke-opacity=".55" stroke-width="6" stroke-linecap="round"/>`;
    else if(type==='blazer') art = `<path d="M102 72 L136 52 H184 L218 72 L232 228 H88 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M136 52 L160 118 L184 52 L198 228 H122 Z" fill="#fff" opacity=".86"/><path d="M126 102 L153 130 M194 102 L167 130" stroke="${secondary}" stroke-width="4"/><circle cx="160" cy="150" r="4" fill="${secondary}"/><circle cx="160" cy="176" r="4" fill="${secondary}"/>`;
    else if(type==='pants') art = `<path d="M118 58 H202 L194 232 H165 L160 130 L155 232 H126 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M118 82 H202" stroke="${secondary}" stroke-width="8" opacity=".6"/><path d="M160 88 V130" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>`;
    else if(type==='shorts') art = `<path d="M112 82 H208 L198 176 H170 L160 124 L150 176 H122 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M112 105 H208" stroke="${secondary}" stroke-width="7" opacity=".55"/><path d="M160 106 V138" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>`;
    else if(type==='skirt') art = `<path d="M126 78 H194 L220 224 H100 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M126 99 H194" stroke="${secondary}" stroke-width="8" opacity=".55"/><path d="M145 111 L132 218 M175 111 L188 218" stroke="#fff" stroke-opacity=".45" stroke-width="4"/>`;
    else if(type==='dress') art = `<path d="M136 56 H184 L196 92 L224 226 H96 L124 92 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M136 56 Q160 86 184 56" fill="#fff" opacity=".75"/><path d="M123 120 H197" stroke="${secondary}" stroke-width="8" opacity=".55"/><circle cx="138" cy="150" r="5" fill="#fff" opacity=".55"/><circle cx="182" cy="176" r="5" fill="#fff" opacity=".55"/><circle cx="154" cy="198" r="4" fill="#fff" opacity=".55"/>`;
    else if(type==='bag') art = `<rect x="94" y="104" width="132" height="112" rx="20" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M126 108 Q160 58 194 108" fill="none" stroke="${secondary}" stroke-width="12" stroke-linecap="round"/><path d="M111 142 H209" stroke="#fff" stroke-opacity=".45" stroke-width="5"/><circle cx="160" cy="167" r="16" fill="${secondary}" opacity=".28"/>`;
    else if(type==='tote') art = `<path d="M92 94 H228 L212 228 H108 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M128 98 Q160 48 192 98" fill="none" stroke="${secondary}" stroke-width="10" stroke-linecap="round"/><path d="M126 146 H194" stroke="${secondary}" stroke-width="7" stroke-linecap="round" opacity=".7"/><text x="160" y="174" text-anchor="middle" font-family="Georgia,serif" font-size="15" font-weight="700" fill="#07705E" opacity=".7">STYLE</text>`;
    else if(type==='backpack') art = `<rect x="102" y="76" width="116" height="150" rx="28" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><rect x="124" y="144" width="72" height="56" rx="16" fill="${secondary}" opacity=".28"/><path d="M126 84 Q160 50 194 84" fill="none" stroke="${secondary}" stroke-width="10" stroke-linecap="round"/><path d="M102 124 Q72 145 98 188 M218 124 Q248 145 222 188" fill="none" stroke="${primary}" stroke-width="11" opacity=".55"/>`;
    else if(type==='hat') art = `<path d="M98 150 Q118 86 160 86 Q202 86 222 150 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><ellipse cx="160" cy="166" rx="92" ry="24" fill="${secondary}" opacity=".7"/><path d="M120 144 Q160 164 200 144" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="5"/>`;
    else if(type==='cap') art = `<path d="M92 148 Q104 92 160 88 Q216 92 228 148 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M198 146 Q244 144 260 164 Q222 176 190 160" fill="${secondary}" opacity=".75"/><path d="M130 104 Q160 122 190 104" stroke="#fff" stroke-opacity=".45" stroke-width="5" fill="none"/>`;
    else if(type==='shoes') art = `<path d="M74 172 Q126 176 150 138 L178 154 Q216 172 248 176 Q254 196 236 204 H84 Q66 202 74 172 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M82 190 H240" stroke="${secondary}" stroke-width="9" stroke-linecap="round"/><path d="M144 150 L168 170 M158 146 L184 168" stroke="#fff" stroke-opacity=".72" stroke-width="4"/>`;
    else if(type==='glasses') art = `<circle cx="122" cy="145" r="37" fill="${primary}" opacity=".18" stroke="${secondary}" stroke-width="10"/><circle cx="198" cy="145" r="37" fill="${primary}" opacity=".18" stroke="${secondary}" stroke-width="10"/><path d="M159 145 H161 M85 132 L55 116 M235 132 L265 116" stroke="${secondary}" stroke-width="9" stroke-linecap="round"/>`;
    else if(type==='belt') art = `<rect x="64" y="132" width="192" height="42" rx="14" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><rect x="84" y="123" width="56" height="60" rx="12" fill="none" stroke="${secondary}" stroke-width="12"/><circle cx="170" cy="153" r="5" fill="#fff" opacity=".75"/><circle cx="194" cy="153" r="5" fill="#fff" opacity=".75"/>`;
    else if(type==='scarf') art = `<path d="M122 54 Q178 54 198 104 Q154 118 116 96 Q106 76 122 54 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M150 92 Q126 142 110 226 H154 Q162 166 184 106" fill="${secondary}" opacity=".78"/><path d="M154 98 Q192 142 214 224 H172 Q160 166 136 112" fill="${primary}" opacity=".88"/>`;
    else if(type==='wallet') art = `<rect x="86" y="104" width="148" height="98" rx="22" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M94 132 H226" stroke="${secondary}" stroke-width="8" opacity=".6"/><circle cx="204" cy="162" r="10" fill="${secondary}" opacity=".7"/>`;
    else if(type==='watch') art = `<rect x="143" y="48" width="34" height="74" rx="14" fill="${secondary}" opacity=".55"/><rect x="143" y="190" width="34" height="60" rx="14" fill="${secondary}" opacity=".55"/><circle cx="160" cy="156" r="48" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><circle cx="160" cy="156" r="31" fill="#fff" opacity=".82"/><path d="M160 156 L160 135 M160 156 L178 166" stroke="${secondary}" stroke-width="5" stroke-linecap="round"/>`;
    else if(type==='hairclip') art = `<path d="M88 152 Q160 94 232 152 Q160 210 88 152 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><circle cx="128" cy="152" r="14" fill="#fff" opacity=".85"/><circle cx="160" cy="152" r="14" fill="#fff" opacity=".85"/><circle cx="192" cy="152" r="14" fill="#fff" opacity=".85"/>`;
    else if(type==='socks') art = `<path d="M110 60 H154 V170 Q154 196 126 202 H92 Q78 198 84 182 L110 134 Z" fill="${primary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M172 60 H216 V170 Q216 196 188 202 H154 Q140 198 146 182 L172 134 Z" fill="${secondary}" stroke="#0D1F1C" stroke-opacity=".12" stroke-width="3"/><path d="M110 86 H154 M172 86 H216" stroke="#fff" stroke-width="7" opacity=".7"/>`;
    else art = `<circle cx="160" cy="150" r="72" fill="${primary}"/><circle cx="160" cy="150" r="36" fill="${secondary}" opacity=".55"/>`;
    return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320"><rect width="320" height="320" rx="34" fill="#ffffff"/><circle cx="64" cy="58" r="34" fill="#E8FAF6"/><circle cx="262" cy="72" r="24" fill="#D1F5EE"/><circle cx="270" cy="246" r="46" fill="#F5FFFE"/>${shadow}${art}${tag}</svg>`);
  }

  const productImages = {
    whiteTee: productImage('tshirt','#F7FAFC','#1BBFA0','Áo thun'),
    toteFlat: productImage('tote','#F4E8D8','#1BBFA0','Tote'),
    jeansFlower: productImage('pants','#78A7D8','#2E4A44','Jeans'),
    dressRack: productImage('dress','#F2C6CF','#1BBFA0','Đầm'),
    mensFlatlay: productImage('blazer','#C9B79C','#07705E','Blazer'),
    hoodieBlack: productImage('hoodie','#2E4A44','#5DD6BC','Hoodie'),
    denimSet: productImage('jacket','#6E99C2','#D1F5EE','Denim'),
    rackClothes: productImage('shirt','#FFFFFF','#1BBFA0','Sơ mi'),
    bagsWall: productImage('hat','#D1F5EE','#1BBFA0','Nón'),
    purseLook: productImage('bag','#7A4E3A','#FFD93D','Túi')
  };

  let products = [
    {id:1,name:'Áo thun Basic Mint',cat:'Áo',price:229000,stock:42,emoji:'👕',sold:128,tag:'Basic',rating:4.8,sku:'SS-A001',size:'S · M · L · XL',color:'Trắng / Mint',image:productImage('tshirt','#F7FAFC','#1BBFA0','Áo thun Mint')},
    {id:2,name:'Áo thun Graphic Cloud',cat:'Áo',price:249000,stock:36,emoji:'👕',sold:91,tag:'New',rating:4.6,sku:'SS-A002',size:'S · M · L · XL',color:'Trắng / Xanh mây',image:productImage('tshirt','#EEF7FF','#78A7D8','Graphic Cloud')},
    {id:3,name:'Áo polo Navy Soft',cat:'Áo',price:299000,stock:28,emoji:'👕',sold:76,tag:'Smart',rating:4.7,sku:'SS-A003',size:'S · M · L · XL',color:'Navy',image:productImage('polo','#1F3A5F','#5DD6BC','Polo Navy')},
    {id:4,name:'Áo sơ mi Linen trắng',cat:'Áo',price:369000,stock:24,emoji:'👔',sold:82,tag:'Office',rating:4.8,sku:'SS-A004',size:'S · M · L',color:'Trắng linen',image:productImage('shirt','#FFFFFF','#1BBFA0','Sơ mi Linen')},
    {id:5,name:'Áo sơ mi sọc xanh',cat:'Áo',price:389000,stock:21,emoji:'👔',sold:63,tag:'Office',rating:4.7,sku:'SS-A005',size:'S · M · L',color:'Xanh sọc',image:productImage('shirt','#DCEEFF','#0D9980','Sơ mi sọc')},
    {id:6,name:'Áo blouse cổ bèo',cat:'Áo',price:339000,stock:18,emoji:'👚',sold:54,tag:'Elegant',rating:4.6,sku:'SS-A006',size:'S · M · L',color:'Kem',image:productImage('shirt','#FFF7ED','#D49A89','Blouse')},
    {id:7,name:'Hoodie Urban xám',cat:'Áo',price:429000,stock:16,emoji:'🧥',sold:88,tag:'Street',rating:4.8,sku:'SS-A007',size:'M · L · XL',color:'Xám khói',image:productImage('hoodie','#6B7280','#1BBFA0','Hoodie Xám')},
    {id:8,name:'Hoodie Mint Oversize',cat:'Áo',price:449000,stock:13,emoji:'🧥',sold:69,tag:'Hot',rating:4.9,sku:'SS-A008',size:'M · L · XL',color:'Mint',image:productImage('hoodie','#D1F5EE','#07705E','Hoodie Mint')},
    {id:9,name:'Sweater Burgundy Cozy',cat:'Áo',price:419000,stock:15,emoji:'🧶',sold:58,tag:'Cozy',rating:4.7,sku:'SS-A009',size:'S · M · L',color:'Đỏ rượu',image:productImage('tshirt','#8B2635','#FFD93D','Sweater')},
    {id:10,name:'Cardigan Cream nhẹ',cat:'Áo',price:459000,stock:11,emoji:'🧶',sold:42,tag:'Cute',rating:4.7,sku:'SS-A010',size:'S · M · L',color:'Kem',image:productImage('jacket','#F3E8D5','#C7A87D','Cardigan')},
    {id:11,name:'Áo khoác Denim xanh',cat:'Áo',price:549000,stock:14,emoji:'🧥',sold:66,tag:'Hot',rating:4.8,sku:'SS-A011',size:'S · M · L',color:'Xanh denim',image:productImage('jacket','#5F8DBB','#D1F5EE','Denim Jacket')},
    {id:12,name:'Blazer Khaki thanh lịch',cat:'Áo',price:699000,stock:9,emoji:'🧥',sold:38,tag:'Premium',rating:4.9,sku:'SS-A012',size:'M · L',color:'Khaki',image:productImage('blazer','#C9B79C','#07705E','Blazer Khaki')},
    {id:13,name:'Bomber đen City',cat:'Áo',price:579000,stock:12,emoji:'🧥',sold:47,tag:'Street',rating:4.6,sku:'SS-A013',size:'M · L · XL',color:'Đen',image:productImage('jacket','#111827','#5DD6BC','Bomber')},
    {id:14,name:'Vest công sở đen',cat:'Áo',price:759000,stock:7,emoji:'🧥',sold:31,tag:'Premium',rating:4.9,sku:'SS-A014',size:'M · L',color:'Đen',image:productImage('blazer','#20242B','#FFD93D','Vest Đen')},
    {id:15,name:'Croptop Pastel Sweet',cat:'Áo',price:239000,stock:30,emoji:'👕',sold:73,tag:'Cute',rating:4.6,sku:'SS-A015',size:'S · M · L',color:'Hồng pastel',image:productImage('tshirt','#F6C6D1','#FFFFFF','Croptop')},
    {id:16,name:'Quần jean ống rộng Sky',cat:'Quần',price:459000,stock:19,emoji:'👖',sold:92,tag:'Hot',rating:4.8,sku:'SS-Q001',size:'S · M · L',color:'Xanh nhạt',image:productImage('pants','#78A7D8','#2E4A44','Jean ống rộng')},
    {id:17,name:'Quần jean slim Dark Blue',cat:'Quần',price:429000,stock:22,emoji:'👖',sold:61,tag:'Denim',rating:4.6,sku:'SS-Q002',size:'S · M · L',color:'Xanh đậm',image:productImage('pants','#2F5D8C','#D1F5EE','Jean Slim')},
    {id:18,name:'Quần tây ống suông đen',cat:'Quần',price:449000,stock:13,emoji:'👖',sold:49,tag:'Office',rating:4.7,sku:'SS-Q003',size:'M · L · XL',color:'Đen',image:productImage('pants','#1F2937','#FFD93D','Quần tây')},
    {id:19,name:'Quần kaki Beige Classic',cat:'Quần',price:389000,stock:26,emoji:'👖',sold:57,tag:'Casual',rating:4.5,sku:'SS-Q004',size:'S · M · L',color:'Be',image:productImage('pants','#C9B79C','#07705E','Kaki Beige')},
    {id:20,name:'Quần jogger xám Active',cat:'Quần',price:329000,stock:20,emoji:'👖',sold:52,tag:'Active',rating:4.6,sku:'SS-Q005',size:'M · L · XL',color:'Xám',image:productImage('pants','#6B7280','#1BBFA0','Jogger')},
    {id:21,name:'Quần short Denim Summer',cat:'Quần',price:279000,stock:34,emoji:'🩳',sold:78,tag:'Summer',rating:4.6,sku:'SS-Q006',size:'S · M · L',color:'Xanh denim',image:productImage('shorts','#6E99C2','#D1F5EE','Short Denim')},
    {id:22,name:'Quần short kaki Beige',cat:'Quần',price:269000,stock:28,emoji:'🩳',sold:64,tag:'Summer',rating:4.5,sku:'SS-Q007',size:'S · M · L',color:'Be',image:productImage('shorts','#D8C3A5','#0D9980','Short Kaki')},
    {id:23,name:'Quần culottes Linen',cat:'Quần',price:399000,stock:15,emoji:'👖',sold:36,tag:'Chic',rating:4.7,sku:'SS-Q008',size:'S · M · L',color:'Kem',image:productImage('pants','#EEE1CC','#B08968','Culottes')},
    {id:24,name:'Quần legging thể thao',cat:'Quần',price:299000,stock:25,emoji:'👖',sold:58,tag:'Active',rating:4.6,sku:'SS-Q009',size:'S · M · L',color:'Đen',image:productImage('pants','#111827','#5DD6BC','Legging')},
    {id:25,name:'Quần cargo xanh rêu',cat:'Quần',price:479000,stock:12,emoji:'👖',sold:44,tag:'Street',rating:4.7,sku:'SS-Q010',size:'M · L · XL',color:'Xanh rêu',image:productImage('pants','#4A5D3F','#FFD93D','Cargo')},
    {id:26,name:'Đầm midi Floral',cat:'Váy',price:529000,stock:10,emoji:'👗',sold:68,tag:'Elegant',rating:4.8,sku:'SS-V001',size:'S · M',color:'Hoa nhí',image:productImage('dress','#F2C6CF','#0D9980','Đầm Floral')},
    {id:27,name:'Đầm suông Minimal trắng',cat:'Váy',price:459000,stock:18,emoji:'👗',sold:51,tag:'Daily',rating:4.6,sku:'SS-V002',size:'S · M · L',color:'Trắng',image:productImage('dress','#FFFFFF','#1BBFA0','Đầm suông')},
    {id:28,name:'Đầm maxi Soft Blue',cat:'Váy',price:649000,stock:6,emoji:'👗',sold:35,tag:'Limited',rating:4.9,sku:'SS-V003',size:'S · M',color:'Xanh khói',image:productImage('dress','#BBD7EA','#07705E','Đầm Maxi')},
    {id:29,name:'Chân váy chữ A Coffee',cat:'Váy',price:329000,stock:20,emoji:'👗',sold:62,tag:'Office',rating:4.7,sku:'SS-V004',size:'S · M · L',color:'Nâu coffee',image:productImage('skirt','#8B5E3C','#FFD93D','Chân váy A')},
    {id:30,name:'Chân váy Denim Blue',cat:'Váy',price:359000,stock:17,emoji:'👗',sold:55,tag:'Denim',rating:4.7,sku:'SS-V005',size:'S · M · L',color:'Xanh jean',image:productImage('skirt','#5F8DBB','#D1F5EE','Váy Denim')},
    {id:31,name:'Váy tennis Pastel',cat:'Váy',price:349000,stock:23,emoji:'👗',sold:73,tag:'Cute',rating:4.6,sku:'SS-V006',size:'S · M · L',color:'Hồng pastel',image:productImage('skirt','#F6C6D1','#FFFFFF','Váy Tennis')},
    {id:32,name:'Đầm sơ mi Linen',cat:'Váy',price:589000,stock:8,emoji:'👗',sold:39,tag:'Premium',rating:4.9,sku:'SS-V007',size:'S · M',color:'Be linen',image:productImage('dress','#EEE1CC','#0D9980','Đầm sơ mi')},
    {id:33,name:'Đầm body Black Chic',cat:'Váy',price:499000,stock:9,emoji:'👗',sold:41,tag:'Chic',rating:4.8,sku:'SS-V008',size:'S · M',color:'Đen',image:productImage('dress','#111827','#FFD93D','Body Dress')},
    {id:34,name:'Set váy & cardigan Sweet',cat:'Váy',price:799000,stock:5,emoji:'👗',sold:27,tag:'Combo',rating:4.9,sku:'SS-V009',size:'S · M',color:'Kem / Nâu',image:productImage('dress','#EFD8C5','#8B5E3C','Set Sweet')},
    {id:35,name:'Túi tote Canvas Mint',cat:'Phụ kiện',price:189000,stock:38,emoji:'👜',sold:101,tag:'Basic',rating:4.8,sku:'SS-P001',size:'Free size',color:'Canvas / Mint',image:productImage('tote','#F4E8D8','#1BBFA0','Tote Mint')},
    {id:36,name:'Túi đeo vai Mini Brown',cat:'Phụ kiện',price:259000,stock:24,emoji:'👜',sold:74,tag:'Trending',rating:4.8,sku:'SS-P002',size:'Free size',color:'Nâu',image:productImage('bag','#7A4E3A','#FFD93D','Shoulder Bag')},
    {id:37,name:'Balo mini City Black',cat:'Phụ kiện',price:329000,stock:21,emoji:'🎒',sold:53,tag:'City',rating:4.6,sku:'SS-P003',size:'Free size',color:'Đen',image:productImage('backpack','#1F2937','#5DD6BC','Balo Mini')},
    {id:38,name:'Ví da nhỏ Minimal',cat:'Phụ kiện',price:159000,stock:40,emoji:'👛',sold:69,tag:'Gift',rating:4.5,sku:'SS-P004',size:'Free size',color:'Nâu',image:productImage('wallet','#8B5E3C','#FFD93D','Ví da')},
    {id:39,name:'Nón bucket Beige',cat:'Phụ kiện',price:149000,stock:31,emoji:'🧢',sold:61,tag:'Cute',rating:4.6,sku:'SS-P005',size:'Free size',color:'Be',image:productImage('hat','#EEE1CC','#0D9980','Bucket Hat')},
    {id:40,name:'Mũ lưỡi trai Urban đen',cat:'Phụ kiện',price:159000,stock:35,emoji:'🧢',sold:59,tag:'Street',rating:4.6,sku:'SS-P006',size:'Free size',color:'Đen',image:productImage('cap','#111827','#1BBFA0','Urban Cap')},
    {id:41,name:'Khăn lụa Pastel',cat:'Phụ kiện',price:169000,stock:29,emoji:'🧣',sold:45,tag:'Cute',rating:4.5,sku:'SS-P007',size:'Free size',color:'Pastel',image:productImage('scarf','#F6C6D1','#BBD7EA','Khăn lụa')},
    {id:42,name:'Kính thời trang Retro',cat:'Phụ kiện',price:199000,stock:26,emoji:'🕶️',sold:67,tag:'Hot',rating:4.7,sku:'SS-P008',size:'Free size',color:'Nâu / Đen',image:productImage('glasses','#EFD8C5','#7A4E3A','Kính Retro')},
    {id:43,name:'Thắt lưng da Classic',cat:'Phụ kiện',price:229000,stock:25,emoji:'🧷',sold:46,tag:'Smart',rating:4.6,sku:'SS-P009',size:'Free size',color:'Nâu / Đen',image:productImage('belt','#7A4E3A','#FFD93D','Thắt lưng')},
    {id:44,name:'Giày sneaker trắng',cat:'Phụ kiện',price:499000,stock:16,emoji:'👟',sold:72,tag:'Hot',rating:4.8,sku:'SS-P010',size:'36 · 37 · 38 · 39 · 40',color:'Trắng',image:productImage('shoes','#FFFFFF','#1BBFA0','Sneaker')},
    {id:45,name:'Sandal quai mảnh Beige',cat:'Phụ kiện',price:289000,stock:18,emoji:'👡',sold:36,tag:'Summer',rating:4.5,sku:'SS-P011',size:'36 · 37 · 38 · 39',color:'Be',image:productImage('shoes','#D8C3A5','#B08968','Sandal')},
    {id:46,name:'Kẹp tóc Pearl',cat:'Phụ kiện',price:99000,stock:50,emoji:'🎀',sold:84,tag:'Gift',rating:4.6,sku:'SS-P012',size:'Free size',color:'Ngọc trai',image:productImage('hairclip','#F7FAFC','#D8C3A5','Kẹp tóc')},
    {id:47,name:'Đồng hồ dây nhỏ Mint',cat:'Phụ kiện',price:359000,stock:13,emoji:'⌚',sold:33,tag:'Smart',rating:4.7,sku:'SS-P013',size:'Free size',color:'Mint / Bạc',image:productImage('watch','#D1F5EE','#07705E','Đồng hồ')},
    {id:48,name:'Vớ trắng cổ cao',cat:'Phụ kiện',price:79000,stock:70,emoji:'🧦',sold:112,tag:'Basic',rating:4.5,sku:'SS-P014',size:'Free size',color:'Trắng',image:productImage('socks','#FFFFFF','#1BBFA0','Vớ trắng')},
    {id:49,name:'Set công sở Linen Ivory',cat:'Áo',price:759000,stock:8,emoji:'👔',sold:30,tag:'Combo',rating:4.9,sku:'SS-C001',size:'S · M · L',color:'Ivory',image:productImage('blazer','#F2E6D8','#1BBFA0','Set Linen')},
    {id:50,name:'Set dạo phố Denim Blue',cat:'Quần',price:699000,stock:10,emoji:'👖',sold:34,tag:'Combo',rating:4.8,sku:'SS-C002',size:'S · M · L',color:'Denim',image:productImage('jacket','#5F8DBB','#D1F5EE','Set Denim')}
  ];



  // V8: keep all product images embedded directly inside the HTML file.
  // This version does not depend on an internet connection, so the images will always display.
  function guessTypeFromProduct(p){
    const n=(p.name||'').toLowerCase();
    const c=(p.cat||'').toLowerCase();
    if(c.includes('phụ')){
      if(n.includes('tote')) return 'tote';
      if(n.includes('đeo vai')||n.includes('bag')) return 'bag';
      if(n.includes('balo')) return 'backpack';
      if(n.includes('ví')) return 'wallet';
      if(n.includes('bucket')) return 'hat';
      if(n.includes('lưỡi trai')||n.includes('cap')||n.includes('mũ')) return 'cap';
      if(n.includes('kính')) return 'glasses';
      if(n.includes('thắt lưng')) return 'belt';
      if(n.includes('giày')||n.includes('sandal')||n.includes('sneaker')) return 'shoes';
      if(n.includes('kẹp tóc')) return 'hairclip';
      if(n.includes('đồng hồ')) return 'watch';
      if(n.includes('vớ')) return 'socks';
      if(n.includes('khăn')) return 'scarf';
      return 'bag';
    }
    if(c.includes('váy')){
      if(n.includes('chân váy')||n.includes('tennis')) return 'skirt';
      return 'dress';
    }
    if(c.includes('quần')){
      if(n.includes('short')) return 'shorts';
      return 'pants';
    }
    if(c.includes('áo')){
      if(n.includes('hoodie')) return 'hoodie';
      if(n.includes('polo')) return 'polo';
      if(n.includes('sơ mi')||n.includes('shirt')||n.includes('blouse')) return 'shirt';
      if(n.includes('blazer')||n.includes('vest')) return 'blazer';
      if(n.includes('khoác')||n.includes('jacket')||n.includes('cardigan')||n.includes('bomber')) return 'jacket';
      return 'tshirt';
    }
    return 'tshirt';
  }
  const EMBED_PRIMARY = ['#FFFFFF','#EEF7FF','#1F3A5F','#D1F5EE','#F6C6D1','#EEE1CC','#6B7280','#5F8DBB','#111827','#C9B79C','#F4E8D8','#EFD8C5'];
  const EMBED_SECONDARY = ['#1BBFA0','#5DD6BC','#07705E','#FFD93D','#B08968','#D49A89','#78A7D8','#2E4A44','#C7A87D','#7A4E3A'];
  function embeddedProductImageFromName(name,cat,id){
    const type = guessTypeFromProduct({name,cat});
    const seed = Math.abs(Number(id)||0);
    const primary = EMBED_PRIMARY[seed % EMBED_PRIMARY.length];
    const secondary = EMBED_SECONDARY[seed % EMBED_SECONDARY.length];
    const shortLabel = String(name||cat||'StyleShop').slice(0,18);
    return productImage(type, primary, secondary, shortLabel);
  }
  products = products.map((p,i)=>({...p, image: p.image || embeddedProductImageFromName(p.name,p.cat,p.id||i+1), imageSource:'Embedded SVG'}));

  function productVisual(p){
    return p.image ? `<img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy">` : `<span class="emoji">${p.emoji}</span>`;
  }
  function productModalVisual(p){
    return p.image ? `<img class="product-img-modal" src="${p.image}" alt="${p.name}">` : p.emoji;
  }
  function productMiniVisual(p){
    return p.image ? `<img src="${p.image}" alt="${p.name}">` : p.emoji;
  }
  function visualClass(p, base=''){
    return (base ? base + ' ' : '') + (p.image ? 'has-img' : '');
  }
  let cart = [];
  let orders = [
    {id:'SS1001',customer:'Nguyễn Minh Anh',customerEmail:'minhanh@gmail.com',items:'Áo sơ mi Linen Mint x1, Túi tote x1',total:468000,status:'Chờ xác nhận',payment:'COD',address:'Bình Thuận',created:'Hôm nay 09:20',history:['Tạo đơn']},
    {id:'SS1002',customer:'Trần Gia Hân',customerEmail:'giahan@gmail.com',items:'Váy midi thanh lịch x1',total:499000,status:'Đang giao',payment:'COD',address:'TP.HCM',created:'Hôm qua 15:10',history:['Tạo đơn','Xác nhận','Đóng gói','Bàn giao shipper']},
    {id:'SS1003',customer:'Lê Hoàng Nam',customerEmail:'hoangnam@gmail.com',items:'Quần jean ống rộng x1',total:459000,status:'Hoàn thành',payment:'COD',address:'Đồng Nai',created:'12/05',history:['Tạo đơn','Xác nhận','Đóng gói','Đang giao','Hoàn thành']},
    {id:'SS1004',customer:'Khách hàng StyleShop',customerEmail:'customer@styleshop.vn',items:'Áo thun Basic Mint (M) x1',total:229000,status:'Đã hủy',payment:'COD',address:'Bình Thuận',created:'10/05',history:['Tạo đơn','Khách hủy'],cancelReason:'Khách muốn đổi sang mẫu Hoodie Mint Oversize'}
  ];

  const money = n => (Number(n)||0).toLocaleString('vi-VN') + '₫';
  const hideAllPages = () => document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const orderSteps = ['Chờ xác nhận','Đã xác nhận','Đang đóng gói','Đang giao','Hoàn thành'];
  const statusClass = s => s.includes('Chờ') ? 'status-wait' : s.includes('giao') || s.includes('đóng') || s.includes('xác nhận') ? 'status-ship' : s.includes('hủy') || s.includes('Hủy') ? 'status-cancel' : 'status-done';
  const currentUserOrders = () => orders.filter(o => o.customerEmail === currentUser.email || o.customer === currentUser.name || o.customer === 'Khách hàng demo');
  const completedSpent = () => currentUserOrders().filter(o => o.status !== 'Đã hủy' && o.status !== 'Hủy đơn').reduce((s,o)=>s+o.total,0);
  const getRank = spent => VIP_LEVELS.slice().reverse().find(l => spent >= l.min) || VIP_LEVELS[0];
  const getNextRank = spent => VIP_LEVELS.find(l => l.next && spent < l.next);
  const vipDiscountRate = () => ({Member:0,Silver:.03,Gold:.05,Diamond:.08}[getRank(completedSpent()).name] || 0);

  function closeMenus(){
    document.getElementById('accountMenu')?.classList.remove('show');
    document.getElementById('adminAccountMenu')?.classList.remove('show');
  }
  document.addEventListener('click', e => {
    if (!e.target.closest('.app-top-actions')) closeMenus();
  });

  window.goAuth = function(tab = 'register') {
    hideAllPages(); document.getElementById('pageAuth')?.classList.add('active');
    switchForm(tab || 'register'); history.replaceState(null, '', '#auth'); window.scrollTo(0,0);
  };
  window.goLanding = function() { hideAllPages(); document.getElementById('pageLanding')?.classList.add('active'); history.replaceState(null, '', location.pathname); window.scrollTo(0,0); };
  window.goApp = function(user = null) {
    currentRole = 'customer'; if (user) currentUser = {...currentUser, ...user};
    hideAllPages(); document.getElementById('pageApp')?.classList.add('active'); history.replaceState(null, '', '#app'); window.scrollTo(0,0);
    renderAccount(); renderProducts(); renderCart(); renderWishlist(); renderCustomerOrders(); showToast('🛍️ Đã vào trang chủ web app khách hàng!', 'success');
  };
  window.goAdmin = function(role = 'admin') {
    currentRole = role; hideAllPages(); document.getElementById('pageAdmin')?.classList.add('active'); history.replaceState(null, '', '#admin'); window.scrollTo(0,0);
    const roleNames = {owner:'Chủ shop / Owner', admin:'Quản lý / Admin', staff:'Nhân viên / Staff'};
    const roleDesc = {owner:'Toàn quyền xem báo cáo, doanh thu, nhân sự và kiểm soát dữ liệu.',admin:'Quản lý sản phẩm, danh mục, đơn hàng, tồn kho, khách VIP và báo cáo vận hành.',staff:'Tập trung xử lý đơn hàng, cập nhật trạng thái và hỗ trợ khách hàng.'};
    const roleAvatars = {owner:'🦁', admin:'🦊', staff:'🐶'};
    const roleBadges = {owner:'👑 Owner / Super Admin', admin:'🛡️ Quản trị hệ thống', staff:'🚚 Nhân viên xử lý đơn'};
    const welcome = document.getElementById('adminWelcome'); const roleText = document.getElementById('adminRoleText'); const drop = document.getElementById('adminWelcomeDrop');
    if (welcome) welcome.textContent = roleNames[role] || 'Admin Demo'; if (drop) drop.textContent = roleNames[role] || 'Admin Demo'; if (roleText) roleText.textContent = roleDesc[role] || roleDesc.admin;
    ['adminAvatarBtn','adminFloatingAvatar','adminAvatarBig','adminSideAvatar'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent = roleAvatars[role] || '🦊'; });
    const adminBadge=document.getElementById('adminRankBadge'); if(adminBadge) adminBadge.textContent = roleBadges[role] || roleBadges.admin;
    renderAdmin(); showToast('🛠️ Đã vào giao diện quản trị demo!', 'success');
  };
  window.logoutApp = function(){ closeMenus(); showToast('👋 Đã đăng xuất khỏi hệ thống.', 'info'); setTimeout(() => goLanding(), 450); };
  window.scrollAppTo = function(id){ document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'start'}); };

  window.socialLogin = function(provider) {
    if (provider === 'Google') { document.body.classList.add('native-cursor'); document.getElementById('googleModal')?.classList.add('show'); return; }
    showToast('Đăng nhập mạng xã hội demo.', 'info');
  };
  window.closeGoogleModal = function(){ document.getElementById('googleModal')?.classList.remove('show'); document.body.classList.remove('native-cursor'); };
  window.loginWithGoogle = function(email, name, avatar){
    closeGoogleModal();
    if (email === ADMIN_DEMO.email) { currentUser = {name, email, avatar, password:'google-demo'}; goAdmin('admin'); }
    else goApp({name, email, avatar, password:'google-demo'});
  };

  window.toggleAccountMenu = function(){ const el = document.getElementById('accountMenu'); if(!el) return; el.classList.toggle('show'); renderAccount(); };
  window.openAccountMenu = function(){ const el = document.getElementById('accountMenu'); if(!el) return; el.classList.add('show'); renderAccount(); };
  window.toggleAdminMenu = function(){ document.getElementById('adminAccountMenu')?.classList.toggle('show'); renderAdmin(); };
  window.showAccountTab = function(tab='overview', btn=null){
    document.querySelectorAll('#accountMenu .account-panel').forEach(p=>p.classList.remove('active'));
    const panel = document.getElementById('accountPanel' + tab.charAt(0).toUpperCase() + tab.slice(1));
    if(panel) panel.classList.add('active');
    document.querySelectorAll('#accountMenu .account-tabbar button').forEach(b=>b.classList.toggle('active', b.dataset.accountTab===tab));
    if(btn) btn.classList.add('active');
    renderAccount();
  };
  window.saveCustomerAddress = function(){
    const phone = document.getElementById('addrPhone')?.value.trim() || customerAddress.phone;
    const address = document.getElementById('addrText')?.value.trim() || customerAddress.address;
    customerAddress = {...customerAddress, phone, address};
    renderAccount(); renderCart(); showToast('📍 Đã lưu địa chỉ giao hàng.', 'success');
  };
  window.useCouponFromWallet = function(code){
    activeCoupon = COUPONS[code] || null;
    const input = document.getElementById('couponInput'); if(input) input.value = code;
    renderCart(); showToast('🎟️ Đã chọn voucher ' + code + '.', 'success'); closeMenus(); scrollAppTo('cartBox');
  };
  window.applyCoupon = function(){
    const code = (document.getElementById('couponInput')?.value || '').trim().toUpperCase();
    if(!code){ activeCoupon=null; renderCart(); return showToast('Đã bỏ voucher.', 'info'); }
    if(!COUPONS[code]) return showToast('⚠️ Mã voucher chưa đúng. Thử MINT10, FREESHIP499 hoặc VIPSTYLE.', 'warn');
    activeCoupon = COUPONS[code]; renderCart(); showToast('🎟️ Đã áp dụng voucher ' + code + '.', 'success');
  };

  window.renderAccount = function(){
    const spent = completedSpent(); const rank = getRank(spent); const next = getNextRank(spent); const count = currentUserOrders().length;
    const progress = next ? Math.min(100, ((spent - rank.min) / (next.next - rank.min)) * 100) : 100;
    const avatar = currentUser.avatar || '🐱';
    ['customerAvatarBtn','customerFloatingAvatar','accountAvatarBig'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent = avatar; });
    const hello = document.getElementById('helloCustomer'); if (hello) hello.textContent = currentUser.name.split(' ')[0] || 'bạn';
    const name = document.getElementById('accountName'); if (name) name.textContent = currentUser.name;
    const email = document.getElementById('accountEmail'); if (email) email.textContent = currentUser.email;
    const rankText = `${rank.icon} ${rank.name}`;
    ['accountRank','miniRank','vipCurrentText','accountVipLevel'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent = rankText; });
    ['accountSpent','miniSpent'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent = money(spent); });
    const accOrders = document.getElementById('accountOrders'); if (accOrders) accOrders.textContent = count;
    ['accountVipProgress','vipProgressMain'].forEach(id => { const el=document.getElementById(id); if(el) el.style.width = progress + '%'; });
    const need = next ? `Còn ${money(next.next - spent)} để lên hạng tiếp theo` : 'Bạn đã đạt hạng cao nhất';
    ['accountVipText','vipNeedText'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent = need; });
    const title = document.getElementById('vipCardTitle'); if (title) title.textContent = `${rank.icon} Hạng ${rank.name}`;
    const sub = document.getElementById('vipCardSub'); if (sub) sub.textContent = `Tổng đã mua: ${money(spent)} · Ưu đãi giỏ hàng hiện tại: ${Math.round(vipDiscountRate()*100)}%`;
    const addr = document.getElementById('accountAddressText'); if(addr) addr.textContent = `${customerAddress.address} · ${customerAddress.phone}`;
    const addrPhone = document.getElementById('addrPhone'); if(addrPhone) addrPhone.value = customerAddress.phone;
    const addrText = document.getElementById('addrText'); if(addrText) addrText.value = customerAddress.address;
    const orderMini = document.getElementById('accountOrderMiniList');
    if(orderMini){ const recent = currentUserOrders().slice(0,4); orderMini.innerHTML = recent.map(o=>`<div class="account-mini-row"><div><b>${o.id}</b><div class="cart-small">${o.items}</div>${o.cancelReason?`<div class="cancel-note" style="margin-top:6px"><b>Lý do hủy:</b> ${o.cancelReason}</div>`:''}</div><span class="status-chip ${statusClass(o.status)}">${o.status}</span></div>`).join('') || '<div class="cart-empty" style="padding:12px">Chưa có lịch sử mua hàng.</div>'; }
    const picker = document.getElementById('avatarPicker');
    if (picker) picker.innerHTML = cuteAvatars.map(a => `<button onclick="changeAvatar('${a}')" title="Avatar ${a}">${a}</button>`).join('');
  };
  window.changeAvatar = function(a){ currentUser.avatar = a; renderAccount(); showToast('🐾 Đã đổi avatar thú cưng!', 'success'); };
  window.changePassword = function(){
    const oldP = document.getElementById('oldPassword')?.value || ''; const newP = document.getElementById('newPassword')?.value || '';
    if (!oldP || !newP) return showToast('⚠️ Nhập đủ mật khẩu hiện tại và mật khẩu mới.', 'warn');
    if (oldP !== currentUser.password && currentUser.password !== 'google-demo') return showToast('⚠️ Mật khẩu hiện tại chưa đúng.', 'warn');
    if (newP.length < 8) return showToast('⚠️ Mật khẩu mới cần ít nhất 8 ký tự.', 'warn');
    currentUser.password = newP; ['oldPassword','newPassword'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
    showToast('🔐 Đã đổi mật khẩu demo thành công.', 'success');
  };

  window.setCategory = function(cat, el){
    const select = document.getElementById('categoryFilter'); if (select) select.value = cat;
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active')); if (el) el.classList.add('active');
    renderProducts(); scrollAppTo('shopProducts');
  };
  window.resetFilters = function(){
    const ids = ['productSearch','categoryFilter','priceFilter','sortFilter'];
    ids.forEach(id => { const el = document.getElementById(id); if(!el) return; el.value = id==='categoryFilter'||id==='priceFilter' ? 'all' : id==='sortFilter' ? 'popular' : ''; });
    document.querySelectorAll('.category-chip').forEach((c,i)=>c.classList.toggle('active',i===0)); renderProducts();
  };
  window.renderProducts = function(){
    const grid = document.getElementById('productGrid'); if(!grid) return;
    const q = (document.getElementById('productSearch')?.value || '').toLowerCase(); const cat = document.getElementById('categoryFilter')?.value || 'all';
    const priceFilter = document.getElementById('priceFilter')?.value || 'all'; const sort = document.getElementById('sortFilter')?.value || 'popular';
    let list = products.filter(p => (cat==='all'||p.cat===cat) && p.name.toLowerCase().includes(q));
    list = list.filter(p => priceFilter==='all' || (priceFilter==='under300' && p.price<300000) || (priceFilter==='300to500' && p.price>=300000 && p.price<=500000) || (priceFilter==='over500' && p.price>500000));
    list.sort((a,b)=> sort==='priceAsc'?a.price-b.price:sort==='priceDesc'?b.price-a.price:sort==='new'?b.id-a.id:b.sold-a.sold);
    grid.innerHTML = list.map(productCard).join('') || '<div class="cart-empty">Không tìm thấy sản phẩm phù hợp.</div>';
    const miniProducts = document.getElementById('miniProducts'); if (miniProducts) miniProducts.textContent = products.length;
    renderAccount(); renderWishlistCounts();
  };
  function productCard(p){
    const loved = wishlist.includes(p.id);
    return `<article class="product-card pro"><div class="${visualClass(p,'product-visual')}"><span class="product-badge">${p.tag}</span><button class="wishlist-btn ${loved?'active':''}" onclick="toggleWishlist(${p.id});event.stopPropagation()">${loved?'♥':'♡'}</button>${productVisual(p)}</div><div class="product-info"><div class="product-name">${p.name}</div><div class="product-rating">★★★★★ ${p.rating}</div><div class="product-meta"><span>${p.cat} · còn ${p.stock}</span><span>Đã bán ${p.sold}</span></div><div class="price">${money(p.price)}</div><div class="product-detail-line">Size: ${p.size}<br/>Màu: ${p.color}</div><div class="product-actions"><button class="mini-btn" onclick="viewProduct(${p.id})">Chi tiết</button><button class="mini-btn primary" onclick="addToCart(${p.id})">+ Giỏ hàng</button></div></div></article>`;
  }
  window.viewProduct = function(id){
    const p = products.find(x=>x.id===id); if(!p) return;
    const box = document.getElementById('productModalBox'); if(!box) return;
    const vipRate = Math.round(vipDiscountRate()*100);
    box.innerHTML = `<div class="${visualClass(p,'product-modal-visual')}">${productModalVisual(p)}</div><div><button class="close-x" onclick="closeProductModal()">×</button><div class="app-kicker">${p.tag} · ${p.sku}</div><h2 class="card-title">${p.name}</h2><p class="card-sub">Danh mục ${p.cat} · còn ${p.stock} sản phẩm · đã bán ${p.sold}</p><div class="product-rating" style="font-size:.95rem;margin:10px 0">★★★★★ ${p.rating} / 5.0</div><div class="price" style="font-size:2rem">${money(p.price)}</div><p class="product-detail-line" style="font-size:.9rem">Size: ${p.size}<br/>Màu sắc: ${p.color}<br/>Gợi ý: phù hợp đi học, đi làm hoặc dạo phố; ảnh sản phẩm được thiết kế nền trắng để dễ xem mẫu.</p><div class="product-detail-benefits"><div>🚚 COD / giao tiêu chuẩn</div><div>🔄 Đổi size trong 7 ngày</div><div>👑 Ưu đãi VIP hiện tại: ${vipRate}%</div><div>📦 Tồn kho: ${p.stock}</div></div><div class="shop-policy-strip"><div>✅ Được kiểm hàng</div><div>📏 Có tư vấn size</div><div>🎟️ Dùng voucher</div><div>🧾 Xuất hóa đơn demo</div></div><div class="app-hero-actions"><button class="pill-btn" onclick="addToCart(${p.id});closeProductModal()">🛒 Thêm vào giỏ</button><button class="ghost-btn" onclick="toggleWishlist(${p.id})">💗 Yêu thích</button><button class="ghost-btn" onclick="showToast('📏 Gợi ý size: nếu phân vân, chọn size lớn hơn 1 mức để dễ đổi.', 'info')">📏 Tư vấn size</button><button class="ghost-btn" onclick="openLegal('terms')">📜 Chính sách mua hàng</button></div></div>`;
    document.body.classList.add('native-cursor');
    document.getElementById('productModal')?.classList.add('show');
  };
  window.closeProductModal = function(){ document.getElementById('productModal')?.classList.remove('show'); document.body.classList.remove('native-cursor'); };
  window.toggleWishlist = function(id){ wishlist = wishlist.includes(id) ? wishlist.filter(x=>x!==id) : [...wishlist,id]; renderProducts(); renderWishlist(); showToast(wishlist.includes(id) ? '💗 Đã thêm vào yêu thích.' : '🤍 Đã bỏ khỏi yêu thích.', 'info'); };
  window.toggleWishlistView = function(){ const p=document.getElementById('wishlistPanel'); if(!p) return; p.style.display = p.style.display==='none' ? 'block' : 'none'; if(p.style.display==='block'){ renderWishlist(); scrollAppTo('wishlistPanel'); } };
  function renderWishlistCounts(){ const a=document.getElementById('navWishCount'); if(a) a.textContent=wishlist.length; }
  window.renderWishlist = function(){ const g=document.getElementById('wishlistGrid'); if(!g) return; const list=products.filter(p=>wishlist.includes(p.id)); g.innerHTML = list.map(productCard).join('') || '<div class="cart-empty">Chưa có sản phẩm yêu thích.</div>'; renderWishlistCounts(); };

  window.addToCart = function(id){ const p=products.find(x=>x.id===id); if(!p||p.stock<=0) return showToast('⚠️ Sản phẩm đã hết hàng!', 'warn'); const item=cart.find(x=>x.id===id); if(item) item.qty+=1; else cart.push({id:p.id, qty:1, size:(p.size||'Free size').split(' · ')[0]}); renderCart(); showToast('🛒 Đã thêm vào giỏ hàng!', 'success'); };
  window.addSuggestedCart = function(){ addToCart(7); addToCart(5); scrollAppTo('cartBox'); };
  window.changeQty = function(id, delta){ const item=cart.find(x=>x.id===id); if(!item) return; const p=products.find(x=>x.id===id); item.qty += delta; if(p && item.qty > p.stock) { item.qty = p.stock; showToast('⚠️ Không thể vượt quá tồn kho.', 'warn'); } if(item.qty<=0) cart=cart.filter(x=>x.id!==id); renderCart(); };
  window.changeItemSize = function(id, size){ const item=cart.find(x=>x.id===id); if(item) item.size=size; renderCart(); };
  window.removeCartItem = function(id){ cart=cart.filter(x=>x.id!==id); renderCart(); };
  window.clearCart = function(){ cart=[]; renderCart(); showToast('🧺 Đã làm trống giỏ hàng.', 'info'); };
  function calcCartTotals(){
    let subtotal=0; cart.forEach(i=>{ const p=products.find(x=>x.id===i.id); if(p) subtotal += p.price*i.qty; });
    const vipDiscount=Math.round(subtotal*vipDiscountRate());
    let couponDiscount=0, couponText='Chưa áp dụng voucher.';
    if(activeCoupon){
      if(subtotal < activeCoupon.min){ couponText=`${activeCoupon.code}: cần đơn từ ${money(activeCoupon.min)}`; }
      else if(activeCoupon.type==='percent'){ couponDiscount=Math.round(subtotal*activeCoupon.value); couponText=`${activeCoupon.code} · ${activeCoupon.label}: -${money(couponDiscount)}`; }
      else couponText=`${activeCoupon.code} · ${activeCoupon.label}`;
    }
    const delivery=document.getElementById('deliveryMethod')?.value || 'standard';
    let shipping = delivery==='pickup' ? 0 : delivery==='fast' ? 45000 : 30000;
    if(subtotal>=499000 || (activeCoupon && activeCoupon.type==='ship' && subtotal>=activeCoupon.min)) shipping=0;
    const total=Math.max(0, subtotal-vipDiscount-couponDiscount+shipping);
    return {subtotal,vipDiscount,couponDiscount,shipping,total,couponText,delivery};
  }
  window.renderCart = function(){
    const box=document.getElementById('cartList'); const totalEl=document.getElementById('cartTotal'); const subEl=document.getElementById('cartSubtotal'); const miniCart=document.getElementById('miniCart'); const navCart=document.getElementById('navCartCount'); const discountEl=document.getElementById('cartDiscount'); if(!box||!totalEl) return;
    if(!cart.length){ box.innerHTML='<div class="cart-empty">Giỏ hàng đang trống.<br/>Hãy chọn vài sản phẩm bạn thích nhé!</div>'; }
    else { box.innerHTML = cart.map(item => { const p=products.find(x=>x.id===item.id); if(!p) return ''; const sizes=(p.size||'Free size').split(' · '); return `<div class="cart-item"><div class="${visualClass(p,'cart-icon')}">${productMiniVisual(p)}</div><div><div class="cart-name">${p.name}</div><div class="cart-small">${money(p.price)} · ${p.cat}</div><select style="margin-top:6px;border:1px solid rgba(27,191,160,.18);border-radius:9px;padding:5px" onchange="changeItemSize(${p.id},this.value)">${sizes.map(s=>`<option ${item.size===s?'selected':''}>${s}</option>`).join('')}</select><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div><button class="mini-btn" onclick="removeCartItem(${p.id})">×</button></div>`; }).join(''); }
    const t=calcCartTotals();
    if(subEl) subEl.textContent=money(t.subtotal); totalEl.textContent=money(t.total); if(discountEl) discountEl.textContent=`Ưu đãi VIP: -${money(t.vipDiscount)}${t.couponDiscount?` · Voucher: -${money(t.couponDiscount)}`:''}`;
    const ship=document.getElementById('cartShipping'); if(ship) ship.textContent=money(t.shipping);
    const coupon=document.getElementById('activeCouponText'); if(coupon) coupon.textContent=t.couponText;
    const addr=document.getElementById('cartAddressMini'); if(addr) addr.textContent=`Giao tới: ${customerAddress.address} · ${customerAddress.phone}`;
    const qty=cart.reduce((s,i)=>s+i.qty,0); if(miniCart) miniCart.textContent=qty; if(navCart) navCart.textContent=qty;
  };
  window.checkout = function(){
    if(!cart.length) return showToast('⚠️ Giỏ hàng đang trống!', 'warn');
    const itemNames=cart.map(i=>{ const p=products.find(x=>x.id===i.id); if(!p) return ''; return `${p.name} (${i.size}) x${i.qty}`; }).filter(Boolean).join(', ');
    const t=calcCartTotals();
    cart.forEach(i=>{ const p=products.find(x=>x.id===i.id); if(p){ p.stock=Math.max(0,p.stock-i.qty); p.sold+=i.qty; }});
    const id='SS'+Math.floor(1000+Math.random()*9000);
    orders.unshift({id,customer:currentUser.name,customerEmail:currentUser.email,items:itemNames,total:t.total,status:'Chờ xác nhận',payment:'COD',address:customerAddress.address,created:'Vừa xong',history:['Tạo đơn'],shipping:t.shipping,coupon:activeCoupon?.code||''});
    cart=[]; activeCoupon=null; const ci=document.getElementById('couponInput'); if(ci) ci.value=''; renderProducts(); renderCart(); renderCustomerOrders(); renderAdmin(); renderAccount(); scrollAppTo('customerOrders'); showToast('✅ Đặt hàng thành công! Shop sẽ xác nhận đơn.', 'success');
  };
  function orderProgress(status){ if(status==='Đã hủy'||status==='Hủy đơn') return 0; const i=orderSteps.indexOf(status); return Math.max(0,i)+1; }
  function timeline(status){ const count=orderProgress(status); return `<div class="order-timeline">${orderSteps.map((_,i)=>`<span class="timeline-dot ${i<count?'on':''}"></span>`).join('')}</div>`; }
  function customerOrderActions(o){ const canCancel=o.status==='Chờ xác nhận'||o.status==='Đã xác nhận'; return `<div class="order-action-row"><button class="mini-btn" onclick="reorder('${o.id}')">Mua lại</button>${canCancel?`<button class="mini-btn action-cancel" onclick="customerCancelOrder('${o.id}')">Yêu cầu hủy</button>`:''}</div>`; }
  window.renderCustomerOrders = function(){ const list=document.getElementById('customerOrderList'); if(!list) return; const arr=currentUserOrders().slice(0,9); list.innerHTML=arr.map(o=>`<div class="order-card"><div class="order-id">${o.id}</div><div class="cart-small" style="margin-top:6px">${o.items}</div><div class="price" style="margin-top:10px">${money(o.total)}</div><span class="status-chip ${statusClass(o.status)}">● ${o.status}</span>${timeline(o.status)}<div class="cart-small" style="margin-top:8px">${o.created||''} · ${o.payment||'COD'} · ${o.address||''}</div>${o.cancelReason?`<div class="cancel-note"><b>Lý do hủy:</b> ${o.cancelReason}</div>`:''}${customerOrderActions(o)}</div>`).join('') || '<div class="cart-empty">Bạn chưa có đơn hàng nào.</div>'; renderAccount(); };
  window.customerCancelOrder=function(id){ const o=orders.find(x=>x.id===id); if(!o) return; if(!(o.status==='Chờ xác nhận'||o.status==='Đã xác nhận')) return showToast('⚠️ Chỉ hủy được đơn chưa giao.', 'warn'); const reason=prompt('Lý do bạn muốn hủy đơn?', 'Đặt nhầm sản phẩm'); if(reason===null) return; o.status='Đã hủy'; o.cancelReason=reason||'Khách yêu cầu hủy'; o.history=[...(o.history||[]),'Khách hủy: '+o.cancelReason]; renderCustomerOrders(); renderAdmin(); showToast('🧾 Đã gửi yêu cầu hủy đơn.', 'info'); };
  window.reorder=function(id){ const o=orders.find(x=>x.id===id); if(!o) return; let added=0; products.forEach(p=>{ if(o.items.includes(p.name)){ addToCart(p.id); added++; }}); if(!added) addSuggestedCart(); scrollAppTo('cartBox'); showToast('🔁 Đã thêm lại sản phẩm vào giỏ.', 'success'); };
  window.seedCustomerOrder = function(){ orders.unshift({id:'SS'+Math.floor(1000+Math.random()*9000),customer:currentUser.name,customerEmail:currentUser.email,items:'Hoodie Urban Basic (M) x1',total:399000,status:'Chờ xác nhận',payment:'COD',address:customerAddress.address,created:'Vừa xong',history:['Tạo đơn']}); renderCustomerOrders(); renderAdmin(); showToast('📦 Đã tạo một đơn mẫu.', 'success'); };

  window.fillAdminDemo = function(){ const email=document.getElementById('adminEmail'); const pwd=document.getElementById('adminPwd'); const role=document.getElementById('adminRole'); if(email) email.value=ADMIN_DEMO.email; if(pwd) pwd.value=ADMIN_DEMO.password; if(role) role.value='admin'; showToast('🔐 Đã điền tài khoản demo admin.', 'info'); };
  window.handleLogin = function(btn){ const email=document.getElementById('loginEmail')?.value.trim()||''; const pwd=document.getElementById('loginPwd')?.value||''; if(!email||!pwd) return showToast('⚠️ Vui lòng điền đầy đủ thông tin!', 'warn'); if(!email.includes('@')) return showToast('⚠️ Email không hợp lệ!', 'warn'); btn.innerHTML='<span class="spinner"></span>'; btn.disabled=true; setTimeout(()=>{btn.innerHTML='🔑 Đăng nhập'; btn.disabled=false; if(email===ADMIN_DEMO.email && pwd===ADMIN_DEMO.password) goAdmin('admin'); else goApp({email,name:email.split('@')[0] || 'Khách hàng StyleShop',avatar:'🐱',password:pwd});},700); };
  window.handleRegister = function(btn){ const ln=document.getElementById('regLastName')?.value.trim()||''; const fn=document.getElementById('regFirstName')?.value.trim()||''; const email=document.getElementById('regEmail')?.value.trim()||''; const pwd=document.getElementById('regPwd')?.value||''; const terms=document.getElementById('regTerms')?.checked; if(!ln||!fn||!email||!pwd) return showToast('⚠️ Vui lòng điền đầy đủ thông tin!', 'warn'); if(!email.includes('@')) return showToast('⚠️ Email không hợp lệ!', 'warn'); if(pwd.length<8) return showToast('⚠️ Mật khẩu cần ít nhất 8 ký tự!', 'warn'); if(!terms) return showToast('⚠️ Vui lòng đồng ý với điều khoản!', 'warn'); btn.innerHTML='<span class="spinner"></span>'; btn.disabled=true; setTimeout(()=>{btn.innerHTML='🛒 Tạo tài khoản khách hàng'; btn.disabled=false; goApp({name:(fn+' '+ln).trim(),email,avatar:'🐰',password:pwd});},800); };
  window.handleAdminLogin = function(btn){ const email=document.getElementById('adminEmail')?.value.trim()||''; const pwd=document.getElementById('adminPwd')?.value||''; const role=document.getElementById('adminRole')?.value||'admin'; if(!email||!pwd) return showToast('⚠️ Vui lòng điền đầy đủ thông tin!', 'warn'); if(!email.includes('@')) return showToast('⚠️ Email không hợp lệ!', 'warn'); btn.innerHTML='<span class="spinner"></span>'; btn.disabled=true; setTimeout(()=>{btn.innerHTML='🛠️ Đăng nhập hệ thống quản trị'; btn.disabled=false; if(email!==ADMIN_DEMO.email || pwd!==ADMIN_DEMO.password) return showToast('⚠️ Sai tài khoản demo. Dùng admin@styleshop.vn / admin123', 'warn'); goAdmin(role);},750); };

  window.renderAdmin = function(){
    renderAdminProducts(); renderAdminOrders(); renderAdminLists();
    const totalRevenue=orders.filter(o=>o.status!=='Đã hủy'&&o.status!=='Hủy đơn').reduce((s,o)=>s+o.total,0); const pending=orders.filter(o=>o.status==='Chờ xác nhận').length; const shipping=orders.filter(o=>o.status==='Đang giao').length; const stock=products.reduce((s,p)=>s+p.stock,0);
    [['statRevenue',money(totalRevenue)],['dropRevenue',money(totalRevenue)],['statPending',pending],['dropPending',pending],['statShipping',shipping],['statStock',stock]].forEach(([id,val])=>{ const el=document.getElementById(id); if(el) el.textContent=val; });
  };
  function renderAdminProducts(){ const rows=document.getElementById('adminProductRows'); if(rows) rows.innerHTML=products.map(p=>`<tr><td>${p.image?`<img class="admin-product-thumb" src="${p.image}" alt="${p.name}">`:p.emoji} <b>${p.name}</b><div class="cart-small">${p.sku}</div></td><td>${p.cat}</td><td>${money(p.price)}</td><td class="${p.stock<10?'low-stock':''}">${p.stock<10?'⚠️ ':''}${p.stock}</td><td>${p.sold}</td><td><button class="mini-btn" onclick="editProduct(${p.id})">Sửa giá</button> <button class="mini-btn" onclick="changeProductImage(${p.id})">Đổi ảnh</button> <button class="mini-btn" onclick="deleteProduct(${p.id})">Xóa</button></td></tr>`).join(''); const best=document.getElementById('bestSellerList'); if(best) best.innerHTML=[...products].sort((a,b)=>b.sold-a.sold).slice(0,4).map((p,i)=>`<div class="cart-item"><div class="${visualClass(p,'cart-icon')}">${productMiniVisual(p)}</div><div><div class="cart-name">#${i+1} ${p.name}</div><div class="cart-small">Đã bán ${p.sold} · còn ${p.stock}</div></div><strong>${money(p.price)}</strong></div>`).join(''); }
  function nextStatus(status){ return {'Chờ xác nhận':'Đã xác nhận','Đã xác nhận':'Đang đóng gói','Đang đóng gói':'Đang giao','Đang giao':'Hoàn thành'}[status] || null; }
  function actionLabel(status){ return {'Chờ xác nhận':'Xác nhận đơn','Đã xác nhận':'Chuyển đóng gói','Đang đóng gói':'Bàn giao shipper','Đang giao':'Hoàn thành'}[status] || 'Đã xong'; }
  function adminOrderActions(o){ const next=nextStatus(o.status); if(o.status==='Hoàn thành'||o.status==='Đã hủy'||o.status==='Hủy đơn') return '<span class="cart-small">Không còn thao tác</span>'; return `<button class="mini-btn ${o.status==='Chờ xác nhận'?'action-confirm':'action-next'}" onclick="advanceOrder('${o.id}')">${actionLabel(o.status)}</button><button class="mini-btn action-cancel" onclick="cancelOrder('${o.id}')">Hủy có lý do</button>`; }
  function filteredOrders(){
    const q=(document.getElementById('adminOrderSearch')?.value||'').trim().toLowerCase();
    const st=document.getElementById('adminStatusFilter')?.value||'all';
    return orders.filter(o=>{
      const okStatus = st==='all' || (st==='Đã hủy' ? (o.status==='Đã hủy'||o.status==='Hủy đơn') : o.status===st);
      const hay = `${o.id} ${o.customer} ${o.items} ${o.address||''} ${o.customerEmail||''}`.toLowerCase();
      return okStatus && (!q || hay.includes(q));
    });
  }
  window.clearAdminFilters=function(){ const q=document.getElementById('adminOrderSearch'); const st=document.getElementById('adminStatusFilter'); if(q) q.value=''; if(st) st.value='all'; renderAdmin(); };
  function renderAdminOrders(){
    const data=filteredOrders();
    const rows=document.getElementById('adminOrderRows'); if(rows) rows.innerHTML=data.map(o=>`<tr><td><b>${o.id}</b><div class="cart-small">${o.created||''}</div></td><td>${o.customer}<div class="cart-small">${o.address||''}</div></td><td>${o.items}</td><td>${money(o.total)}<div class="cart-small">${o.payment||'COD'}${o.coupon?` · ${o.coupon}`:''}</div></td><td><span class="status-chip ${statusClass(o.status)}">${o.status}</span>${timeline(o.status)}</td><td>${adminOrderActions(o)}</td></tr>`).join('') || '<tr><td colspan="6"><div class="cart-empty">Không tìm thấy đơn phù hợp.</div></td></tr>';
    const board=document.getElementById('adminOrderBoard'); if(board){ const groups=['Chờ xác nhận','Đã xác nhận','Đang đóng gói','Đang giao','Hoàn thành','Đã hủy']; board.innerHTML=groups.map(g=>{ const list=data.filter(o=> (g==='Đã hủy' ? (o.status==='Đã hủy'||o.status==='Hủy đơn') : o.status===g)).slice(0,4); return `<div class="order-column"><h4>${g}<span>${list.length}</span></h4>${list.map(o=>`<div class="admin-order-card"><div class="admin-order-top"><div><div class="admin-order-id">${o.id}</div><div class="cart-small">${o.customer}</div></div><span class="status-chip ${statusClass(o.status)}">${o.status}</span></div><div class="cart-small">${o.items}</div><div class="price" style="font-size:1.25rem;margin-top:8px">${money(o.total)}</div><div class="cart-small">${o.address||''}</div><div class="admin-order-actions">${adminOrderActions(o)}</div></div>`).join('') || '<div class="cart-empty" style="padding:14px">Không có đơn</div>'}</div>`; }).join(''); }
  }
  function renderAdminLists(){
    const vip=document.getElementById('vipCustomerList'); if(vip){ const map={}; orders.forEach(o=>{ if(o.status==='Đã hủy'||o.status==='Hủy đơn') return; map[o.customer]=map[o.customer]||{spent:0,orders:0,email:o.customerEmail||''}; map[o.customer].spent+=o.total; map[o.customer].orders++; }); vip.innerHTML=Object.entries(map).sort((a,b)=>b[1].spent-a[1].spent).slice(0,5).map(([name,d])=>{ const r=getRank(d.spent); return `<div class="customer-vip-row"><div><b>${name}</b><div class="cart-small">${d.email}</div></div><div><span class="rank-badge">${r.icon} ${r.name}</span></div><strong>${money(d.spent)}</strong></div>`; }).join('') || '<div class="cart-empty">Chưa có khách VIP.</div>'; }
    const stock=document.getElementById('stockAlertList'); if(stock){ const low=products.filter(p=>p.stock<10); stock.innerHTML=low.map(p=>`<div class="cart-item"><div class="${visualClass(p,'cart-icon')}">${productMiniVisual(p)}</div><div><div class="cart-name">${p.name}</div><div class="cart-small">Tồn kho thấp: ${p.stock}</div></div><button class="mini-btn" onclick="pRestock(${p.id})">+10</button></div>`).join('') || '<div class="cart-empty">Kho đang ổn, chưa có cảnh báo.</div>'; }
  }
  window.advanceOrder=function(id){ const o=orders.find(x=>x.id===id); if(!o) return; const next=nextStatus(o.status); if(!next) return showToast('Đơn này không thể chuyển bước.', 'warn'); o.status=next; o.history=[...(o.history||[]),next]; renderCustomerOrders(); renderAdmin(); showToast(`✅ ${o.id} → ${next}`, 'success'); };
  window.cancelOrder=function(id){ const o=orders.find(x=>x.id===id); if(!o) return; if(o.status==='Hoàn thành') return showToast('⚠️ Đơn hoàn thành không thể hủy.', 'warn'); const reason=prompt('Nhập lý do hủy đơn ' + id, 'Khách yêu cầu hủy'); if(reason===null) return; o.status='Đã hủy'; o.cancelReason=reason||'Không ghi rõ'; o.history=[...(o.history||[]),'Hủy: '+o.cancelReason]; renderCustomerOrders(); renderAdmin(); showToast('🧾 Đã hủy đơn kèm lý do.', 'info'); };
  window.setOrderStatus=function(id,status){ const o=orders.find(x=>x.id===id); if(!o) return; o.status=status; o.history=[...(o.history||[]),status]; renderCustomerOrders(); renderAdmin(); showToast('✅ Đã cập nhật trạng thái đơn ' + id, 'success'); };
  window.simulateNewOrder=function(){ const names=['Mai Anh','Bảo Ngọc','Minh Khang','Gia Linh']; const p=products[Math.floor(Math.random()*products.length)]; const customer=names[Math.floor(Math.random()*names.length)]; orders.unshift({id:'SS'+Math.floor(1000+Math.random()*9000),customer,customerEmail:customer.toLowerCase().replace(' ','.')+'@gmail.com',items:`${p.name} x1`,total:p.price,status:'Chờ xác nhận',payment:'COD',address:'Địa chỉ khách demo',created:'Vừa xong',history:['Tạo đơn']}); renderCustomerOrders(); renderAdmin(); showToast('🔔 Có đơn hàng demo mới cần xử lý!', 'info'); };
  let newAdminImageData = '';
  window.previewNewProductImage=function(event){
    const file = event?.target?.files?.[0];
    if(!file) return;
    if(!file.type.startsWith('image/')) return showToast('⚠️ Vui lòng chọn đúng file hình ảnh!', 'warn');
    const reader = new FileReader();
    reader.onload = function(){
      newAdminImageData = reader.result;
      const preview=document.getElementById('newProductImagePreview');
      const title=document.getElementById('newProductImageTitle');
      const sub=document.getElementById('newProductImageSub');
      if(preview) preview.innerHTML = `<img src="${newAdminImageData}" alt="Ảnh sản phẩm mới">`;
      if(title) title.textContent = file.name.length>20 ? file.name.slice(0,17)+'...' : file.name;
      if(sub) sub.textContent = 'Ảnh đã sẵn sàng';
      showToast('🖼️ Đã chọn ảnh sản phẩm.', 'success');
    };
    reader.readAsDataURL(file);
  };
  function resetNewProductImage(){
    newAdminImageData='';
    const input=document.getElementById('newProductImage'); if(input) input.value='';
    const preview=document.getElementById('newProductImagePreview'); if(preview) preview.textContent='📷';
    const title=document.getElementById('newProductImageTitle'); if(title) title.textContent='Chọn ảnh';
    const sub=document.getElementById('newProductImageSub'); if(sub) sub.textContent='JPG, PNG, WEBP';
  }
  window.changeProductImage=function(id){
    const p=products.find(x=>x.id===id); if(!p) return;
    const input=document.createElement('input'); input.type='file'; input.accept='image/*';
    input.onchange=function(){
      const file=input.files?.[0]; if(!file) return;
      if(!file.type.startsWith('image/')) return showToast('⚠️ File không phải hình ảnh!', 'warn');
      const reader=new FileReader();
      reader.onload=function(){ p.image=reader.result; p.imageSource='Admin upload'; renderProducts(); renderCart(); renderWishlist(); renderAdmin(); showToast('🖼️ Đã đổi ảnh cho '+p.name, 'success'); };
      reader.readAsDataURL(file);
    };
    input.click();
  };
  window.addAdminProduct=function(){
    const name=document.getElementById('newProductName')?.value.trim()||'';
    const cat=document.getElementById('newProductCat')?.value||'Áo';
    const price=parseInt(document.getElementById('newProductPrice')?.value||'0',10);
    const stock=parseInt(document.getElementById('newProductStock')?.value||'0',10);
    if(!name||price<=0||stock<0) return showToast('⚠️ Nhập đủ tên, giá và tồn kho hợp lệ!', 'warn');
    const emojiMap={Áo:'👕',Quần:'👖',Váy:'👗','Phụ kiện':'👜'};
    const newId=Date.now();
    const uploadedImage = newAdminImageData || embeddedProductImageFromName(name, cat, newId);
    products.unshift({id:newId,name,cat,price,stock,emoji:emojiMap[cat]||'👗',sold:0,tag:newAdminImageData?'Admin upload':'Admin',rating:4.6,sku:'SS-NEW-'+String(newId).slice(-4),size:'S · M · L',color:'Màu mới',image:uploadedImage,imageSource:newAdminImageData?'Admin upload':'Embedded SVG'});
    ['newProductName','newProductPrice','newProductStock'].forEach(id=>{const el=document.getElementById(id); if(el) el.value='';});
    resetNewProductImage();
    renderProducts(); renderAdmin();
    showToast('✅ Đã thêm sản phẩm mới kèm ảnh!', 'success');
  };
  window.editProduct=function(id){ const p=products.find(x=>x.id===id); if(!p) return; const newPrice=prompt('Nhập giá mới cho '+p.name,p.price); if(newPrice===null) return; const v=parseInt(newPrice,10); if(!v||v<=0) return showToast('⚠️ Giá không hợp lệ!', 'warn'); p.price=v; renderProducts(); renderCart(); renderAdmin(); showToast('✏️ Đã cập nhật giá sản phẩm.', 'success'); };
  window.deleteProduct=function(id){ products=products.filter(p=>p.id!==id); cart=cart.filter(i=>i.id!==id); wishlist=wishlist.filter(x=>x!==id); renderProducts(); renderCart(); renderWishlist(); renderAdmin(); showToast('🗑️ Đã xóa sản phẩm khỏi demo.', 'info'); };
  window.restockAll=function(){ products.forEach(p=>p.stock+=5); renderProducts(); renderAdmin(); showToast('📦 Đã nhập thêm 5 sản phẩm cho mỗi mặt hàng.', 'success'); };
  window.pRestock=function(id){ const p=products.find(x=>x.id===id); if(p) p.stock+=10; renderProducts(); renderAdmin(); showToast('📦 Đã nhập thêm 10 sản phẩm.', 'success'); };


  const LEGAL_CONTENT = {
    terms: {
      tag: 'Điều khoản sử dụng',
      html: `<h2>Điều khoản sử dụng StyleShop</h2>
      <p>Đây là nội dung demo cho website quản lý cửa hàng quần áo online. Khi tạo tài khoản, khách hàng đồng ý sử dụng thông tin đúng sự thật và tuân thủ quy trình mua hàng của shop.</p>
      <h3>1. Đặt hàng</h3><ul><li>Khách hàng có thể xem sản phẩm, chọn size, thêm vào giỏ hàng và đặt hàng COD.</li><li>Đơn hàng sẽ đi qua các bước: chờ xác nhận, đã xác nhận, đang đóng gói, đang giao và hoàn thành.</li><li>Khách hàng có thể yêu cầu hủy khi đơn chưa chuyển sang trạng thái đang giao.</li></ul>
      <h3>2. Đổi trả</h3><ul><li>Hỗ trợ đổi size trong 7 ngày nếu sản phẩm còn nguyên tem, chưa qua sử dụng.</li><li>Không áp dụng đổi trả với sản phẩm đã hư hỏng do sử dụng sai cách.</li></ul>
      <h3>3. Tài khoản VIP</h3><p>Hạng thành viên được tính theo tổng giá trị đơn hàng không bị hủy. Hạng càng cao, ưu đãi trong giỏ hàng càng tốt.</p>
      <h3>4. Lưu ý demo</h3><p>File này là bản giao diện HTML tĩnh phục vụ học tập, dữ liệu sẽ chưa lưu vĩnh viễn như hệ thống backend thật.</p>`
    },
    privacy: {
      tag: 'Chính sách bảo mật',
      html: `<h2>Chính sách bảo mật StyleShop</h2>
      <p>StyleShop cam kết chỉ sử dụng thông tin khách hàng cho mục đích xử lý đơn hàng, chăm sóc khách hàng và cải thiện trải nghiệm mua sắm.</p>
      <h3>1. Thông tin thu thập</h3><ul><li>Họ tên, email, số điện thoại, địa chỉ giao hàng.</li><li>Lịch sử đơn hàng, sản phẩm yêu thích và hạng VIP.</li></ul>
      <h3>2. Mục đích sử dụng</h3><ul><li>Xác nhận đơn hàng và giao hàng.</li><li>Gửi thông báo trạng thái đơn, voucher và ưu đãi phù hợp.</li><li>Hỗ trợ đổi mật khẩu, đổi avatar và bảo vệ tài khoản.</li></ul>
      <h3>3. Bảo mật tài khoản</h3><p>Khách hàng nên dùng mật khẩu ít nhất 8 ký tự và không chia sẻ mật khẩu cho người khác. Ở bản demo, chức năng đổi mật khẩu mô phỏng thao tác thực tế.</p>
      <h3>4. Chia sẻ dữ liệu</h3><p>Thông tin khách hàng không được bán cho bên thứ ba. Trong hệ thống thực tế, shop chỉ chia sẻ thông tin cần thiết cho đơn vị giao hàng.</p>`
    }
  };
  window.openLegal = function(type){
    const data = LEGAL_CONTENT[type] || LEGAL_CONTENT.terms;
    const tag = document.getElementById('legalTag'); const body = document.getElementById('legalContent');
    if(tag) tag.textContent = data.tag;
    if(body) body.innerHTML = data.html;
    document.body.classList.add('native-cursor');
    document.getElementById('legalModal')?.classList.add('show');
  };
  window.closeLegalModal = function(){ document.getElementById('legalModal')?.classList.remove('show'); if(!document.getElementById('productModal')?.classList.contains('show') && !document.getElementById('googleModal')?.classList.contains('show')) document.body.classList.remove('native-cursor'); };

  document.getElementById('productModal')?.addEventListener('click', e => { if(e.target.id==='productModal') closeProductModal(); });
  document.getElementById('legalModal')?.addEventListener('click', e => { if(e.target.id==='legalModal') closeLegalModal(); });
  document.getElementById('googleModal')?.addEventListener('click', e => { if(e.target.id==='googleModal') closeGoogleModal(); });
  renderProducts(); renderCart(); renderWishlist(); renderCustomerOrders(); renderAccount();
  if (location.hash === '#app') goApp();
  else if (location.hash === '#admin') goAdmin('admin');
  else if (location.hash === '#auth') goAuth('register');
})();
