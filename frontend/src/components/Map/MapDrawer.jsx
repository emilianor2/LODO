import React, { useEffect } from 'react';
import { X, Filter, List, Search, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';
import FiltersPanel from '../Filters/FiltersPanel';
import ResultsList from '../Results/ResultsList';
import ActiveChips from '../Filters/ActiveChips';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function MapDrawer({
    isOpen,
    onClose,
    activeTab,
    onTabChange,
    filters,
    onFilterChange,
    aggregates,
    onResetFilters,
    organizations,
    onSelectOrg,
    loadingResults,
    loadingFacets,
    searchQuery,
    onSearchChange
}) {

    // Prevent body scroll when drawer is open on mobile
    useEffect(() => {
        if (isOpen && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Sidebar / Modal */}
            <aside
                className={cn(
                    "fixed z-[2100] bg-background shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    // Center positioning for all screens (Modal style)
                    "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-[480px] h-[85vh] rounded-[2.5rem] border",
                    // Open States (Scale & Opacity)
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                )}
            >
                {/* 1. STICKY HEADER (Fixed Height) */}
                <div className="flex-shrink-0 bg-background z-20">
                    <div className="flex items-center justify-between p-8 pb-4">
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter text-foreground leading-none">Explorar</h2>
                            <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest mt-3 opacity-60">
                                {activeTab === 'filters' ? 'Configurar filtros' : `${organizations.length} Startups encontradas`}
                            </p>
                        </div>
                        <Button
                            variant="secondary"
                            size="icon"
                            onClick={onClose}
                            className="rounded-2xl h-12 w-12 hover:rotate-90 transition-transform duration-300 bg-muted/50"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="px-8 py-4">
                        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                            <TabsList className="w-full h-14 bg-muted/40 p-1.5 rounded-2xl border border-border/40">
                                <TabsTrigger
                                    value="filters"
                                    className="flex-1 rounded-xl font-black text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all h-full"
                                >
                                    <Filter className="h-4 w-4" />
                                    Filtros
                                </TabsTrigger>
                                <TabsTrigger
                                    value="results"
                                    className="flex-1 rounded-xl font-black text-xs uppercase tracking-widest gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all h-full"
                                >
                                    <List className="h-4 w-4" />
                                    Resultados
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="mt-4 min-h-[44px] flex items-center">
                            <ActiveChips filters={filters} onRemove={onFilterChange} />
                        </div>
                    </div>
                </div>

                {/* 2. BODY CONTENT (Large Scrollable Area) */}
                <div className="flex-1 min-h-0 overflow-hidden relative">
                    <Tabs value={activeTab} className="h-full">
                        <TabsContent value="filters" className="m-0 h-full outline-none">
                            <ScrollArea className="h-full">
                                <div className="px-8 pb-32 pt-2">
                                    <FiltersPanel
                                        filters={filters}
                                        onFilterChange={onFilterChange}
                                        aggregates={aggregates}
                                        loading={loadingFacets}
                                    />

                                    <div className="mt-12 pt-10 border-t border-border/40 flex flex-col gap-4">
                                        <Button
                                            onClick={() => onTabChange("results")}
                                            className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 text-lg active:scale-95 transition-all"
                                        >
                                            Ver {organizations.length} Resultados
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={onResetFilters}
                                            className="w-full h-12 rounded-2xl text-muted-foreground font-bold hover:text-primary transition-all gap-2"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                            Limpiar todos los filtros
                                        </Button>
                                    </div>
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="results" className="m-0 h-full outline-none flex flex-col">
                            <div className="px-8 pb-4 flex-shrink-0">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Buscar entre resultados..."
                                        value={searchQuery}
                                        onChange={(e) => onSearchChange(e.target.value)}
                                        className="pl-12 h-14 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 shadow-inner rounded-3xl font-bold text-base"
                                    />
                                </div>
                            </div>

                            <ScrollArea className="flex-1 bg-muted/5 border-t border-border/30">
                                <ResultsList
                                    organizations={organizations}
                                    onSelect={(org) => {
                                        onSelectOrg(org);
                                        onClose(); // Always close the drawer when selecting an org
                                    }}
                                    loading={loadingResults}
                                    hideHeader
                                />
                                {organizations.length === 0 && !loadingResults && (
                                    <div className="p-16 text-center font-bold text-muted-foreground uppercase tracking-widest opacity-40">
                                        Sin resultados
                                    </div>
                                )}
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </aside>
        </>
    );
}
