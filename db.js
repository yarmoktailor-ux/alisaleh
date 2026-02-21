let db = {
    fabrics: [],
    ready: [],
    settings: { logo: "" }
};

// هيكل المنتج الجديد ليتناسب مع "العماري"
function createProductObject(title, price, img, cat, details) {
    return {
        id: Date.now(),
        title: title,
        newPrice: price,
        img: img,
        cat: cat,
        // تفاصيل متجر العماري
        description: details.desc || "قماش فاخر من اليرموك",
        composition: details.comp || "بوليستر 100%",
        origin: details.origin || "اليابان",
        usage: details.usage || "ملابس، أثواب"
    };
}
