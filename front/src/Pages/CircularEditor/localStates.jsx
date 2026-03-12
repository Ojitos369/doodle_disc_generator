import { useState, useRef, useEffect, useMemo } from 'react';
import { useStates, createState } from '../../Hooks/useStates';

export const localStates = () => {
    const { f, s } = useStates();
    const isInMd = useMemo(() => s.app?.general?.isInMd, [s.app?.general?.isInMd]);

    // Variables base
    const canvasSize = 800;
    const center = canvasSize / 2;
    const circleRadius = 350;

    // Estados para la página (NavBar, Title)
    const [menubarOpen, setMenuBarOpen] = createState(['menubar', 'open'], false);
    const [sidebarOpen, setSideBarOpen] = createState(['sidebar', 'open'], false);
    const [titulo, setTitulo] = createState(['page', 'title'], "");
    const [actualPage, setActualPage] = createState(['page', 'actual'], "");
    const [actualMenu, setActualMenu] = createState(['page', 'actualMenu'], "");
    const [menuBarMode, setMenuBarMode] = createState(['menubar', 'menuMode'], null);

    // Estados propios del editor
    const [image, setImage] = useState(null);
    const [imagePos, setImagePos] = useState({ x: 0, y: 0 });
    const [imageScale, setImageScale] = useState(1);
    const [rotation, setRotation] = useState(0); 
    const [strokes, setStrokes] = useState([]); 
    const [currentStroke, setCurrentStroke] = useState(null); 
    const [layers, setLayers] = useState({ black: true, red: true, blue: true, image: true, numbers: true });
    const [tool, setTool] = useState('draw-twin'); 
    const [brushWidth, setBrushWidth] = useState(5);
    const [numberSize, setNumberSize] = useState(48);
    const [purpleNumberSize, setPurpleNumberSize] = useState(48);
    const [stampedNumbers, setStampedNumbers] = useState([]);
    const [history, setHistory] = useState([]);
    
    const [isInteracting, setIsInteracting] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const eraseStartRef = useRef(null);
    const canvasRef = useRef(null);

    const init = () => {
        setTitulo("Editor Circular");
        setActualPage("editor");
        setActualMenu("herramientas");
        setMenuBarMode('menuBarDefault');
        setMenuBarOpen(false);
        setSideBarOpen(false);
    }

    const handleUndo = () => {
        if (history.length === 0) return;
        const lastState = history[history.length - 1];
        setStrokes(lastState.strokes);
        setStampedNumbers(lastState.stampedNumbers);
        setHistory(prev => prev.slice(0, -1));
    };

    const handleExportPNG = () => {
        if (!canvasRef.current) return;
        const url = canvasRef.current.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'editor-circular.png';
        a.click();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setImage(img);
                    setImagePos({ x: 0, y: 0 });
                    setImageScale(1);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const getPointerPos = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const handleErase = (pos) => {
        setStrokes(prev => prev.filter(stroke => {
            const isHit = stroke.points.some(p => {
                let hitRed = false;
                let hitBlack = false;
                let hitBlue = false;

                if (stroke.type === 'draw-twin' || !stroke.type) {
                    if (layers.red) {
                        const distRed = Math.hypot(p.x - pos.x, p.y - pos.y);
                        hitRed = distRed < brushWidth * 1.5;
                    }
                    if (layers.black) {
                        const rotOffset = (rotation - stroke.initialRotation) * Math.PI / 180;
                        const dx = p.x - center;
                        const dy = p.y - center;
                        const rx = center + dx * Math.cos(rotOffset) - dy * Math.sin(rotOffset);
                        const ry = center + dx * Math.sin(rotOffset) + dy * Math.cos(rotOffset);
                        const distBlack = Math.hypot(rx - pos.x, ry - pos.y);
                        hitBlack = distBlack < brushWidth * 1.5;
                    }
                } else if (stroke.type === 'draw-blue') {
                    if (layers.blue) {
                        const rotOffset = (rotation - stroke.initialRotation) * Math.PI / 180;
                        const dx = p.x - center;
                        const dy = p.y - center;
                        const rx = center + dx * Math.cos(rotOffset) - dy * Math.sin(rotOffset);
                        const ry = center + dx * Math.sin(rotOffset) + dy * Math.cos(rotOffset);
                        const distBlue = Math.hypot(rx - pos.x, ry - pos.y);
                        hitBlue = distBlue < brushWidth * 1.5;
                    }
                }
                return hitRed || hitBlack || hitBlue;
            });
            return !isHit;
        }));

        setStampedNumbers(prev => prev.filter(num => {
            if (!layers.numbers) return true; 

            const rotOffset = (rotation - num.initialRotation) * Math.PI / 180;
            const dx = num.x - center;
            const dy = num.y - center;
            const rx = center + dx * Math.cos(rotOffset) - dy * Math.sin(rotOffset);
            const ry = center + dx * Math.sin(rotOffset) + dy * Math.cos(rotOffset);
            const dist = Math.hypot(rx - pos.x, ry - pos.y);
            const currentSize = num.type === 'manual' ? purpleNumberSize : numberSize;
            const hitRadius = (currentSize / 2) + (brushWidth * 1.5);
            return dist >= hitRadius;
        }));
    };

    const handlePointerDown = (e) => {
        const pos = getPointerPos(e);
        setIsInteracting(true);
        e.target.setPointerCapture(e.pointerId);

        if (tool.startsWith('draw')) {
            setCurrentStroke({
                id: Date.now(),
                points: [pos],
                width: brushWidth,
                initialRotation: rotation,
                type: tool 
            });
        } else if (tool === 'stamp-number') {
            setHistory(prev => [...prev, { strokes, stampedNumbers }]);
            const blackStrokesCount = strokes.filter(s => s.type === 'draw-twin' || !s.type).length;
            setStampedNumbers(prev => [...prev, {
                id: Date.now(),
                value: blackStrokesCount,
                x: pos.x,
                y: pos.y,
                initialRotation: rotation,
                type: 'manual' 
            }]);
        } else if (tool === 'pan') {
            setDragStart({ x: pos.x - imagePos.x, y: pos.y - imagePos.y });
        } else if (tool === 'erase') {
            eraseStartRef.current = { strokes, stampedNumbers };
            handleErase(pos);
        }
    };

    const handlePointerMove = (e) => {
        if (!isInteracting) return;
        const pos = getPointerPos(e);

        if (tool.startsWith('draw') && currentStroke) {
            setCurrentStroke(prev => ({ ...prev, points: [...prev.points, pos] }));
        } else if (tool === 'pan') {
            setImagePos({ x: pos.x - dragStart.x, y: pos.y - dragStart.y });
        } else if (tool === 'erase') {
            handleErase(pos); 
        }
    };

    const handlePointerUp = (e) => {
        setIsInteracting(false);
        e.target.releasePointerCapture(e.pointerId);

        if (tool.startsWith('draw') && currentStroke) {
            setHistory(prev => [...prev, { strokes, stampedNumbers }]);
            setStrokes(prev => [...prev, currentStroke]);
            setCurrentStroke(null);
        } else if (tool === 'erase') {
            if (eraseStartRef.current && (
                strokes.length !== eraseStartRef.current.strokes.length ||
                stampedNumbers.length !== eraseStartRef.current.stampedNumbers.length
            )) {
                setHistory(prev => [...prev, eraseStartRef.current]);
            }
            eraseStartRef.current = null;
        }
    };

    const handleAddNumber = () => {
        setHistory(prev => [...prev, { strokes, stampedNumbers }]);
        const blackStrokesCount = strokes.filter(s => s.type === 'draw-twin' || !s.type).length;
        
        setStampedNumbers(prev => [...prev, {
            id: Date.now(),
            value: blackStrokesCount,
            x: center,
            y: center - circleRadius + 50, 
            initialRotation: rotation,
            type: 'auto'
        }]);
    };

    return {
        init,
        canvasSize, center, circleRadius,
        canvasRef, eraseStartRef,
        image, setImage, imagePos, setImagePos, imageScale, setImageScale,
        rotation, setRotation,
        strokes, setStrokes,
        currentStroke, setCurrentStroke,
        layers, setLayers,
        tool, setTool,
        brushWidth, setBrushWidth,
        numberSize, setNumberSize,
        purpleNumberSize, setPurpleNumberSize,
        stampedNumbers, setStampedNumbers,
        history, setHistory,
        isInteracting, setIsInteracting,
        dragStart, setDragStart,
        handleUndo, handleExportPNG, handleImageUpload,
        getPointerPos, handleErase, handlePointerDown, handlePointerMove, handlePointerUp, handleAddNumber
    }
}

export const editorEffect = (state) => {
    const { 
        init, canvasRef, canvasSize, center, circleRadius,
        image, imagePos, imageScale, rotation, strokes, currentStroke, layers, brushWidth, stampedNumbers, numberSize, purpleNumberSize
    } = state;

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        ctx.fillStyle = '#1e293b'; 
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, circleRadius, 0, Math.PI * 2);
        ctx.clip(); 

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        // 1. DIBUJAR IMAGEN
        if (layers.image && image) {
            ctx.globalAlpha = 0.5; 
            ctx.save();
            ctx.translate(center + imagePos.x, center + imagePos.y);
            ctx.scale(imageScale, imageScale);
            ctx.drawImage(image, -image.width / 2, -image.height / 2);
            ctx.restore();
            ctx.globalAlpha = 1.0; 
        }

        const renderStrokeLine = (stroke, color, rotOffset, alpha) => {
            if (stroke.points.length < 2) return;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.translate(center, center);
            ctx.rotate((rotOffset * Math.PI) / 180);
            ctx.translate(-center, -center);

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = stroke.width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
            for (let i = 1; i < stroke.points.length; i++) {
                ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
            }
            ctx.stroke();
            ctx.restore();
        };

        const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;

        // 2. DIBUJAR TRAZOS ROJOS (Estáticos)
        if (layers.red) {
            allStrokes.forEach(stroke => {
                if (stroke.type === 'draw-twin' || !stroke.type) {
                    renderStrokeLine(stroke, '#ef4444', 0, 0.5); 
                }
            });
        }

        // 3. DIBUJAR TRAZOS NEGROS (Rotan)
        if (layers.black) {
            allStrokes.forEach(stroke => {
                if (stroke.type === 'draw-twin' || !stroke.type) {
                    const rotOffset = rotation - stroke.initialRotation;
                    renderStrokeLine(stroke, '#0f172a', rotOffset, 1.0); 
                }
            });
        }

        // 4. DIBUJAR TRAZOS AZULES (Rotan)
        if (layers.blue) {
            allStrokes.forEach(stroke => {
                if (stroke.type === 'draw-blue') {
                    const rotOffset = rotation - stroke.initialRotation;
                    renderStrokeLine(stroke, '#3b82f6', rotOffset, 1.0); 
                }
            });
        }

        // 5. DIBUJAR NÚMEROS CONSECUTIVOS (Rotan)
        if (layers.numbers) {
            stampedNumbers.forEach(num => {
                const rotOffset = rotation - num.initialRotation;
                ctx.save();
                ctx.translate(center, center);
                ctx.rotate((rotOffset * Math.PI) / 180);
                ctx.translate(-center, -center);

                const isManual = num.type === 'manual';
                const currentSize = isManual ? purpleNumberSize : numberSize;

                ctx.font = `bold ${currentSize}px sans-serif`;
                ctx.fillStyle = isManual ? '#a855f7' : '#0f172a';
                ctx.strokeStyle = '#ffffff'; 
                ctx.lineWidth = Math.max(2, currentSize / 8); 
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const displayText = (num.value === 6 || num.value === 9) ? `${num.value}.` : num.value.toString();
                
                ctx.strokeText(displayText, num.x, num.y);
                ctx.fillText(displayText, num.x, num.y);
                
                if (num.type === 'auto') {
                    ctx.beginPath();
                    const lineStartY = num.y - currentSize * 0.55; 
                    const lineEndY = num.y - currentSize * 0.95;   
                    ctx.moveTo(num.x, lineStartY);
                    ctx.lineTo(num.x, lineEndY);
                    ctx.strokeStyle = '#0f172a'; 
                    ctx.lineWidth = Math.max(2, currentSize / 10);
                    ctx.stroke();
                }

                ctx.restore();
            });
        }

        ctx.restore(); 

        ctx.beginPath();
        ctx.arc(center, center, circleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 4;
        ctx.stroke();

    }, [image, imagePos, imageScale, rotation, strokes, currentStroke, layers, brushWidth, stampedNumbers, numberSize, purpleNumberSize]);
}
