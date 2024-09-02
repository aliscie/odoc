import React, {useEffect, useState} from "react";

const ProgressCircle = (props: any) => {
    const {progress, children} = props;
    const [progressColor, setProgressColor] = useState("#ff0000"); // Initial color is red

    useEffect(() => {
        // Calculate the color based on progress
        let color;
        if (progress < 60) {
            color = "#ff0000"; // Red
        } else if (progress < 70) {
            color = "#ff8c00"; // Orange
        } else if (progress < 80) {
            color = "#adff2f"; // Yellowish green
        } else {
            color = "#008000"; // Green
        }

        setProgressColor(color); // Update the color
    }, [progress]); // Re-run effect when progress changes

    return (
        <div
            className="progress-circle"
            style={{
                "--progress": progress,
                "--progress-color": progressColor,
            }}
            data-progress={progress}
        >
            <div className="progress-content">{children}</div>
        </div>
    );
};

export default ProgressCircle;
