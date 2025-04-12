/* eslint-disable react/no-unescaped-entities */
import CollectionsSlider from "@/components/CollectionsSlider";
import HeroSlider from "@/components/HeroSlider";
import SkeletonCategory from "@/components/skeleton/SkeletonCategory";
import SkeletonFeaturedProducts from "@/components/skeleton/SkeletonFeaturedProducts";
import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import { getCollectionProducts, getCollections } from "@/lib/shopify";
import CallToAction from "@/partials/CallToAction";
import FeaturedProducts from "@/partials/FeaturedProducts";
import SeoMeta from "@/partials/SeoMeta";
import { Suspense } from "react";

const { collections } = config.shopify;

const ShowHeroSlider = async () => {
  try {
    console.log('Fetching hero slider products...');
    const sliderImages = await getCollectionProducts({
      collection: collections.hero_slider,
    });
    console.log('Hero slider products fetched successfully:', sliderImages.products.length);
    const { products } = sliderImages;
    return <HeroSlider products={products} />;
  } catch (error) {
    console.error('Error fetching hero slider:', error);
    return <div>Error loading hero slider. Please try again later.</div>;
  }
};

const ShowCollections = async () => {
  try {
    console.log('Fetching collections...');
    const collections = await getCollections();
    console.log('Collections fetched successfully:', collections.length);
    return <CollectionsSlider collections={collections} />;
  } catch (error) {
    console.error('Error fetching collections:', error);
    return <div>Error loading collections. Please try again later.</div>;
  }
};

const ShowFeaturedProducts = async () => {
  try {
    console.log('Fetching featured products...');
    const { pageInfo, products } = await getCollectionProducts({
      collection: collections.featured_products,
      reverse: false,
    });
    console.log('Featured products fetched successfully:', products.length);
    return <FeaturedProducts products={products} />;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return <div>Error loading featured products. Please try again later.</div>;
  }
};

const Home = () => {
  console.log('Rendering Home page...');
  const callToAction = getListPage("sections/call-to-action.md");

  return (
    <>
      <SeoMeta />
      <section>
        <div className="container">
          <div className="bg-gradient py-10 rounded-md">
            <Suspense fallback={<div>Loading hero slider...</div>}>
              <ShowHeroSlider />
            </Suspense>
          </div>
        </div>
      </section>

      {/* category section  */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h2>Collections</h2>
          </div>
          <Suspense fallback={<SkeletonCategory />}>
            {/* @ts-ignore */}
            <ShowCollections />
          </Suspense>
        </div>
      </section>

      {/* Featured Products section  */}
      <section>
        <div className="container">
          <div className="text-center mb-6 md:mb-14">
            <h2 className="mb-2">Featured Products</h2>
            <p className="md:h5">Explore Today's Featured Picks!</p>
          </div>
          <Suspense fallback={<SkeletonFeaturedProducts />}>
            <ShowFeaturedProducts />
          </Suspense>
        </div>
      </section>

      <CallToAction data={callToAction} />
    </>
  );
};

export default Home;
