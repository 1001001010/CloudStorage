import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

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

export const formatDate = (date: Date | string): string => {
    return format(new Date(date), 'yyyy-MM-dd', { locale: ru })
}

// Валидация имен папок и файлов
const forbiddenNames = [
    '.',
    '..',
    'CON',
    'PRN',
    'AUX',
    'NUL',
    ...Array.from({ length: 9 }, (_, i) => `COM${i + 1}`),
    ...Array.from({ length: 9 }, (_, i) => `LPT${i + 1}`),
]

export const FolderFileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Имя не должно быть пустым')
        .max(50, 'Слишком длинное имя')
        .refine((val) => !forbiddenNames.includes(val.toUpperCase()), {
            message: 'Недопустимое имя',
        })
        .refine((val) => !/[\\/:\*\?"<>|]/.test(val), {
            message: 'Имя содержит недопустимые символы',
        }),
})
