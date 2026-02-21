// script.js - محرك عمليات اليرموك

function toggleYaqoot() {
    const chat = document.getElementById('yaqoot_chat');
    chat.style.display = chat.style.display === 'block' ? 'none' : 'block';
}

function yaqootReply(type) {
    const text = document.getElementById('chat_text');
    const replies = {
        policy: "<b>🛡️ ضمان اليرموك:</b> نضمن لك المقاس 100%. التعديل أو الاستبدال مجاني تماماً خلال 3 أيام.",
        offer: "<b>🎁 عرض الكاش:</b> عند دفع كامل المبلغ مقدماً، تحصل على تطريز يدوي مجاني أو علبة كبكات فاخرة.",
        about: "<b>📜 قصة اليرموك:</b> بدأت رحلتنا في 2002.. تعلمنا أن الثوب هو شخصية الرجل."
    };
    text.innerHTML = replies[type] || text.innerHTML;
}

function switchMainTab(t) {
    document.querySelectorAll('.section, .tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById('section_'+t).classList.add('active');
    event.currentTarget.classList.add('active');
}

function openAdmin() { if(prompt("كلمة مرور الإدارة:") === "1234") document.getElementById('adminPanel').style.display='flex'; }
function closeAdmin() { document.getElementById('adminPanel').style.display='none'; }

function encodeImg(i) { let r = new FileReader(); r.onload = (e) => tempImg = e.target.result; r.readAsDataURL(i.files[0]); }
function encodeReceipt(i) { let r = new FileReader(); r.onload = (e) => receiptImg = e.target.result; r.readAsDataURL(i.files[0]); }

function saveProduct() {
    const cat = document.getElementById('adm_cat').value;
    const title = document.getElementById('adm_title').value;
    const newP = document.getElementById('adm_new').value;
    if (cat === 'logo') document.getElementById('store_logo').src = tempImg;
    else if (cat === 'fabric') db.fabrics.push({ title, newPrice: newP, img: tempImg });
    else db.ready.push({ cat, title, newPrice: newP, img: tempImg });
    alert("تم النشر بنجاح"); filterReady('all'); closeAdmin();
}

function openFabricModal() {
    const list = document.getElementById('modal_fabric_list');
    list.innerHTML = db.fabrics.length ? db.fabrics.map(f => `
        <div style="border:1px solid #eee; padding:8px; text-align:center; cursor:pointer; border-radius:12px;" onclick="confirmFabricSelection('${f.title}', ${f.newPrice}, '${f.img}')">
            <img src="${f.img}" style="width:100%; height:80px; object-fit:cover; border-radius:8px;">
            <div style="font-size:11px; font-weight:bold;">${f.title}</div>
            <div style="font-size:11px; color:green;">${f.newPrice} ريال</div>
        </div>
    `).join('') : 'يرجى إضافة أقمشة من الإدارة';
    document.getElementById('fabricModal').style.display = 'flex';
}

function confirmFabricSelection(name, price, img) {
    const id = Date.now();
    const card = document.createElement('div');
    card.className = 'selected-thobe-card';
    card.id = `thobe_${id}`;
    card.innerHTML = `
        <button type="button" class="remove-card" onclick="removeThobe(${id})">×</button>
        <div style="display:flex; gap:12px; align-items:center;">
            <img src="${img}" style="width:50px; height:50px; border-radius:8px; object-fit:cover;">
            <div><b>ثوب: ${name}</b><br><span style="color:green;">${price} ريال</span></div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:10px;">
            <select class="thobe-opt"><option>قلاب ملكي</option><option>صيني</option></select>
            <select class="thobe-opt"><option>كبك قماش</option><option>سادة</option></select>
        </div>
        <input type="hidden" class="item-price" value="${price}">
    `;
    document.getElementById('tailor_list').appendChild(card);
    calcGrandTotal();
    document.getElementById('fabricModal').style.display = 'none';
}

function filterReady(type, btn) {
    if(btn) {
        document.querySelectorAll('.ready-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    const display = document.getElementById('ready_display');
    const items = type === 'all' ? db.ready : db.ready.filter(i => i.cat === type);
    display.innerHTML = items.length ? items.map(i => `
        <div class="product-card">
            <img src="${i.img}">
            <div style="padding:10px;">
                <div style="font-size:13px; font-weight:bold;">${i.title}</div>
                <span class="new-price">${i.newPrice} ريال</span>
                <button onclick="addReadyToCart(${i.newPrice})" style="width:100%; background:var(--gold); border:none; color:white; padding:8px; border-radius:8px; cursor:pointer;">إضافة للطلب</button>
            </div>
        </div>
    `).join('') : 'لا توجد منتجات';
}

function addReadyToCart(p) { readyCartTotal += parseInt(p); calcGrandTotal(); alert("تمت الإضافة"); }
function removeThobe(id) { document.getElementById(`thobe_${id}`).remove(); calcGrandTotal(); }

function calcGrandTotal() {
    let t = readyCartTotal;
    document.querySelectorAll('.item-price').forEach(i => t += parseInt(i.value || 0));
    document.getElementById('final_total').innerText = t.toLocaleString();
}

function selectPayment(m, d, el) {
    document.querySelectorAll('.pay-card-ui').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('account_display').style.display = 'block';
    document.getElementById('account_number').innerText = d;
    document.getElementById('selected_payment').value = m + " (" + d + ")";
    document.getElementById('receipt_section').style.display = 'block';
}

function submitOrder() {
    const name = document.getElementById('c_name').value;
    const total = document.getElementById('final_total').innerText;
    if (!name || total === "0") return alert("أكمل البيانات أولاً");

    const orderData = {
        name: name,
        phone: document.getElementById('c_phone').value,
        total: total,
        payment: document.getElementById('selected_payment').value,
        date: new Date().toLocaleString('ar-YE')
    };

    fetch('https://ali991278.app.n8n.cloud/webhook-test/e4bcc169-93c0-42c5-8226-528f3c6a72e3', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(orderData)
    }).then(() => {
        alert("اكتمل طلبك بنجاح في اليرموك");
        location.reload();
    });
}
