
type Student = {
    id: number;
    name: string;
    city: string;
};

function Demo() {
    const isLoggedIn = true;
    const hasNotifications = true;
    const students: Student[] = [
        { id: 1, name: "Aanjana", city: "Kanchanpur" },
        { id: 2, name: "Ravi", city: "dhn" },
        { id: 3, name: "Aagyat", city: "mnr" }
    ];

    return (
        <div>
            {isLoggedIn ? <h1>Welcome Back !</h1> : <h1>Please log in.</h1>}

            <h1>Dashboard</h1>
            {hasNotifications && <p>You have new notifications.</p>}
            
            <div>
                <h1>Students</h1>
                <ul>
                    {students.map((student) => (
                        <li key={student.id}>
                            {student.name} - {student.city}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


export default Demo;