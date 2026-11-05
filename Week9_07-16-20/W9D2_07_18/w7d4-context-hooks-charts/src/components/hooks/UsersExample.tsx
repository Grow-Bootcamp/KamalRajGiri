import { useFetch } from "../../hooks/useFetch";

interface User{
    id: number;
    name:string;
    email: string;
}

export default function UserExample(){
    const {data, loading, error} = useFetch<User[]>( 'https://jsonplaceholder.typicode.com/users');
    if(loading){
        return <p>Loading users...</p>
    }
    if (error){
        return <p>Error : {error} </p>
    }
    return (
        <section>
            <h2>Users</h2>
            {data?.map((user)=>(
                <p key={user.id}>
                    {user.name} - {user.email}
                </p>
            ))}
        </section>
    );
}