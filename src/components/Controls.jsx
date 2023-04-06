export default function Controls({ run, stepForward, position, numSteps }) {
    return (
        <div className="controls">
            <button onClick={run}>Run</button>
            {' '}
            <button onClick={stepForward} disabled={position === numSteps}>Step</button>
            {' '}
            <span>{position + 1}/{numSteps + 1}</span>
        </div>
    );
};
