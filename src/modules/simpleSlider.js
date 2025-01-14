import React from "react"
import Carousel from "react-bootstrap/Carousel"
import PropTypes from "prop-types"

/**
 * SimpleSlider component
 * This component renders a carousel slider using the 'react-bootstrap' Carousel component.
 * It takes an array of data objects, each containing an image URL, an optional caption, and an optional interval.
 *
 * @param {Object[]} data - Array of objects containing image URLs, optional captions, and optional intervals.
 * @param {string} data[].img - URL of the image to display.
 * @param {string} [data[].caption] - Optional caption for the image.
 * @param {number} [data[].interval] - Optional interval time for the slide in milliseconds.
 */
const SimpleSlider = ({ data }) => (
  <Carousel controls indicators pause="hover">
    {data.map((el, key) => (
      <Carousel.Item key={key} interval={el.interval || 5000}>
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
      interval: PropTypes.number,
    }),
  ).isRequired,
}

export { SimpleSlider }
