import React from "react"
import Carousel from "react-bootstrap/Carousel"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"

function Slide() {
  return (
    <Slider>
      <Carousel>
        <Carousel.Item>
          <StaticImage
            src="../images/slide_1.jpg"
            className="d-block w-100"
            formats={["AUTO", "WEBP"]}
            alt="slide1"
          />
          {/*  <Carousel.Caption>
            <h3>LORE IPSUM DOLOR SIT AMET</h3>
            <span className="subTitle">
              Nulla vitae elit libero, a pharetra augue mollis interdum.
            </span>
            <br></br>
            <button className="btn btn-primary m-4">LINK</button>
          </Carousel.Caption> */}
        </Carousel.Item>
        <Carousel.Item>
          <StaticImage
            src="../images/slide_2.jpg"
            className="d-block w-100"
            formats={["AUTO", "WEBP"]}
            alt="slide2"
          />
          {/* <Carousel.Caption>
            <h3>LORE IPSUM DOLOR SIT AMET</h3>
            <span className="subTitle">
              Nulla vitae elit libero, a pharetra augue mollis interdum.
            </span>
            <br></br>
            <button className="btn btn-primary m-4">LINK</button>
          </Carousel.Caption> */}
        </Carousel.Item>
        <Carousel.Item>
          <StaticImage
            src="../images/slide_3.jpg"
            className="d-block w-100"
            formats={["AUTO", "WEBP"]}
            alt="slide3"
          />
          {/* <Carousel.Caption>
            <h3>LORE IPSUM DOLOR SIT AMET</h3>
            <span className="subTitle">
              Nulla vitae elit libero, a pharetra augue mollis interdum.
            </span>
            <br></br>
            <button className="btn btn-primary m-4">LINK</button>
          </Carousel.Caption> */}
        </Carousel.Item>
      </Carousel>
    </Slider>
  )
}

//style
const Slider = styled.div`
  margin-bottom: 3rem; 
  border-bottom: #3e281c solid .5rem;
  
  .subTitle {
  }
  .btn-primary {
    background-color: #8b5a40 !important;
    color: #fff;
    border-color: #8b5a40;
    padding-left: 40px;
    padding-right: 40px;
  }
  .btn:hover {
    border-color: #3e281c;
  }
`

export default Slide
