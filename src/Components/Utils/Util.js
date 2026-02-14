const url = 'http://localhost:3900/api/';

export const apis = {

    /*** Users ***/
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

    /*** plan-options ***/

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

    updatePlan: async (id, data) => {

        const request = await fetch(`${url}plan-options/update/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!request.ok) throw new Error('Error actualizando plan');

        return request.json();

    },

    getPlanId: async (idPlan) => {
        const request = await fetch(`${url}plan-options/plan/${idPlan}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!request.ok) throw new Error('Error creando sesion');

        return request.json();
    },

    deletePlan: async (idPlan) => {
        const request = await fetch(`${url}plan-options/delete/${idPlan}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!request.ok) throw new Error('Error eliminando plan');

        return request.json();
    },

    /*** items ***/

    uploadItem: async (data) => {

        const request = await fetch(`${url}items/upload`, {
            method: 'POST',
            body: data,
        });

        if (!request.ok) throw new Error('Error subiendo imagen ');

        return request.json();

    },

    getItems: async (data) => {

        const request = await fetch(`${url}items/getAll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!request.ok) throw new Error('Error buscando items');

        return request.json();

    },

    getItemImage: (file) => {
        return `${url}items/image/${file}`;
    },

    updateItem: async (data) => {

        const request = await fetch(`${url}items/update`, {
            method: 'POST',
            body: data,
        });

        if (!request.ok) throw new Error('Error actualizando item');

        return request.json();

    },

    deleteItem: async (data) => {

        const request = await fetch(`${url}items/delete/${data}`, {
            method: 'POST',
        });

        if (!request.ok) throw new Error('Error eliminando item');

        return request.json();

    },

    /*** sesions ***/

    createSession: async (data) => {

        const request = await fetch(`${url}sesions/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!request.ok) throw new Error('Error creando sesion');

        return request.json();

    },

    turnPlay: async (id) => {

        const request = await fetch(`${url}sesions/turn/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!request.ok) throw new Error('Error creando sesion');

        return request.json();

    },

    getSesion: async (idSesion) => {
        const request = await fetch(`${url}sesions/sesion/${idSesion}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!request.ok) throw new Error('Error buscando sesion');

        return request.json();

    },

    getAllSesions: async (firts, rows) => {

        const request = await fetch(`${url}sesions/list`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first: firts, rows: rows })
        });

        if (!request.ok) throw new Error('Error buscando sesion');

        return request.json();

    },

    turnCancel: async (id) => {

        const request = await fetch(`${url}sesions/cancel/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!request.ok) throw new Error('Error cancelando sesion');

        return request.json();

    },

}