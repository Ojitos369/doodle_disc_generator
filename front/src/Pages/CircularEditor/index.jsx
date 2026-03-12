import { Image as ImageIcon, Pencil, Eraser, Move, Eye, EyeOff, RotateCw, Hash, PenTool, Undo2, MousePointerClick, Download } from 'lucide-react';
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
        handlePointerDown, handlePointerMove, handlePointerUp, handleAddNumber
    } = state;
    editorEffect(state);

    return (
        <div className={`min-h-[calc(100vh-60px)] font-sans p-4 md:p-8 flex flex-col lg:flex-row gap-8 items-center justify-center ${styles.editorContainer}`}>
            
            {/* PANEL DE HERRAMIENTAS */}
            <div className={`w-full lg:w-[26rem] p-6 rounded-2xl shadow-xl flex flex-col gap-6 lg:max-h-[85vh] overflow-y-auto relative z-10 ${styles.panel} ${styles.customScrollbar}`}>
                
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Editor Circular</h1>
                        <p className={`text-sm ${styles.textMuted}`}>Arte gemelo rotatorio</p>
                    </div>
                    <button 
                        onClick={handleExportPNG}
                        className="p-2 rounded-lg transition"
                        style={{ backgroundColor: 'var(--ce-panel-hover)', color: 'var(--ce-accent)' }}
                        title="Exportar como PNG"
                    >
                        <Download size={20} />
                    </button>
                </div>

                {/* Cargar Imagen y Trozos */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Cargar Imagen</label>
                        <label 
                            className="flex items-center justify-center gap-2 cursor-pointer p-3 rounded-lg transition font-medium shadow-md"
                            style={{ backgroundColor: 'var(--ce-accent)', color: '#fff' }}
                        >
                            <ImageIcon size={20} />
                            Seleccionar archivo
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>
                </div>

                {/* Herramientas Principales */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">Herramienta</label>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setTool('draw-twin')} className="flex-1 flex justify-center p-3 rounded-lg transition min-w-[3rem]" style={tool === 'draw-twin' ? {backgroundColor: 'var(--ce-accent)', color: '#fff'} : {backgroundColor: 'var(--ce-panel-hover)', color: 'var(--ce-text)'}} title="Lápiz Gemelo (Negro/Rojo)"><Pencil size={20} /></button>
                        <button onClick={() => setTool('draw-blue')} className="flex-1 flex justify-center p-3 rounded-lg transition min-w-[3rem]" style={tool === 'draw-blue' ? {backgroundColor: 'var(--ce-tool-blue)', color: '#fff'} : {backgroundColor: 'var(--ce-panel-hover)', color: 'var(--ce-tool-blue)'}} title="Lápiz Azul (Independiente)"><PenTool size={20} /></button>
                        <button onClick={() => setTool('stamp-number')} className="flex-1 flex justify-center p-3 rounded-lg transition min-w-[3rem]" style={tool === 'stamp-number' ? {backgroundColor: 'var(--ce-tool-purple)', color: '#fff'} : {backgroundColor: 'var(--ce-panel-hover)', color: 'var(--ce-tool-purple)'}} title="Estampar Número Morado (Clic)"><MousePointerClick size={20} /></button>
                        <button onClick={() => setTool('erase')} className="flex-1 flex justify-center p-3 rounded-lg transition min-w-[3rem]" style={tool === 'erase' ? {backgroundColor: 'var(--ce-accent)', color: '#fff'} : {backgroundColor: 'var(--ce-panel-hover)', color: 'var(--ce-text)'}} title="Borrador Universal"><Eraser size={20} /></button>
                        <button onClick={() => setTool('pan')} className="flex-1 flex justify-center p-3 rounded-lg transition min-w-[3rem]" style={tool === 'pan' ? {backgroundColor: 'var(--ce-accent)', color: '#fff'} : {backgroundColor: 'var(--ce-panel-hover)', color: 'var(--ce-text)'}} title="Mover Imagen"><Move size={20} /></button>
                    </div>
                </div>

                {/* Botón de Números Consecutivos y Deshacer */}
                <div className="flex gap-2 border-t pt-4 mt-2" style={{ borderColor: 'var(--ce-border)' }}>
                    <button 
                        onClick={handleUndo} disabled={history.length === 0}
                        className="flex items-center justify-center gap-2 p-3 rounded-lg transition w-12"
                        style={history.length === 0 ? {backgroundColor: 'var(--ce-panel-hover)', opacity: 0.5, cursor: 'not-allowed'} : {backgroundColor: 'var(--ce-panel-hover)'}}
                        title="Deshacer"
                    >
                        <Undo2 size={20} />
                    </button>
                    <button 
                        onClick={handleAddNumber}
                        className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition font-medium shadow-md"
                        style={{ backgroundColor: 'var(--ce-tool-amber)', color: '#fff' }}
                    >
                        <Hash size={20} />
                        Sellar Top ({strokes.filter(s => s.type === 'draw-twin' || !s.type).length})
                    </button>
                </div>

                {/* Controles Deslizantes e Inputs */}
                <div className="flex flex-col gap-4 border-t pt-4 mt-2" style={{ borderColor: 'var(--ce-border)' }}>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-sm">Ancho de lápiz/borrador</label>
                        <div className="flex items-center gap-3">
                            <input type="range" min="1" max="50" value={brushWidth} onChange={(e) => setBrushWidth(Number(e.target.value))} className="flex-1" style={{ accentColor: 'var(--ce-accent)' }} />
                            <input type="number" min="1" max="50" value={brushWidth} onChange={(e) => setBrushWidth(Number(e.target.value))} className={`w-16 text-center rounded p-1 text-sm ${styles.inputControl}`} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm">Tamaño números (Top)</label>
                        <div className="flex items-center gap-3">
                            <input type="range" min="10" max="150" value={numberSize} onChange={(e) => setNumberSize(Number(e.target.value))} className="flex-1" style={{ accentColor: 'var(--ce-accent)' }} />
                            <input type="number" min="10" max="150" value={numberSize} onChange={(e) => setNumberSize(Number(e.target.value))} className={`w-16 text-center rounded p-1 text-sm ${styles.inputControl}`} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm" style={{ color: 'var(--ce-tool-purple)' }}>Tamaño morado (Manual)</label>
                        <div className="flex items-center gap-3">
                            <input type="range" min="10" max="150" value={purpleNumberSize} onChange={(e) => setPurpleNumberSize(Number(e.target.value))} className="flex-1" style={{ accentColor: 'var(--ce-tool-purple)' }} />
                            <input type="number" min="10" max="150" value={purpleNumberSize} onChange={(e) => setPurpleNumberSize(Number(e.target.value))} className={`w-16 text-center rounded p-1 text-sm ${styles.inputControl}`} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm">Escala de imagen</label>
                        <div className="flex items-center gap-3">
                            <input type="range" min="0.1" max="5" step="0.1" value={imageScale} onChange={(e) => setImageScale(Number(e.target.value))} className="flex-1" style={{ accentColor: 'var(--ce-accent)' }} />
                            <input type="number" min="0.1" max="10" step="0.1" value={imageScale} onChange={(e) => setImageScale(Number(e.target.value))} className={`w-16 text-center rounded p-1 text-sm ${styles.inputControl}`} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="flex items-center gap-1 text-sm"><RotateCw size={16}/> Rotación del círculo</label>
                        <div className="flex items-center gap-3">
                            <input type="range" min="0" max="360" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className="flex-1" style={{ accentColor: 'var(--ce-accent)' }} />
                            <input type="number" value={rotation} onChange={(e) => setRotation(Number(e.target.value))} className={`w-20 text-center rounded p-1 text-sm ${styles.inputControl}`} />
                        </div>
                    </div>
                </div>

                {/* Visibilidad de Capas */}
                <div className="flex flex-col gap-2 border-t pt-4 mt-2 mb-4" style={{ borderColor: 'var(--ce-border)' }}>
                    <label className="text-sm font-semibold">Visibilidad de Capas</label>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => setLayers(prev => ({...prev, black: !prev.black}))} className="flex items-center justify-between p-2 px-3 rounded-lg transition" style={{ backgroundColor: 'var(--ce-panel-hover)'}}>
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border" style={{ backgroundColor: 'var(--ce-text)', borderColor: 'var(--ce-border)'}}></div> Trazo Negro</span>
                            {layers.black ? <Eye size={18} /> : <EyeOff size={18} className={styles.textMuted} />}
                        </button>
                        <button onClick={() => setLayers(prev => ({...prev, red: !prev.red}))} className="flex items-center justify-between p-2 px-3 rounded-lg transition" style={{ backgroundColor: 'var(--ce-panel-hover)'}}>
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border opacity-80" style={{ backgroundColor: 'var(--ce-tool-red)', borderColor: 'var(--ce-tool-red)'}}></div> Trazo Rojo</span>
                            {layers.red ? <Eye size={18} /> : <EyeOff size={18} className={styles.textMuted} />}
                        </button>
                        <button onClick={() => setLayers(prev => ({...prev, blue: !prev.blue}))} className="flex items-center justify-between p-2 px-3 rounded-lg transition" style={{ backgroundColor: 'var(--ce-panel-hover)'}}>
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border" style={{ backgroundColor: 'var(--ce-tool-blue)', borderColor: 'var(--ce-tool-blue)'}}></div> Trazo Azul</span>
                            {layers.blue ? <Eye size={18} /> : <EyeOff size={18} className={styles.textMuted} />}
                        </button>
                        <button onClick={() => setLayers(prev => ({...prev, numbers: !prev.numbers}))} className="flex items-center justify-between p-2 px-3 rounded-lg transition" style={{ backgroundColor: 'var(--ce-panel-hover)'}}>
                            <span className="flex items-center gap-2"><Hash size={14} style={{ color: 'var(--ce-tool-amber)' }} /> Números</span>
                            {layers.numbers ? <Eye size={18} /> : <EyeOff size={18} className={styles.textMuted} />}
                        </button>
                        <button onClick={() => setLayers(prev => ({...prev, image: !prev.image}))} className="flex items-center justify-between p-2 px-3 rounded-lg transition" style={{ backgroundColor: 'var(--ce-panel-hover)'}}>
                            <span className="flex items-center gap-2"><ImageIcon size={14}/> Imagen Base</span>
                            {layers.image ? <Eye size={18} /> : <EyeOff size={18} className={styles.textMuted} />}
                        </button>
                    </div>
                </div>

            </div>

            {/* AREA DEL CANVAS */}
            <div className="flex-1 flex justify-center items-center w-full z-0 h-[60vh] lg:h-auto">
                <div className={`p-2 md:p-4 rounded-2xl shadow-2xl relative w-full max-w-[800px] aspect-square ${styles.panel}`}>
                    <canvas
                        ref={canvasRef}
                        width={canvasSize}
                        height={canvasSize}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        className={`w-full h-full rounded-xl object-contain touch-none ${
                            tool.startsWith('draw') || tool === 'stamp-number' ? 'cursor-crosshair' : tool === 'erase' ? 'cursor-cell' : 'cursor-move'
                        }`}
                        style={{ touchAction: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
}

export default CircularEditor;
