export function percentDifferens(amount, total) {
    if (typeof amount !== 'number' || typeof total !== 'number') return 0;
    if (amount === 0) return 0;
    return Number((((total - amount) / amount) * 100).toFixed(2));
}

export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}



