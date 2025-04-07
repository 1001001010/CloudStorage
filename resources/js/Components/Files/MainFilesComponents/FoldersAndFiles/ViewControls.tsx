'use client'

import { Button } from '@/Components/ui/button'
import { Slider } from '@/Components/ui/slider'
import { Grid, List } from 'lucide-react'
import { useState } from 'react'

interface ViewControlsProps {
    viewMode: 'grid' | 'list'
    setViewMode: (mode: 'grid' | 'list') => void
    itemSize: number
    setItemSize: (size: number) => void
}

export default function ViewControls({
    viewMode,
    setViewMode,
    itemSize,
    setItemSize,
}: ViewControlsProps) {
    const toggleViewMode = () => {
        setViewMode(viewMode === 'grid' ? 'list' : 'grid')
    }

    const handleSizeChange = (value: number[]) => {
        setItemSize(value[0])
    }

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
                onClick={toggleViewMode}
                title={
                    viewMode === 'grid' ? 'Показать списком' : 'Показать сеткой'
                }>
                {viewMode === 'grid' ? (
                    <List className="h-4 w-4" />
                ) : (
                    <Grid className="h-4 w-4" />
                )}
            </Button>

            <div className="flex w-24 items-center gap-2">
                <Slider
                    defaultValue={[itemSize]}
                    min={50}
                    max={150}
                    step={10}
                    value={[itemSize]}
                    onValueChange={handleSizeChange}
                    className="w-full"
                    title="Размер элементов"
                />
            </div>
        </div>
    )
}
