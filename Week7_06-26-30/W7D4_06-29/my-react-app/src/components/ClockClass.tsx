import { Component } from 'react';

type ClockState = {
    time: Date;
}

class ClockClass extends Component<{}, ClockState> {
    private timerId: ReturnType<typeof setInterval> | undefined;
    constructor(props: {}) {
        super(props);

        this.state = {
            time: new Date(),
        };

        console.log("1. Constructor");
    }

    componentDidMount() {
        console.log("3. Component Did Mount");
        this.timerId = setInterval(() => {
            this.setState({ time: new Date() });
        }, 1000);
    }
    componentDidUpdate(
        _prevProps: Readonly<{}>, _prevState: Readonly<ClockState>) {
        console.log("4. Component Did Update");
    }
    componentWillUnmount() {
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