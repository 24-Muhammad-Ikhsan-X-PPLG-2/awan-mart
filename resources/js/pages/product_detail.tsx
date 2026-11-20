import Navbar from '@/components/navbar';
import BreadcrumbNav from '@/features/ProductDetail/components/BreadcrumbNav';
import DisplayProduct from '@/features/ProductDetail/components/DisplayProduct';
import ProductReviews from '@/features/ProductDetail/reviews/ProductReviews';
import { ProductType } from '@/types/types';
import { RatingDistribution, Review } from '@/features/ProductDetail/reviews/types';
import { FC } from 'react';

type Props = {
    product: ProductType;
    reviews: Review[];
    reviewSummary: {
        average: number;
        total: number;
        distribution: RatingDistribution;
    };
};

const ProductDetail: FC<Props> = ({ product, reviews, reviewSummary }) => {
    return (
        <main>
            <Navbar activePage="product" />
            <BreadcrumbNav
                category={product.category.name}
                productName={product.name}
                categoryId={product.category_id}
            />
            <DisplayProduct
                product={product}
                averageRating={reviewSummary.average}
                reviewCount={reviewSummary.total}
            />
            <ProductReviews reviews={reviews} summary={reviewSummary} />
        </main>
    );
};

export default ProductDetail;
