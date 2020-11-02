import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {  setAccessToken } from '../accessToken';
import { MeDocument, useLoginMutation } from '../generated/graphql';


export const Login: React.FC<RouteComponentProps> = ({history}) => {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[login] = useLoginMutation();
    
    
    return(
        <div>
        <div>Login Page</div>
        <form onSubmit={async e => {
            e.preventDefault();
            console.log('form submitted');
            console.log(email, password);
           
           try {
            const response = await login({
                variables: {
                    email,
                    password
                },
                update: (store, {data}) => {
                    if (!data) {
                        return null;
                    }
                    store.writeQuery({
                        query: MeDocument,
                        data: {
                            me: data.login.user
                        }
                    });
                }
            });

            console.log(response);

            if(response && response.data) {
                setAccessToken(response.data.login.accessToken);
            }
           } catch(err) {
            console.log(err);
           }
           


            history.push('/');
        }}>
            <div>
                <input value={email} placeholder="email" onChange={e => {
                    setEmail(e.target.value);
                }}/>
            </div>
            <div>
                <input type="password" value={password} placeholder="password" onChange={e => {
                    setPassword(e.target.value);
                }}/>
            </div>
            <button type="submit">login</button>
        </form>
        </div>
    );
};