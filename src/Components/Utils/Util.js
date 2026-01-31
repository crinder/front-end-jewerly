const url = 'http://localhost:3900/api/';

export const apis = {
    
    login: async (user) => {

        const request = await fetch(`${url}users/login`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(user) 
        });

        if (!request.ok) throw new Error('Error en login');

        return request.json();

    },

}