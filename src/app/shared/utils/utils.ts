/**
 * Kiểm tra một chuỗi có phải là URL hợp lệ hay không
 * @param url Chuỗi cần kiểm tra
 * @returns true nếu là URL hợp lệ, ngược lại false
 */
export function isValidURL(url: string): boolean {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,})|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?' + // port and path
        '(\\?[;&a-zA-Z0-9%_+.~#?&//=]*)?' + // query string
        '(\\#[-a-zA-Z0-9_]*)?$' // fragment locator
    );

    return pattern.test(url);
}

/**
 * Kiểm tra một chuỗi có phải là số hợp lệ hay không
 * @param input Chuỗi cần kiểm tra
 * @returns true nếu là số hợp lệ, ngược lại false
 */
export function isValidNumber(input: string): boolean {
    const pattern = /^-?\d+(\.\d+)?$/; // Biểu thức chính quy kiểm tra số nguyên và số thập phân
    return pattern.test(input);
}

/**
 * Kiểm tra một chuỗi chỉ chứa chữ cái và cho phép duy nhất một khoảng trắng giữa các từ
 * @param input Chuỗi cần kiểm tra
 * @returns true nếu chuỗi chỉ chứa chữ cái và có tối đa một khoảng trắng, ngược lại false
 */
export function isAlphabetWithSingleSpace(input: string): boolean {
    const pattern = /^[A-Za-z]+( [A-Za-z]+)?$/; // Biểu thức chính quy kiểm tra chỉ chứa chữ cái (a-z, A-Z) với một khoảng trắng
    return pattern.test(input);
}

/**
 * Kiểm tra một chuỗi có phải là địa chỉ email hợp lệ hay không
 * @param email Chuỗi cần kiểm tra
 * @returns true nếu là địa chỉ email hợp lệ, ngược lại false
 */
export function isValidEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Biểu thức chính quy kiểm tra email hợp lệ
    return pattern.test(email);
}

/**
 * Kiểm tra một chuỗi có phải là số điện thoại hợp lệ hay không
 * @param phoneNumber Chuỗi cần kiểm tra
 * @returns true nếu là số điện thoại hợp lệ, ngược lại false
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
    // Biểu thức chính quy kiểm tra số điện thoại quốc tế và Việt Nam
    const pattern = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
    return pattern.test(phoneNumber);
}

/**
 * Kiểm tra một giá trị có phải là số lượng hợp lệ và không âm hay không
 * @param value Giá trị cần kiểm tra
 * @returns true nếu là số lượng hợp lệ và không âm, ngược lại false
 */
export function isNonNegativeNumber(value: any): boolean {
    return typeof value === 'number' && isFinite(value) && value >= 0;
}

/**
 * Kiểm tra một số có nằm trong khoảng từ min đến max hay không
 * @param value Số cần kiểm tra
 * @param min Giá trị tối thiểu
 * @param max Giá trị tối đa
 * @returns true nếu số nằm trong khoảng từ min đến max, ngược lại false
 */
export function isNumberInRange(value: any, min: number, max: number): boolean {
    return typeof value === 'number' && isFinite(value) && value >= min && value <= max;
}