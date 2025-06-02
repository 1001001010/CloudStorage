'use client'

import { Button } from '@/Components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'
import {
    Calendar,
    ChevronDown,
    Clock,
    RotateCcw,
    SortAsc,
    SortDesc,
    Tag,
} from 'lucide-react'
import { Badge } from '@/Components/ui/badge'
import { FilterControlsProps, FilterType } from '@/types'
// import { FilterType } from ''

export default function FilterControls({
    filterType,
    setFilterType,
    sortDirection,
    setSortDirection,
    onReset,
}: FilterControlsProps) {
    const filterOptions = [
        {
            value: 'name',
            label: 'По названию',
            icon: <Tag className="h-4 w-4" />,
        },
        {
            value: 'created_at',
            label: 'По дате создания',
            icon: <Calendar className="h-4 w-4" />,
        },
        {
            value: 'updated_at',
            label: 'По дате обновления',
            icon: <Clock className="h-4 w-4" />,
        },
    ]

    const getFilterLabel = () => {
        return (
            filterOptions.find((option) => option.value === filterType)
                ?.label || 'Фильтр'
        )
    }

    const getFilterIcon = () => {
        return filterOptions.find((option) => option.value === filterType)?.icon
    }

    return (
        <div className="px-auto flex h-full w-max flex-wrap items-center justify-between gap-2 max-sm:justify-center">
            <Badge
                variant="outline"
                className="flex h-9 items-center gap-2 px-3 py-1.5">
                {getFilterIcon()}
                <span className="inline max-sm:hidden">{getFilterLabel()}</span>
            </Badge>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                        <span className="">Фильтр</span>
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                    {filterOptions.map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() =>
                                setFilterType(option.value as FilterType)
                            }
                            className="flex cursor-pointer items-center whitespace-nowrap">
                            <div className="mr-2 max-sm:mr-0">
                                {option.icon}
                            </div>
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                variant="outline"
                size="sm"
                onClick={() =>
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                }
                className="h-9"
                title={
                    sortDirection === 'asc' ? 'По возрастанию' : 'По убыванию'
                }>
                {sortDirection === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                ) : (
                    <SortDesc className="h-4 w-4" />
                )}
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="h-9 gap-1"
                title="Сбросить фильтры">
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Сбросить</span>
            </Button>
        </div>
    )
}
