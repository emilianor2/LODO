import React from 'react';
import ResultsList from '../Results/ResultsList';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LayoutList, Search } from 'lucide-react';
import { Input } from '../ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export default function ResultsCard({ organizations, onSelect, loading, searchQuery, onSearchChange }) {
    return (
        <Card className="shadow-sm border-none bg-background rounded-3xl flex-1 flex flex-col overflow-hidden">
            <CardHeader className="p-6 pb-4 space-y-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <LayoutList className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold tracking-tight">Resultados</CardTitle>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 opacity-70">
                                {organizations.length} Disponibles
                            </p>
                        </div>
                    </div>

                    <Select defaultValue="newest">
                        <SelectTrigger className="w-[140px] h-9 text-xs border-none bg-muted/40 focus:ring-1 focus:ring-primary rounded-xl font-medium">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-xl">
                            <SelectItem value="newest">Más recientes</SelectItem>
                            <SelectItem value="az">Nombre (A-Z)</SelectItem>
                            <SelectItem value="za">Nombre (Z-A)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Buscar por nombre..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 h-11 bg-muted/40 border-transparent focus-visible:ring-1 focus-visible:ring-primary rounded-2xl transition-all font-medium text-sm"
                    />
                </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 overflow-hidden">
                <ResultsList
                    organizations={organizations}
                    onSelect={onSelect}
                    loading={loading}
                    hideHeader
                />
            </CardContent>
        </Card>
    );
}
