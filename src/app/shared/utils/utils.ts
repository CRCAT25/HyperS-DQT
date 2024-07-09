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
