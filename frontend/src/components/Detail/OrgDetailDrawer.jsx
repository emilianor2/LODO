import { useState, useEffect } from 'react';
import {
    X, ExternalLink, MapPin, Globe, Linkedin, Mail, Phone,
    Instagram, Tag, Briefcase, Info, Layers, Award
} from 'lucide-react';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { fetchOrganizationById } from '../../services/api';

export default function OrgDetailDrawer({ orgId, onClose }) {
    const [org, setOrg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!orgId) return;
        setLoading(true);
        setError(null);
        fetchOrganizationById(orgId)
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
        <Dialog open={!!orgId} onOpenChange={(open) => !open && onClose()}>
            <DialogContent hideClose className="sm:max-w-[600px] h-[90vh] p-0 overflow-hidden flex flex-col gap-0 border-none shadow-2xl">
                {loading ? (
                    <div className="p-8 space-y-6">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-40 w-full" />
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4">
                            Error al cargar detalles: {error}
                        </div>
                        <Button onClick={onClose}>Cerrar</Button>
                    </div>
                ) : org ? (
                    <>
                        {/* Header Image/Background placeholder */}
                        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="absolute right-4 top-4 bg-background/50 backdrop-blur hover:bg-background transition-colors rounded-full"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="px-8 -mt-10 relative z-10 flex flex-col flex-1 min-h-0">
                            <div className="bg-background p-4 rounded-2xl shadow-xl border mb-4 inline-flex self-start">
                                <Globe className="h-10 w-10 text-primary" />
                            </div>

                            <DialogHeader className="mb-6">
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">{org.organizationType}</Badge>
                                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider bg-primary/10 text-primary border-none">{org.sectorPrimary}</Badge>
                                </div>
                                <DialogTitle className="text-3xl font-extrabold tracking-tight text-foreground/90">
                                    {org.name}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-1.5 text-sm font-medium">
                                    <MapPin className="h-3.5 w-3.5 text-primary" />
                                    {org.city}, {org.country}
                                </DialogDescription>
                            </DialogHeader>

                            <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                                <TabsList className="w-full justify-start bg-transparent border-b rounded-none px-0 mb-6 gap-6 h-auto pb-2">
                                    <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-sm font-semibold transition-all">Overview</TabsTrigger>
                                    <TabsTrigger value="location" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-sm font-semibold transition-all">Location</TabsTrigger>
                                    <TabsTrigger value="links" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-sm font-semibold transition-all">Links</TabsTrigger>
                                </TabsList>

                                <ScrollArea className="flex-1 px-1">
                                    <TabsContent value="overview" className="mt-0 space-y-8 pb-8">
                                        <section>
                                            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                                                <Info className="h-4 w-4" />
                                                <h4 className="text-xs font-bold uppercase tracking-widest">Descripción</h4>
                                            </div>
                                            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                                {org.description || 'Sin descripción disponible.'}
                                            </p>
                                        </section>

                                        <Separator className="opacity-50" />

                                        <div className="grid grid-cols-2 gap-8">
                                            <section>
                                                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                                                    <Layers className="h-4 w-4" />
                                                    <h4 className="text-xs font-bold uppercase tracking-widest">Clasificación</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Etapa</p>
                                                        <p className="text-sm font-semibold">{org.stage || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase mb-1">Estado de Salida</p>
                                                        <p className="text-sm font-semibold">{org.outcomeStatus || '-'}</p>
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                                                    <Tag className="h-4 w-4" />
                                                    <h4 className="text-xs font-bold uppercase tracking-widest">Etiquetas</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {org.tags?.map((tag, i) => (
                                                        <Badge key={i} variant="outline" className="text-[10px]">{tag}</Badge>
                                                    ))}
                                                    {org.technology?.map((tech, i) => (
                                                        <Badge key={i} variant="secondary" className="text-[10px]">{tech}</Badge>
                                                    ))}
                                                    {!org.tags?.length && !org.technology?.length && <span className="text-xs text-muted-foreground italic">Ninguna</span>}
                                                </div>
                                            </section>
                                        </div>

                                        {org.impactArea?.length > 0 && (
                                            <section>
                                                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                                                    <Award className="h-4 w-4" />
                                                    <h4 className="text-xs font-bold uppercase tracking-widest">Áreas de Impacto</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {org.impactArea.map((area, i) => (
                                                        <Badge key={i} className="text-[10px] bg-green-500/10 text-green-600 hover:bg-green-500/20 border-none">{area}</Badge>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="location" className="mt-0 space-y-6 pb-8">
                                        <div className="rounded-xl border bg-muted/30 p-6 space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-primary/10 p-2 rounded-lg mt-1">
                                                    <MapPin className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg">{org.city || 'Desconocida'}</h4>
                                                    <p className="text-sm text-muted-foreground">{org.region}, {org.country}</p>
                                                </div>
                                            </div>
                                            <Separator className="bg-white/10" />
                                            {org.lat && org.lng && (
                                                <div className="text-xs text-muted-foreground">
                                                    Coordenadas: <code className="bg-muted px-1 rounded">{org.lat.toFixed(4)}, {org.lng.toFixed(4)}</code>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="links" className="mt-0 space-y-4 pb-8">
                                        {org.website && (
                                            <a href={org.website} target="_blank" rel="noopener" className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <Globe className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <p className="text-sm font-bold">Sitio Web</p>
                                                        <p className="text-xs text-muted-foreground">Visitar sitio oficial</p>
                                                    </div>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </a>
                                        )}
                                        {org.linkedinUrl && (
                                            <a href={org.linkedinUrl} target="_blank" rel="noopener" className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <Linkedin className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="text-sm font-bold">LinkedIn</p>
                                                        <p className="text-xs text-muted-foreground">Perfil de la empresa</p>
                                                    </div>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                                            </a>
                                        )}
                                        {org.contactEmail && (
                                            <div className="flex items-center gap-3 p-4 rounded-xl border bg-card">
                                                <Mail className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-bold">Contacto</p>
                                                    <p className="text-sm">{org.contactEmail}</p>
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                </ScrollArea>
                            </Tabs>
                        </div>
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}
