//import
import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { useLocation } from "@reach/router";
import { GatsbyImage } from "gatsby-plugin-image";
import { Gallery, Item } from "react-photoswipe-gallery";
import PropTypes from "prop-types";
import "photoswipe/dist/photoswipe.css";

const captionStyle = `
  .pswp__custom-caption {
    background: rgba(0, 0, 0, 0.75);
    font-size: 16px;
    color: #fff;
    width: 100%;
    max-width: 100%;
    padding: 12px 16px;
    border-radius: 0;
    position: absolute;
    left: 0;
    bottom: 0;
    text-align: center;
  }
  .pswp__custom-caption a {
    color: #fff;
    text-decoration: underline;
  }
`;

const MyGallery = ({ path }) => {
  const location = useLocation();
  
  const data = useStaticQuery(graphql`
    {
      allFile(
        filter: {
          extension: { regex: "/(jpg|jpeg|png|gif)/" }
          relativePath: { regex: "/gallery/" }
        }
        sort: { name: DESC }
      ) {
        edges {
          node {
            relativePath
            name
            publicURL
            childImageSharp {
              thumb: gatsbyImageData(
                width: 270
                height: 270
                placeholder: BLURRED
              )
              full: gatsbyImageData(layout: FULL_WIDTH)
              original {
                width
                height
                src
              }
            }
          }
        }
      }
    }
  `);

  // Use provided path or get the current path from location
  const currentPath = path || location.pathname.replace(/^\/|\/$/g, '') + '/gallery/';
  
  // Filter images that are in the gallery folder for this path
  const images = data.allFile.edges
    .filter(({ node }) => {
      const relativePath = node.relativePath;
      // Check if the image is in the gallery folder for this path
      return relativePath.includes(currentPath);
    })
    .map(({ node }) => {
      const original = node.childImageSharp.original;
      const thumbImage = node.childImageSharp.thumb;
      
      return {
        thumb: thumbImage,
        fullSrc: original.src,
        width: original.width,
        height: original.height,
        name: node.name
      };
    });

  if (images.length < 1) {
    return null;
  }

  return (
    <>
      <style>{captionStyle}</style>
      <Gallery
        options={{
          showHideAnimationType: 'fade',
          showAnimationDuration: 0,
          hideAnimationDuration: 0,
        }}
        uiElements={[
          {
            name: 'custom-caption',
            order: 9,
            isButton: false,
            appendTo: 'root',
            html: '',
            onInit: (el, pswpInstance) => {
              el.classList.add('pswp__custom-caption');
              
              pswpInstance.on('change', () => {
                const currSlideElement = pswpInstance.currSlide.data.element;
                let captionHTML = '';
                if (currSlideElement) {
                  const caption = currSlideElement.getAttribute('data-caption');
                  if (caption) {
                    captionHTML = caption;
                  }
                }
                el.innerHTML = captionHTML || '';
              });
            },
          },
        ]}
      >
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '8px',
          padding: 0
        }}>
          {images.map((image, index) => (
            <Item
              key={index}
              original={image.fullSrc}
              thumbnail={image.thumb.images.fallback.src}
              width={image.width}
              height={image.height}
              caption={image.name}
            >
              {({ ref, open }) => (
                <div 
                  ref={ref} 
                  onClick={open}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      open();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  style={{ cursor: 'pointer' }}
                  data-caption={image.name}
                  aria-label={`Open image: ${image.name}`}
                >
                  <GatsbyImage image={image.thumb} alt={image.name} />
                </div>
              )}
            </Item>
          ))}
        </div>
      </Gallery>
    </>
  );
};

MyGallery.propTypes = {
  /**
   * Optional path to the gallery folder. If provided, location will be ignored.
   * Example: "my-content/subfolder"
   */
  path: PropTypes.string,
};

export { MyGallery };
