export enum UserRole {
    PATIENT = 'PATIENT',
    CAREGIVER = 'CAREGIVER',
    ADMIN = 'ADMIN',
}

export enum PronounEnum {
    HE_HIM = 'ELE/DELE',
    SHE_HER = 'ELA/DELA',
    SR = 'SR',
    SRA = 'SRA',
    SRTA = 'SRTA',
    CUSTOM = 'CUSTOM',
    NOT_INFORMED = 'NOT_INFORMED',
}


export interface User {
    id: string;
    email: string;
    role: UserRole;

    createdAt: string;

    name?: string;
    pronoun?: PronounEnum;
    phone_number?: string;
    birthday?: string;
    profile_picture?: string;

}
