// script.js

// وظائف التبديل والنافبا
function switchMainTab(t) {
    document.querySelectorAll('.section, .tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById('section_'+t).classList.add('active');
    event.currentTarget.classList.add('active');
}

// وظائف عرض المنتجات والشبكة
function changeGrid(cols) {
    currentGridCols = cols;
    filterReady('all');
}

function filterReady(type, btn) {
    // استخدم الكود المطور الذي قدمته لك سابقاً هنا
    // مع تعديل المسارات لتناسب الملفات الجديدة
}

// وظائف الحسابات والطلب
function calcGrandTotal() {
    let t = readyCartTotal;
    document.querySelectorAll('.item-price').forEach(i => t += parseInt(i.value || 0));
    document.getElementById('final_total').innerText = t.toLocaleString();
}

function submitOrder() {
    // كود إرسال الطلب عبر الـ Webhook
}

// تهيئة المدخلات عند التشغيل
document.addEventListener('DOMContentLoaded', () => {
    filterReady('all');
    // أي وظائف أخرى تحتاج للعمل فور التحميل
});
