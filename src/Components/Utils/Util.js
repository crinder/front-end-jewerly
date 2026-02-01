const url = 'http://localhost:3900/api/';

export const apis = {
    
    login: async (user) => {

        const request = await fetch(`${url}users/login`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(user),
            credentials: 'include'
        });

        if (!request.ok) throw new Error('Error en login');

        return request.json();

    },

    checkAuth: async (token) => {

        let headers;

        if (!token) {
            headers = {
                "Content-type": 'application/json'
            }
        } else {
            headers = {
                "Content-type": 'application/json',
                'authorization': token
            }
        }

        const request = await fetch(`${url}users/refresh`, { 
            method: 'GET', 
            headers,
            credentials: 'include'
        });

        if (!request.ok) throw new Error('Error en login');

        return request.json();

    },

    getPlans: async () => {

        const request = await fetch(`${url}plan-options/list`, {
            method: 'GET'
        });

        if (!request.ok) throw new Error('Error buscando planes');

        return request.json();

    },

    savePlan: async (data) => {

        const request = await fetch(`${url}plan-options/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!request.ok) throw new Error('Error guardando planes');

        return request.json();

    },

}