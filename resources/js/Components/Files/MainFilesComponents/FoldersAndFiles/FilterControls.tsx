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

export type FilterType = 'name' | 'created_at' | 'updated_at'
export type SortDirection = 'asc' | 'desc'

interface FilterControlsProps {
    filterType: FilterType
    setFilterType: (type: FilterType) => void
    sortDirection: SortDirection
    setSortDirection: (direction: SortDirection) => void
    onReset: () => void
}

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
            icon: <Tag className="mr-2 h-4 w-4" />,
        },
        {
            value: 'created_at',
            label: 'По дате создания',
            icon: <Calendar className="mr-2 h-4 w-4" />,
        },
        {
            value: 'updated_at',
            label: 'По дате обновления',
            icon: <Clock className="mr-2 h-4 w-4" />,
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
        <div className="flex items-center gap-2">
            <Badge
                variant="outline"
                className="flex items-center gap-1 px-3 py-1.5">
                {getFilterIcon()}
                <span>{getFilterLabel()}</span>
            </Badge>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                        Фильтр
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {filterOptions.map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            onClick={() =>
                                setFilterType(option.value as FilterType)
                            }
                            className="flex cursor-pointer items-center">
                            {option.icon}
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                variant="outline"
                size="icon"
                onClick={() =>
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                }
                className="h-9 w-9"
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
                size="icon"
                onClick={onReset}
                className="h-9 w-9"
                title="Сбросить фильтры">
                <RotateCcw className="h-4 w-4" />
            </Button>
        </div>
    )
}
