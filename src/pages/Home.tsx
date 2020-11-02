import React from 'react';
import { useUsersQuery } from '../generated/graphql';

interface Props {

}

export const Home: React.FC<Props> = () => {
    const {data,} = useUsersQuery({fetchPolicy: 'network-only'});

    if(!data){
        return <div>loading.....</div>;
    }

    return(
        <div>
        <div>Home Page</div>
       <div>
           
       </div> users:
       
    <ul>{data.users.map(x => {
        return <li key={x.id}>{x.id}, {x.email}</li>
    })}</ul>
       
       </div>
    );
};