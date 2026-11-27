const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

export function toPersianDigits(value) {
    return String(value ?? '')
        .replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)])
        .replace(/[٠-٩]/g, (d) => PERSIAN_DIGITS[d.charCodeAt(0) - 0x0660]);
}
