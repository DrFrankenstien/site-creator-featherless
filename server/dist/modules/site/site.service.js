export function generateSecureHex(bytesLength) {
    const bytes = crypto.getRandomValues(new Uint8Array(bytesLength));
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}
//# sourceMappingURL=site.service.js.map