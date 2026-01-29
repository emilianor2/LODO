import { X, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

export default function FiltersPanel({ filters, onFilterChange, aggregates, onReset }) {
    const activeFiltersCount = Object.values(filters).filter(v => v && v !== true && v !== 'true').length;

    const renderSelect = (key, label, items) => (
        <div className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <select
                id={key}
                value={filters[key]}
                onChange={(e) => onFilterChange(key, e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
                <option value="">Todos</option>
                {items?.map(item => (
                    <option key={item.value} value={item.value}>
                        {item.value} ({item.count})
                    </option>
                ))}
            </select>
        </div>
    );

    const activeFiltersList = Object.entries(filters)
        .filter(([key, value]) => value && key !== 'onlyMappable' && key !== 'q')
        .map(([key, value]) => ({ key, value }));

    return (
        <div className="p-4 space-y-6">
            {/* Header con reset */}
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-sm text-muted-foreground">
                        {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}
                    </span>
                </div>
                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onReset}
                        className="h-8"
                    >
                        <RotateCcw className="h-3 w-3 mr-2" />
                        Resetear
                    </Button>
                )}
            </div>

            {/* Active filters chips */}
            {activeFiltersList.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {activeFiltersList.map(({ key, value }) => (
                        <Badge
                            key={key}
                            variant="secondary"
                            className="cursor-pointer hover:bg-secondary/80 pl-3 pr-1"
                        >
                            <span>{value}</span>
                            <button
                                onClick={() => onFilterChange(key, '')}
                                className="ml-2 h-5 w-5 flex items-center justify-center rounded-full hover:bg-muted"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="space-y-4">
                {renderSelect('country', 'País', aggregates?.countries)}
                {renderSelect('sectorPrimary', 'Sector', aggregates?.sectorsPrimary)}
                {renderSelect('organizationType', 'Tipo', aggregates?.organizationTypes)}
                {renderSelect('stage', 'Etapa', aggregates?.stages)}
                {renderSelect('outcomeStatus', 'Estado', aggregates?.outcomeStatuses)}

                {/* Only mappable switch */}
                <div className="flex items-center space-x-2 pt-2">
                    <input
                        type="checkbox"
                        id="onlyMappable"
                        checked={filters.onlyMappable}
                        onChange={(e) => onFilterChange('onlyMappable', e.target.checked)}
                        className="h-4 w-4 rounded border-input"
                    />
                    <Label htmlFor="onlyMappable" className="text-sm font-normal cursor-pointer">
                        Solo con coordenadas
                    </Label>
                </div>
            </div>
        </div>
    );
}
