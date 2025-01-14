import React from "react"
import Carousel from "react-bootstrap/Carousel"
import PropTypes from "prop-types"

/**
 * SimpleSlider component
 * This component renders a carousel slider using the 'react-bootstrap' Carousel component.
 * It takes an array of data objects, each containing an image URL and an optional caption.
 *
 * @param {Object[]} data - Array of objects containing image URLs and optional captions.
 * @param {string} data[].img - URL of the image to display.
 * @param {string} [data[].caption] - Optional caption for the image.
 */
const SimpleSlider = ({ data }) => (
  <Carousel>
    {data.map((el, key) => (
      <Carousel.Item key={key}>
        <img
          src={el.img}
          className="d-block w-100"
          alt={el.caption ? el.caption : el.img}
        />
        {el.caption && <Carousel.Caption>{el.caption}</Carousel.Caption>}
      </Carousel.Item>
    ))}
  </Carousel>
)

SimpleSlider.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      img: PropTypes.string.isRequired,
      caption: PropTypes.string,
    }),
  ).isRequired,
}

export { SimpleSlider }
