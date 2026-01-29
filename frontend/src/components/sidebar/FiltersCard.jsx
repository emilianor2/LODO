import React from 'react';
import FiltersPanel from '../Filters/FiltersPanel';
import ActiveChips from '../Filters/ActiveChips';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RotateCcw, Filter } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

export default function FiltersCard({ filters, onFilterChange, aggregates, onReset }) {
    return (
        <Card className="shadow-sm border-none bg-background rounded-3xl flex-shrink-0 w-full md:w-[320px] flex flex-col overflow-hidden">
            <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Filter className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-bold tracking-tight">Filtros</CardTitle>
                </div>
            </CardHeader>

            <ScrollArea className="flex-1">
                <CardContent className="p-6 pt-2">
                    <div className="mb-6">
                        <ActiveChips
                            filters={filters}
                            onRemove={onFilterChange}
                        />
                    </div>

                    <FiltersPanel
                        filters={filters}
                        onFilterChange={onFilterChange}
                        aggregates={aggregates}
                        onReset={onReset}
                        compact
                    />

                    <div className="mt-8 pt-6 border-t">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onReset}
                            className="w-full h-10 text-muted-foreground hover:text-primary hover:bg-primary/5 gap-2 transition-all rounded-xl border-dashed"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span className="text-sm font-semibold">Limpiar filtros</span>
                        </Button>
                    </div>
                </CardContent>
            </ScrollArea>
        </Card>
    );
}
