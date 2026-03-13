import { useMemo, useEffect, useRef } from 'react';
import { useStates, createState } from '../../Hooks/useStates';
import { Loader2 } from 'lucide-react';

export const MenuBarEditor = () => {
    const { s } = useStates();
    const generatedStrokes = useMemo(() => {
        const val = s.editor?.generatedStrokes;
        return Array.isArray(val) ? val : [];
    }, [s.editor?.generatedStrokes]);
    const selectedId = useMemo(() => s.editor?.selectedGeneratedId, [s.editor?.selectedGeneratedId]);
    const loading = useMemo(() => s.editor?.loading, [s.editor?.loading]);

    const logs = useMemo(() => s.editor?.generationLogs || [], [s.editor?.generationLogs]);
    const bottomRef = useRef(null);

    // Auto-scroll para los logs
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    // We need to call the select function from the editor's localStates.
    // Since the editor stores generatedStrokes in redux, we update selectedGeneratedId via createState
    // and the editor's localStates will react to it by painting the stroke.
    const [, setSelectedGeneratedId] = createState(['editor', 'selectedGeneratedId'], null);
    const [, setGeneratedStrokes] = createState(['editor', 'generatedStrokes'], []);
    const [, setHoveredGeneratedId] = createState(['editor', 'hoveredGeneratedId'], null);

    const handleSelect = (id) => {
        setSelectedGeneratedId(id);
    };

    if (loading || logs.length > 0) {
        return (
            <div className="flex flex-col h-full bg-[#1e293b] text-white p-4 justify-between border-l border-white/10">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <Loader2 className="animate-spin text-blue-400" size={24} />
                        <h3 className="font-semibold text-lg text-slate-200">Procesando Imagen</h3>
                    </div>
                    
                    <div className="flex flex-col gap-3 font-mono text-sm max-h-[70vh] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                        {logs.map((log, i) => (
                            <div 
                                key={i} 
                                className={`flex items-start gap-2 ${i === logs.length - 1 ? 'text-white opacity-100 scale-100' : 'text-slate-400 opacity-60 scale-[0.98]'} transition-all`}
                            >
                                <span className="text-blue-400 mt-0.5">❯</span>
                                <span style={{ wordBreak: 'break-word', lineHeight: 1.4 }}>{log}</span>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>
                </div>
            </div>
        );
    }

    if (generatedStrokes.length === 0) {
        return (
            <div className="p-4 text-center" style={{ color: 'var(--ce-text-muted, #94a3b8)' }}>
                <p className="text-sm">No hay trazos generados.</p>
                <p className="text-xs mt-1 opacity-70">Carga una imagen y presiona "Generar".</p>
            </div>
        );
    }

    // Build SVG path from points
    const buildSvgPath = (points) => {
        if (!points || points.length < 2) return '';
        // Normalize points to fit in 0-100 viewbox
        const xs = points.map(p => p.x);
        const ys = points.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const rangeX = maxX - minX || 1;
        const rangeY = maxY - minY || 1;
        const scale = Math.max(rangeX, rangeY);
        const offX = (100 - (rangeX / scale) * 80) / 2;
        const offY = (100 - (rangeY / scale) * 80) / 2;

        return points.map((p, i) => {
            const x = ((p.x - minX) / scale) * 80 + offX;
            const y = ((p.y - minY) / scale) * 80 + offY;
            const cmd = (i === 0 || p.type === 'M') ? 'M' : 'L';
            return `${cmd} ${x.toFixed(1)} ${y.toFixed(1)}`;
        }).join(' ');
    };

    return (
        <div className="flex flex-col gap-1 p-2 overflow-y-auto h-full">
            <p className="text-xs font-semibold uppercase tracking-wider px-2 py-1" style={{ color: 'var(--ce-text-muted, #94a3b8)' }}>
                Trazos ({generatedStrokes.filter(s => !s.painted).length}/{generatedStrokes.length})
            </p>
            {generatedStrokes.map((gs, idx) => {
                const isSelected = gs.id === selectedId;
                const svgPath = buildSvgPath(gs.points);
                return (
                    <button
                        key={gs.id}
                        onClick={() => handleSelect(gs.id)}
                        onMouseEnter={() => setHoveredGeneratedId(gs.id)}
                        onMouseLeave={() => setHoveredGeneratedId(null)}
                        className="flex items-center gap-2 p-2 rounded-lg transition-all text-left text-sm"
                        style={{
                            backgroundColor: isSelected ? gs.color + '30' : 'var(--ce-panel-hover, #334155)',
                            borderLeft: `3px solid ${gs.color}`,
                            cursor: 'pointer',
                        }}
                    >
                        {/* Mini SVG preview */}
                        <svg width="36" height="36" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
                            <path
                                d={svgPath}
                                fill="none"
                                stroke={gs.color}
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="flex flex-col">
                            <span style={{ color: gs.color, fontWeight: 500 }}>#{idx + 1}</span>
                            {gs.painted && (
                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#22c55e30', color: '#22c55e', fontSize: '0.65rem' }}>✓ Pintado</span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

export default MenuBarEditor;
