import React from 'react'

interface Props {
    params: Promise<{ username: string}>
}

interface User {
    username: string;
    id: number;
    name: string;
    email: string;
}

const Page = async( { params } : Props ) => {
    const { username } = await params;
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    const users = await res.json()

    const user = users.find((user: User) => user.username === username)
    return (
        <div>
            {user && 
                <div>
                    {user?.name}
                </div>
            }
            {!user && <div>User not found</div>}
        </div>
    )
}

export default Page