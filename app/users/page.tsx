import React from 'react'

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

const Page = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    const users = await res.json()

  return (
    <div>
        {users.map((user: User) => (
            <div key={user.id}>
                <div >
                {user.name}, {user.username}
                </div>
                <br />
            </div>
        ))}
    </div>
  )
}

export default Page