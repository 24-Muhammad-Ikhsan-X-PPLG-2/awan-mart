import Navbar from "@/components/navbar";
import CategoriesSection from "@/features/Home/components/CategoriesSection";
import CTASection from "@/features/Home/components/CTASection";
import Footer from "@/features/Home/components/Footer";
import HeroSection from "@/features/Home/components/HeroSection";
import ProductSection from "@/features/Home/components/ProductSection";
import { ProductType } from "@/types/types";
import { FC } from "react";

type Props = {
    products: ProductType[];
};

const Home: FC<Props> = ({ products }) => {
    return (
        <main className="">
            <Navbar />
            <HeroSection />
            <CategoriesSection />
            <ProductSection products={products} />
            <CTASection />
            <Footer />
        </main>
    );
};

export default Home;
