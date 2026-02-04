import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '../ui/accordion';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../ui/select';
import { useTaxonomies } from '../../context/TaxonomiesContext';

export default function FiltersPanel({ filters, onFilterChange, aggregates, loading = false }) {
    const { taxonomies } = useTaxonomies();

    // Helper to merge taxonomy labels with real-time counts from aggregates
    const getOptionsWithCounts = (category, aggregateField) => {
        const taxonomyList = taxonomies[category] || [];
        const aggregateList = aggregates && aggregates[aggregateField] ? aggregates[aggregateField] : [];

        // Debug logging
        if (aggregateField === 'countries') {
            console.log('🔍 Country Filter Debug:', {
                aggregateField,
                aggregatesExists: !!aggregates,
                aggregateList,
                taxonomyList
            });
        }

        const countMap = {};
        aggregateList.forEach(item => {
            countMap[item.value] = item.count;
        });

        // Use aggregates as source if they exist (to show what's actually in DB)
        // or taxonomies as fallback for empty states.
        if (aggregateList.length > 0) {
            const options = aggregateList
                .filter(item => item.value && item.value.trim() !== '') // Filter out empty values
                .map(item => {
                    const taxMatch = taxonomyList.find(t => t.value === item.value || t.id === item.value);
                    return {
                        value: item.value,
                        label: taxMatch?.label || item.value,
                        count: item.count
                    };
                });

            if (aggregateField === 'countries') {
                console.log('✅ Generated country options:', options);
            }

            return options;
        }

        // Fallback for initial load or if no results
        return taxonomyList
            .filter(t => (t.value || t.id) && (t.value || t.id).trim() !== '')
            .map(t => ({
                value: t.value || t.id,
                label: t.label || t.value,
                count: 0
            }));
    };

    const filterConfigs = [
        { key: 'country', label: 'País / Región', agg: 'countries', tax: 'country' },
        { key: 'sectorPrimary', label: 'Sector Principal', agg: 'sectorsPrimary', tax: 'sectorPrimary' },
        { key: 'organizationType', label: 'Tipo de Organización', agg: 'organizationTypes', tax: 'organizationType' },
        { key: 'stage', label: 'Etapa / Madurez', agg: 'stages', tax: 'stage' },
        { key: 'outcomeStatus', label: 'Estado de Impacto', agg: 'outcomeStatuses', tax: 'outcomeStatus' },
    ];

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-20 bg-muted/20 animate-pulse rounded-[2rem]" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Dynamic Filters */}
            <Accordion type="multiple" className="w-full space-y-3">
                {filterConfigs.map((config) => {
                    const options = getOptionsWithCounts(config.tax, config.agg);
                    const currentValue = filters[config.key] || "all";

                    // Debug logging for Select behavior
                    if (config.key === 'country') {
                        console.log('🎯 Country Select State:', {
                            key: config.key,
                            currentValue,
                            optionsCount: options.length,
                            filterValue: filters[config.key]
                        });
                    }

                    return (
                        <AccordionItem
                            key={config.key}
                            value={config.key}
                            className="border-none bg-muted/30 rounded-2xl px-5 transition-all data-[state=open]:bg-muted/50"
                        >
                            <AccordionTrigger className="hover:no-underline py-4">
                                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-foreground/70">
                                    {config.label} {filters[config.key] && "●"}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-5">
                                <Select
                                    value={currentValue}
                                    onValueChange={(val) => {
                                        console.log('🔄 Select Value Changed:', {
                                            filter: config.key,
                                            newValue: val,
                                            willSetTo: val === "all" ? "" : val
                                        });
                                        onFilterChange(config.key, val === "all" ? "" : val);
                                    }}
                                    onOpenChange={(isOpen) => {
                                        console.log('📂 Select Open State Changed:', {
                                            filter: config.key,
                                            isOpen,
                                            optionsAvailable: options.length
                                        });
                                    }}
                                >
                                    <SelectTrigger
                                        className="w-full h-10 bg-background border border-border/40 shadow-sm rounded-xl font-bold text-[12px] focus:ring-2 focus:ring-primary/20"
                                        onClick={() => console.log('👆 Select Trigger Clicked:', config.key)}
                                    >
                                        <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="rounded-xl border-none shadow-2xl max-h-[260px] z-[9999]"
                                        position="popper"
                                        sideOffset={5}
                                        onPointerDownOutside={() => console.log('🚪 Select closed (clicked outside)')}
                                        container={document.body}
                                    >
                                        <SelectItem value="all" className="font-extrabold text-[9px] uppercase opacity-50">Todos</SelectItem>
                                        {options.map((opt, idx) => {
                                            if (config.key === 'country' && idx === 0) {
                                                console.log('🎨 Rendering first country option:', opt);
                                            }
                                            return (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    <div className="flex justify-between items-center w-full gap-6 min-w-[180px]">
                                                        <span className="font-bold text-[12px]">{opt.label}</span>
                                                        <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-black tabular-nums">
                                                            {opt.count}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}
