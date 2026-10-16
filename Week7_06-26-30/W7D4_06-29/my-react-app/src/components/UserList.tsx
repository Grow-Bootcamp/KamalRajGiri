import { useEffect, useState } from "react";
type User = {
    id: number;
    name: string;
    email: string;
};

function UserList(){
    const [users,setUsers] = useState<User[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<string | null>(null);
    
    useEffect(() => {
        async function loadUsers(){
            try { 
                const response = await fetch(
                    "https://jsonplaceholder.typicode.com/users"
                );
                if (!response.ok){
                    throw new Error("Could not load user");
                }
                const data: User[]= await response.json();
                setUsers(data);
            } catch (err: unknown){
                const message = err instanceof Error ? err.message : "An unknown error occurred";
                setError(message);
            }finally{
                setLoading(false);
            }
        }
        void loadUsers();
    },[]);

    if (loading){
        return <p>Loading users...</p>;
    }
    if (error){
        return <p role="alert">Something went wrong: {error}</p>;
    }
    return(
        <section>
            <h2>Users</h2>
            <ul>
                {users.map((user)=>(
                    <li key={user.id}><strong>{user.name}</strong> - {user.email}</li>
                ))}
            </ul>
        </section>
    );
}

export default UserList;