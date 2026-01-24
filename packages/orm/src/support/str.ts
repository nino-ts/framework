export function plural(str: string): string {
    if (!str) return '';
    // Implementação muito básica de pluralização (apenas adiciona 's')
    // Em um cenário real, usaríamos uma lib ou implementação mais robusta
    if (str.endsWith('s')) return str;
    if (str.endsWith('y')) return str.slice(0, -1) + 'ies';
    return str + 's';
}

export function snake(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}
