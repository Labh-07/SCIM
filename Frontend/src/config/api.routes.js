
const BASE_URL = import.meta.env.VITE_BASE_URL || "route failes" 
const API_VERSION = '/api'

const createUrl = (path) => `${BASE_URL}${API_VERSION}${path}`;

export const API_ROUTES = {
    AUTH:{
        LOGIN: createUrl("/auth/login"),
        REGISTER: createUrl("/auth/register"),
        LOGOUT: createUrl("/auth/logout"),
        ME:createUrl("/auth/me"),
    },
    USER :{

    },
    SOCIETY:{
        GETSOCIETY:createUrl("/society")
    }
}
