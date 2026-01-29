import { MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

export default function ResultsList({ organizations, onSelect, loading }) {
    if (loading) {
        return (
            <div className="p-4 space-y-2">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="p-3">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                    </Card>
                ))}
            </div>
        );
    }

    if (organizations.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No se encontraron resultados</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            <div className="text-xs font-medium text-muted-foreground mb-2 uppercase">
                Resultados
            </div>
            {organizations.slice(0, 20).map((org) => (
                <Card
                    key={org.id}
                    className="p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => onSelect(org)}
                >
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">
                                {org.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 inline mr-1" />
                                {org.city}, {org.country}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {org.organizationType && (
                                    <Badge variant="outline" className="text-xs">
                                        {org.organizationType}
                                    </Badge>
                                )}
                                {org.sectorPrimary && (
                                    <Badge variant="secondary" className="text-xs">
                                        {org.sectorPrimary}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
            {organizations.length > 20 && (
                <p className="text-xs text-center text-muted-foreground pt-2">
                    Mostrando 20 de {organizations.length} resultados
                </p>
            )}
        </div>
    );
}
