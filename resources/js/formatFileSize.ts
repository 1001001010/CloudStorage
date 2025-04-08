export const formatFileSize = (
    bytes: number,
    inputUnit: 'Б' | 'КБ' | 'МБ' | 'ГБ' = 'Б',
    outputUnit: 'Б' | 'КБ' | 'МБ' | 'ГБ' = 'ГБ'
) => {
    const units = {
        Б: 1,
        КБ: 1024,
        МБ: 1024 * 1024,
        ГБ: 1024 * 1024 * 1024,
    }

    // Преобразуем входной размер в байты
    const sizeInBytes = bytes * units[inputUnit]

    // Вычисляем результат
    const result = sizeInBytes / units[outputUnit]

    return result % 1 === 0
        ? `${result} ${outputUnit}`
        : `${result.toFixed(2)} ${outputUnit}`
}

export const AutoFormatFileSize = (bytes: number) => {
    const kb = 1024 // 1KB = 1024 байт
    const mb = 1024 * 1024 // 1MB = 1024 * 1024 байт
    const gb = 1024 * 1024 * 1024 // 1GB = 1024 * 1024 * 1024 байт

    if (bytes >= gb) {
        return `${(bytes / gb).toFixed(2)} ГБ`
    } else if (bytes >= mb) {
        return `${(bytes / mb).toFixed(2)} МБ`
    } else if (bytes >= kb) {
        return `${(bytes / kb).toFixed(2)} КБ`
    } else {
        return `${bytes} Б`
    }
}
