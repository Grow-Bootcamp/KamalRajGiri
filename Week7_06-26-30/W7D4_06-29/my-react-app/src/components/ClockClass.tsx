import { Component } from 'react';
type ClockClassProps = {
    onLog: (message: string) => void;
}
type ClockState = {
    time: Date;
}

class ClockClass extends Component<ClockClassProps, ClockState> {
    private timerId: ReturnType<typeof setInterval> | undefined;
    constructor(props: ClockClassProps) {
        super(props);

        this.state = {
            time: new Date(),
        };

        console.log("1. Constructor");
    }

    componentDidMount() {
        // this.props.onLog("Class Clock mounted");

        console.log("3. Component Did Mount");
        this.timerId = setInterval(() => {
            this.setState({ time: new Date() });
        }, 1000);
    }
    componentDidUpdate() {
        // this.props.onLog("Class clock updated");
        console.log("4. Component Did Update");
    }
    componentWillUnmount() {
        // this.props.onLog("Class clock unmounted");
        console.log("5. Component Will Unmount");
        if (this.timerId !== undefined) {
            clearInterval(this.timerId);
        }
    }

    render() {
        console.log("2. Render");

        return <p>The time is {this.state.time.toLocaleTimeString()}</p>
    }
}

export default ClockClass;