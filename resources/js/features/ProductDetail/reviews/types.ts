export type Review = {
    id: string;
    name: string;
    initials: string;
    avatarColor: string;
    rating: number;
    date: string;
    title: string;
    content: string;
    images: string[];
};

export type ReviewSort = 'latest' | 'highest' | 'lowest';

export type RatingDistribution = {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
};
