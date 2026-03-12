import { useState } from 'react';
import { Image as ImageIcon, Pencil, Eraser, Move, Eye, EyeOff, RotateCw, Hash, PenTool, Undo2, MousePointerClick, Download, ChevronLeft, Settings2, Shuffle } from 'lucide-react';
import { localStates, editorEffect } from './localStates';
import styles from './styles/index.module.scss';

export function CircularEditor() {
    const state = localStates();
    const {
        canvasSize, canvasRef,
        tool, setTool,
        layers, setLayers,
        brushWidth, setBrushWidth,
        numberSize, setNumberSize,
        purpleNumberSize, setPurpleNumberSize,
        imageScale, setImageScale,
        rotation, setRotation,
        history, strokes,
        handleUndo, handleExportPNG, handleImageUpload,
        handlePointerDown, handlePointerMove, handlePointerUp, handleAddNumber,
        strokeCount, setStrokeCount, handleGenerateStrokes, generatedStrokes,
    } = state;
    editorEffect(state);

    const [panelOpen, setPanelOpen] = useState(true);

    const ToolBtn = ({ onClick, active, activeColor, inactiveColor, title, children }) => (
        <button
            onClick={onClick}
            className={`flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 ${styles.toolBtn}`}
            style={active
                ? { backgroundColor: activeColor || 'var(--ce-accent)', color: '#fff', boxShadow: '0 0 12px ' + (activeColor || 'var(--ce-accent)') + '40' }
                : { backgroundColor: 'var(--ce-panel-hover)', color: inactiveColor || 'var(--ce-text)' }
            }
            title={title}
        >
            {children}
        </button>
    );

    return (
        <div className={`h-[calc(100vh-50px)] font-sans flex relative overflow-hidden ${styles.editorContainer}`}>

            {/* PANEL DE HERRAMIENTAS — colapsable */}
            <div
                className={`flex flex-col transition-all duration-300 ease-in-out relative z-20 ${styles.customScrollbar}`}
                style={{ width: panelOpen ? '22rem' : '0', minWidth: panelOpen ? '22rem' : '0', opacity: panelOpen ? 1 : 0 }}
            >
                <div className={`h-full overflow-y-auto p-4 flex flex-col gap-4 ${styles.panel}`}>
                    
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h1 className="text-lg font-bold">Editor Circular</h1>
                        <div className="flex gap-1">
                            <button onClick={handleExportPNG} className={`p-2 rounded-lg transition ${styles.iconBtn}`} title="Exportar PNG">
                                <Download size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Cargar Imagen */}
                    <label
                        className={`flex items-center justify-center gap-2 cursor-pointer p-2.5 rounded-lg transition font-medium text-sm ${styles.accentBtn}`}
                    >
                        <ImageIcon size={18} />
                        Cargar imagen
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>

                    {/* Herramientas */}
                    <div className="flex flex-col gap-1.5">
                        <label className={`text-xs font-semibold uppercase tracking-wider ${styles.textMuted}`}>Herramientas</label>
                        <div className="grid grid-cols-5 gap-1.5">
                            <ToolBtn onClick={() => setTool('draw-twin')} active={tool === 'draw-twin'} title="Lápiz Gemelo"><Pencil size={18} /></ToolBtn>
                            <ToolBtn onClick={() => setTool('draw-blue')} active={tool === 'draw-blue'} activeColor="var(--ce-tool-blue)" inactiveColor="var(--ce-tool-blue)" title="Lápiz Azul"><PenTool size={18} /></ToolBtn>
                            <ToolBtn onClick={() => setTool('stamp-number')} active={tool === 'stamp-number'} activeColor="var(--ce-tool-purple)" inactiveColor="var(--ce-tool-purple)" title="Estampar Número"><MousePointerClick size={18} /></ToolBtn>
                            <ToolBtn onClick={() => setTool('erase')} active={tool === 'erase'} title="Borrador"><Eraser size={18} /></ToolBtn>
                            <ToolBtn onClick={() => setTool('pan')} active={tool === 'pan'} title="Mover Imagen"><Move size={18} /></ToolBtn>
                        </div>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="flex gap-1.5">
                        <button
                            onClick={handleUndo} disabled={history.length === 0}
                            className={`p-2.5 rounded-lg transition ${styles.toolBtn}`}
                            style={history.length === 0 ? { opacity: 0.35, cursor: 'not-allowed', backgroundColor: 'var(--ce-panel-hover)' } : { backgroundColor: 'var(--ce-panel-hover)' }}
                            title="Deshacer"
                        >
                            <Undo2 size={18} />
                        </button>
                        <button
                            onClick={handleAddNumber}
                            className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-lg transition font-medium text-sm ${styles.amberBtn}`}
                        >
                            <Hash size={18} />
                            Sellar #{strokes.filter(s => s.type === 'draw-twin' || !s.type).length}
                        </button>
                    </div>

                    {/* Generar Trazos */}
                    <div className={`flex flex-col gap-1.5 border-t pt-3 ${styles.borderColor}`}>
                        <label className={`text-xs font-semibold uppercase tracking-wider ${styles.textMuted}`}>Generar Trazos</label>
                        <div className="flex gap-1.5">
                            <input
                                type="number" min={1} max={50} value={strokeCount}
                                onChange={(e) => setStrokeCount(Number(e.target.value))}
                                className={`w-16 text-center rounded p-2 text-sm ${styles.inputControl}`}
                            />
                            <button
                                onClick={handleGenerateStrokes}
                                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition font-medium text-sm ${styles.accentBtn}`}
                            >
                                <Shuffle size={16} />
                                Generar ({(Array.isArray(generatedStrokes) ? generatedStrokes : []).filter(s => !s.painted).length})
                            </button>
                        </div>
                    </div>

                    {/* Controles */}
                    <div className={`flex flex-col gap-3 border-t pt-3 ${styles.borderColor}`}>
                        <label className={`text-xs font-semibold uppercase tracking-wider ${styles.textMuted}`}>Ajustes</label>

                        <SliderRow label="Grosor trazo" value={brushWidth} onChange={setBrushWidth} min={1} max={50} />
                        <SliderRow label="Números (Top)" value={numberSize} onChange={setNumberSize} min={10} max={150} />
                        <SliderRow label="Números (Manual)" value={purpleNumberSize} onChange={setPurpleNumberSize} min={10} max={150} color="var(--ce-tool-purple)" />
                        <SliderRow label="Escala imagen" value={imageScale} onChange={setImageScale} min={0.1} max={5} step={0.1} />

                        <div className="flex flex-col gap-1">
                            <label className="flex items-center gap-1.5 text-xs"><RotateCw size={13}/> Rotación</label>
                            <div className="flex items-center gap-2">
                                <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className={`flex-1 ${styles.slider}`} />
                                <input type="number" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className={`w-14 text-center rounded p-1 text-xs ${styles.inputControl}`} />
                            </div>
                        </div>
                    </div>

                    {/* Capas */}
                    <div className={`flex flex-col gap-1.5 border-t pt-3 mb-2 ${styles.borderColor}`}>
                        <label className={`text-xs font-semibold uppercase tracking-wider ${styles.textMuted}`}>Capas</label>
                        <LayerToggle label="Negro" color="var(--ce-text)" active={layers.black} onClick={() => setLayers(p => ({...p, black: !p.black}))} />
                        <LayerToggle label="Rojo" color="var(--ce-tool-red)" active={layers.red} onClick={() => setLayers(p => ({...p, red: !p.red}))} />
                        <LayerToggle label="Azul" color="var(--ce-tool-blue)" active={layers.blue} onClick={() => setLayers(p => ({...p, blue: !p.blue}))} />
                        <LayerToggle label="Números" color="var(--ce-tool-amber)" active={layers.numbers} onClick={() => setLayers(p => ({...p, numbers: !p.numbers}))} icon={<Hash size={12} />} />
                        <LayerToggle label="Imagen" color="var(--ce-text-muted)" active={layers.image} onClick={() => setLayers(p => ({...p, image: !p.image}))} icon={<ImageIcon size={12} />} />
                        <LayerToggle label="Generados" color="var(--ce-tool-blue)" active={layers.generated} onClick={() => setLayers(p => ({...p, generated: !p.generated}))} icon={<Shuffle size={12} />} />
                    </div>
                </div>
            </div>

            {/* Botón toggle panel */}
            <button
                onClick={() => setPanelOpen(!panelOpen)}
                className={`absolute top-2 z-30 p-1.5 rounded-r-lg transition-all duration-300 ${styles.toggleBtn}`}
                style={{ left: panelOpen ? '22rem' : '0' }}
                title={panelOpen ? 'Ocultar panel' : 'Mostrar panel'}
            >
                {panelOpen ? <ChevronLeft size={18} /> : <Settings2 size={18} />}
            </button>

            {/* AREA DEL CANVAS */}
            <div className="flex-1 flex justify-center items-center p-4 overflow-hidden">
                <div className={`rounded-2xl shadow-2xl relative aspect-square ${styles.panel}`}
                     style={{ maxHeight: 'calc(100vh - 82px)', maxWidth: 'calc(100vh - 82px)', width: '100%' }}
                >
                    <canvas
                        ref={canvasRef}
                        width={canvasSize}
                        height={canvasSize}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        className={`w-full h-full rounded-2xl object-contain touch-none ${
                            tool.startsWith('draw') || tool === 'stamp-number' ? 'cursor-crosshair' : tool === 'erase' ? 'cursor-cell' : 'cursor-move'
                        }`}
                        style={{ touchAction: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
}

/* --- Sub-componentes internos --- */

function SliderRow({ label, value, onChange, min, max, step = 1, color }) {
    return (
        <div className="flex flex-col gap-0.5">
            <label className="text-xs" style={color ? { color } : undefined}>{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="range" min={min} max={max} step={step} value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={`flex-1 ${styles.slider}`}
                    style={color ? { accentColor: color } : undefined}
                />
                <input
                    type="number" min={min} max={max} step={step} value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={`w-14 text-center rounded p-1 text-xs ${styles.inputControl}`}
                />
            </div>
        </div>
    );
}

function LayerToggle({ label, color, active, onClick, icon }) {
    return (
        <button onClick={onClick} className={`flex items-center justify-between p-1.5 px-2.5 rounded-lg transition text-sm ${styles.layerBtn}`}>
            <span className="flex items-center gap-2">
                {icon || <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></div>}
                {label}
            </span>
            {active ? <Eye size={15} /> : <EyeOff size={15} className={styles.textMuted} />}
        </button>
    );
}

export default CircularEditor;
