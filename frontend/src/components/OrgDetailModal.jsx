import { useState, useEffect } from 'react';
import { X, ExternalLink, MapPin, Globe, Linkedin, Mail, Phone, Instagram, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { fetchOrganizationDetail } from '../services/api';

export default function OrgDetailModal({ orgId, onClose }) {
    const [org, setOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetchOrganizationDetail(orgId)
            .then(data => {
                setOrg(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [orgId]);

    return (
        <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <CardHeader className="border-b">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {loading ? (
                                <Skeleton className="h-6 w-3/4" />
                            ) : (
                                <CardTitle>{org?.name}</CardTitle>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                {/* Content */}
                <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    ) : error ? (
                        <p className="text-destructive">Error: {error}</p>
                    ) : org ? (
                        <div className="space-y-6">
                            {/* Description */}
                            {org.description && (
                                <div>
                                    <h3 className="font-semibold mb-2">Descripción</h3>
                                    <p className="text-sm text-muted-foreground">{org.description}</p>
                                </div>
                            )}

                            {/* Classification */}
                            <div>
                                <h3 className="font-semibold mb-3">Clasificación</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Tipo:</span>
                                        <p className="font-medium">{org.organizationType}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Sector:</span>
                                        <p className="font-medium">{org.sectorPrimary}</p>
                                    </div>
                                    {org.stage && (
                                        <div>
                                            <span className="text-muted-foreground">Etapa:</span>
                                            <p className="font-medium">{org.stage}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-muted-foreground">Estado:</span>
                                        <p className="font-medium">{org.outcomeStatus}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Ubicación
                                </h3>
                                <p className="text-sm">{org.city}, {org.region}, {org.country}</p>
                            </div>

                            {/* Links */}
                            <div>
                                <h3 className="font-semibold mb-3">Enlaces</h3>
                                <div className="space-y-2">
                                    {org.website && (
                                        <a
                                            href={org.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                                        >
                                            <Globe className="h-4 w-4" />
                                            Sitio web
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                    {org.linkedinUrl && (
                                        <a
                                            href={org.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                                        >
                                            <Linkedin className="h-4 w-4" />
                                            LinkedIn
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                    {org.instagramUrl && (
                                        <a
                                            href={org.instagramUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                                        >
                                            <Instagram className="h-4 w-4" />
                                            Instagram
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                    {org.contactEmail && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="h-4 w-4" />
                                            {org.contactEmail}
                                        </div>
                                    )}
                                    {org.contactPhone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4" />
                                            {org.contactPhone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tags & Technology */}
                            {(org.tags?.length > 0 || org.technology?.length > 0 || org.impactArea?.length > 0) && (
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Tag className="h-4 w-4" />
                                        Tags & Tecnología
                                    </h3>
                                    <div className="space-y-3">
                                        {org.tags?.length > 0 && (
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Tags:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {org.tags.map((tag, i) => (
                                                        <Badge key={i} variant="outline">{tag}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {org.technology?.length > 0 && (
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Tecnología:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {org.technology.map((tech, i) => (
                                                        <Badge key={i} variant="secondary">{tech}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {org.impactArea?.length > 0 && (
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Áreas de impacto:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {org.impactArea.map((area, i) => (
                                                        <Badge key={i} variant="success">{area}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            {org.notes && (
                                <div>
                                    <h3 className="font-semibold mb-2">Notas</h3>
                                    <p className="text-sm text-muted-foreground">{org.notes}</p>
                                </div>
                            )}
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </div>
    );
}
