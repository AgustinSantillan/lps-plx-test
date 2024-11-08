export interface WeeklyActivity {
    id: number;
    description: string;
    zone: string;
    subZone: string;
    company: string;
    weekDays: {
        [key: string]: boolean;
    };
    ppc: 'S' | 'N' | '';
    ncId: string;
    ncReason: string;
}