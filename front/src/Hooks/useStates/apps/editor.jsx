export const editor = props => {
    const { miAxios, u1 } = props;

    const generateStrokesFromImage = ({ imageData, n, canvasSize, center, circleRadius }) => {
        const end = 'editor/generate-strokes';
        const payload = {
            image_base64: imageData,
            n: n,
            canvas_size: canvasSize,
            center: center,
            circle_radius: circleRadius,
        };

        u1("editor", "loading", true);

        return miAxios.post(end, payload)
        .then(res => {
            const strokes = (res.data?.strokes || []).map((s, idx) => ({
                ...s,
                id: Date.now() + idx,
                painted: false,
            }));
            u1("editor", "generatedStrokes", strokes);
            u1("editor", "loading", false);
            return strokes;
        })
        .catch(err => {
            console.error('Error generating strokes:', err);
            u1("editor", "loading", false);
            return [];
        });
    };

    return {
        generateStrokesFromImage,
    }
}
