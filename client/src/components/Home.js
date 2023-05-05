

import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './style.css';

const photos = [
  {
    id: 1,
    url: 'https://qns.com/wp-content/uploads/2018/07/The-Color-Run-Dream-Tour-Color-throw-e1532033417492.jpg',
    caption: 'Our Family looks Forward to the color run every year! ⭐⭐⭐⭐⭐'
  },
  {
    id: 2,
    url: 'https://gooshkoshkids.com/wp-content/uploads/2022/04/Mud-Run.jpg',
    caption: 'A GREAT ACTIVITY TO GET THE KIDS OUTSIDE ⭐⭐⭐⭐⭐!'
  },
  {
    id: 3,
    url: 'https://thelaurelofasheville.com/wp-content/uploads/2021/06/ZE26377-HamPhoto.jpg',
    caption: 'Together We Stand⭐⭐⭐⭐⭐'
  },
  {
    id: 4,
    url: 'https://visitdowntownfayetteville.com/wp-content/uploads/2021/10/Zombie-Walk-FB-Banner-Mobile-A.jpg',
    caption: 'Spooky Fun! ⭐⭐⭐⭐⭐'
  },
  {
    id: 5,
    url: 'https://images.squarespace-cdn.com/content/v1/54d3a1abe4b000d5abdf8641/1429237613858-KZ7I0FNEDWO4UVJD2BN8/image-asset.jpeg',
    caption: 'The Neighborhood trail walk was lovely ⭐⭐⭐⭐⭐'
  },
];

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((activeIndex + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handlePrevClick = () => {
    setActiveIndex(activeIndex === 0 ? photos.length - 1 : activeIndex - 1);
  };

  const handleNextClick = () => {
    setActiveIndex((activeIndex + 1) % photos.length);
  };

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <div className="photo-carousel">
              {photos.map((photo, index) => (
                <img
                  key={photo.id}
                  className={`photo ${index === activeIndex ? 'active' : ''}`}
                  src={photo.url}
                  alt={photo.caption}
                />
              ))}
              <button className="arrow left-arrow" onClick={handlePrevClick} />
              <button className="arrow right-arrow" onClick={handleNextClick} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;

      