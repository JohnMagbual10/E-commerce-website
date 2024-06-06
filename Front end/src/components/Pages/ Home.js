import React from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Banner from '../components/Banner';
import ProductList from '../components/ProductList';

const Home = () => {
  return (
    <>
      <Header />
      <Navigation />
      <Banner />
      <ProductList />
    </>
  );
};

export default Home;
