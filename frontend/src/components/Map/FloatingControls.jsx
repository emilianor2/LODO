import React from 'react';
import { Button } from '../ui/button';
import { Filter, List, Map as MapIcon, Layers } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FloatingControls({
    onOpenFilters,
    onOpenList,
    resultsCount,
    loading
}) {
    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[900] flex items-center gap-3 w-max max-w-[90vw]">
            {/* Search/Filter Pill Container */}
            <div className="flex items-center bg-background/70 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl p-1.5 transition-all hover:shadow-[0_8px_40px_rgba(0,0,0,0.18)]">

                {/* Filters Button */}
                <Button
                    variant="ghost"
                    onClick={onOpenFilters}
                    className="h-10 px-4 rounded-xl flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300 font-bold text-sm tracking-tight"
                >
                    <Filter className="h-4 w-4" />
                    <span>Filtros</span>
                </Button>

                <div className="w-[1px] h-6 bg-border mx-1" />

                {/* Results Button */}
                <Button
                    variant="ghost"
                    onClick={onOpenList}
                    className="h-10 px-4 rounded-xl flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300 font-bold text-sm tracking-tight"
                >
                    <List className="h-4 w-4 flex-shrink-0" />
                    <span>Mostrar resultados en lista</span>
                    <span className="ml-1 shrink-0 bg-primary/10 text-primary min-w-[28px] px-2 py-0.5 rounded-full text-[10px] inline-flex items-center justify-center font-black tabular-nums transition-all">
                        {resultsCount}
                    </span>
                </Button>
            </div>

            {/* Loading Indicator - Absolute to prevent shifting the center pill */}
            <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 pointer-events-none w-max">
                {loading && (
                    <div className="flex items-center gap-2 bg-background/90 backdrop-blur-md border border-primary/20 px-4 py-2 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-500">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary/80">Actualizando mapa</span>
                    </div>
                )}
            </div>
        </div>
    );
}
