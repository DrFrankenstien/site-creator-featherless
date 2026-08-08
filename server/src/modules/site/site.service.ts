export function generateSecureHex(bytesLength: number) {
    const bytes = crypto.getRandomValues(new Uint8Array(bytesLength));
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}