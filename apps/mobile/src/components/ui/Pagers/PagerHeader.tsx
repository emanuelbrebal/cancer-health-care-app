import { Header } from '@/src/components/ds/Header';
import { router } from 'expo-router';

interface PagerHeaderProps {
    title?: string;
    seeAllRoute?: string;
}

export default function PagerHeader({ title, seeAllRoute }: PagerHeaderProps) {
    return (
        <Header
            title={title ?? 'Recomendações'}
            actionLabel={seeAllRoute ? 'Ver todos' : undefined}
            onAction={seeAllRoute ? () => router.push(seeAllRoute as any) : undefined}
        />
    );
}
