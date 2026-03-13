export const editor = props => {
    const { miAxios, u1 } = props;

    const generateStrokesFromImage = ({ imageData, n, canvasSize, center, circleRadius, clientId, currentRotation }) => {
        const end = 'editor/generate-strokes';
        
        const payload = {
            image_base64: imageData,
            n: n,
            canvas_size: canvasSize,
            center: center,
            circle_radius: circleRadius,
        };

        u1("editor", "loading", true);

        // Handle clientId as a query parameter
        const config = {};
        if (clientId) {
            config.params = { client_id: clientId };
        }

        return miAxios.post(end, payload, config)
        .then(res => {
            const strokes = (res.data?.strokes || []).map((s, idx) => ({
                ...s,
                id: Date.now() + idx,
                painted: false,
                initialRotation: currentRotation || 0, // Added initialRotation
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

    const previewGroupsFromImage = ({ imageData, canvasSize, center, circleRadius }) => {
        const end = 'editor/preview-groups';
        const payload = {
            image_base64: imageData,
            canvas_size: canvasSize,
            center: center,
            circle_radius: circleRadius,
        };

        return miAxios.post(end, payload)
        .then(res => res.data?.groups || [])
        .catch(err => {
            console.error('Error previewing groups:', err);
            return [];
        });
    };

    return {
        generateStrokesFromImage,
        previewGroupsFromImage,
    }
}
