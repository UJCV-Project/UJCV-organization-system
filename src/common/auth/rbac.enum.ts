export const ROLES = {
    SYSADMIN: 'sysadmin',
    ADMIN: 'administrador',
    PROFESSOR: "professor",
    STUDENT: "student",
} as const


export const PERMISSIONS = {
    SUBJECTS: {
        CREATE: 'create_subjects',
        GET: 'get_subjects',
        FIND: 'find_subjects',
        UPDATE: 'update_subjects',
        DELETE: 'delete_subjects',
    },

    CAREERS: {
        CREATE: 'create_careers',
        GET: 'get_careers',
        FIND: 'find_careers',
        UPDATE: 'update_careers',
        DELETE: 'delete_careers',
    },

} as const;