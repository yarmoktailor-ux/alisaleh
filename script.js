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


// متغير للتحكم في عدد الأعمدة (الافتراضي 1 أي صورة كبيرة)
let currentGridCols = 1; 

function changeGrid(cols) {
    currentGridCols = cols;
    // إعادة تشغيل الفلتر لتحديث العرض بالشكل الجديد
    const activeBtn = document.querySelector('.ready-type-btn.active');
    const currentType = activeBtn ? activeBtn.getAttribute('onclick').match(/'([^']+)'/)[1] : 'all';
    filterReady(currentType);
}

function filterReady(type, btn) {
    if(btn) {
        document.querySelectorAll('.ready-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    const display = document.getElementById('ready_display');
    const items = type === 'all' ? db.ready : db.ready.filter(i => i.cat === type);
    
    display.innerHTML = items.length ? items.map(i => `
        <div class="product-card-v2" style="grid-column: 1 / -1; background: white; text-align: right; padding-bottom: 20px; border-bottom: 5px solid #f9f9f9;">
            <img src="${i.img}" style="width: 100%; height: auto; display: block;">
            <div style="padding: 20px;">
                <h1 style="font-size: 28px; margin: 0; color: #333;">${i.title}</h1>
                <div style="font-size: 20px; color: var(--gold); font-weight: bold; margin: 10px 0;">${i.newPrice.toLocaleString()} YER</div>
                
                <div style="margin: 15px 0;">
                    <label style="display:block; font-weight:bold; margin-bottom:10px;">اختر النوع:</label>
                    <div style="display:flex; gap:10px;">
                        <button class="type-sel active" onclick="selectType(this)">بالتوفير (متر)</button>
                        <button class="type-sel" onclick="selectType(this)">طاقة كاملة</button>
                    </div>
                </div>

                <div style="background: #fdfbf7; padding: 15px; border-radius: 10px; margin: 20px 0; font-size: 14px;">
                    <p><strong>📍 بلد الصنع:</strong> ${i.origin || 'اليابان'}</p>
                    <p><strong>🧵 التركيبة:</strong> ${i.composition || 'بوليستر'}</p>
                    <p><strong>📏 العرض:</strong> 58 إنش (عرضين)</p>
                </div>

                <div style="display: flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; width: fit-content; margin-bottom: 20px;">
                    <button onclick="changeQty(this, 1)" style="padding: 10px 20px; border: none; background: none; font-size: 20px;">+</button>
                    <input type="number" value="1" min="1" style="width: 50px; text-align: center; border: none; font-size: 18px; outline: none;" readonly>
                    <button onclick="changeQty(this, -1)" style="padding: 10px 20px; border: none; background: none; font-size: 20px;">−</button>
                </div>

                <button onclick="addToCartV2('${i.title}', ${i.newPrice})" style="width: 100%; padding: 18px; background: black; color: white; border: none; border-radius: 8px; font-weight: bold; font-size: 18px; cursor: pointer;">
                    إضافة للسلة 🛒
                </button>
            </div>
        </div>
    `).join('') : '<p style="text-align:center; padding:20px;">لا يوجد منتجات</p>';
}

// دالة لتغيير الكمية
function changeQty(btn, val) {
    let input = btn.parentNode.querySelector('input');
    let newVal = parseInt(input.value) + val;
    if (newVal >= 1) input.value = newVal;
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
    const phone = document.getElementById('c_phone').value;
    const total = document.getElementById('final_total').innerText;
    const payment = document.getElementById('selected_payment').value;

    if (!name || !phone) {
        return alert("يرجى إدخال الاسم ورقم الهاتف لإتمام الطلب.");
    }

    // 1. تجميع المقاسات
    let measurements = "";
    const labels = ["الطول", "الكتف", "اليد", "الصدر", "الرقبة", "وسط يد", "الكبك", "الخطوة"];
    const inputs = document.querySelectorAll('.m-input');
    labels.forEach((label, index) => {
        if (inputs[index].value) {
            measurements += `${label}: ${inputs[index].value} انش\n`;
        }
    });

    // 2. تجميع الثياب المختارة (الأقمشة والموديلات)
    let thobesDetails = "";
    const thobeCards = document.querySelectorAll('.selected-thobe-card');
    thobeCards.forEach((card, index) => {
        const title = card.querySelector('b').innerText;
        const selects = card.querySelectorAll('select');
        thobesDetails += `\n--- ثوب تفصيل (${index + 1}) ---\n`;
        thobesDetails += `${title}\n`;
        thobesDetails += `الموديل: ${selects[0].value}\n`;
        thobesDetails += `الكم: ${selects[1].value}\n`;
        thobesDetails += `الخياطة: ${selects[2].value}\n`;
        thobesDetails += `التصميم: ${selects[3].value}\n`;
    });

    // 3. تجهيز رسالة الواتساب
    let message = `*طلب جديد من متجر اليرموك 🌙*\n\n`;
    message += `👤 *العميل:* ${name}\n`;
    message += `📞 *الهاتف:* ${phone}\n`;
    message += `\n📏 *المقاسات:*\n${measurements || "لم يتم إدخال مقاسات"}\n`;
    message += thobesDetails;
    message += `\n💰 *الإجمالي:* ${total} ريال`;
    message += `\n💳 *طريقة الدفع:* ${payment}`;

    // 4. إرسال إلى الواتساب
    const whatsappNumber = "967773463560"; // رقمك مع رمز الدولة
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // فتح الرابط
    window.open(whatsappUrl, '_blank');
}

