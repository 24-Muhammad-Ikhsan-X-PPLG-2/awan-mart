import Navbar from "@/components/navbar";
import CategoriesSection from "@/features/Home/components/CategoriesSection";
import CTASection from "@/features/Home/components/CTASection";
import Footer from "@/features/Home/components/Footer";
import HeroSection from "@/features/Home/components/HeroSection";
import ProductSection from "@/features/Home/components/ProductSection";

const Home = () => {
    return (
        <main className="">
            <Navbar />
            <HeroSection />
            <CategoriesSection />
            <ProductSection />
            <CTASection />
            <Footer />
        </main>
    );
};

export default Home;
