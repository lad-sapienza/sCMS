import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import Package from "../../package.json"

const SCMSLogo = ({ width, links }) => (
  <div className="text-center" style={{ width: width || "200px" }}>
    <StaticImage
      src="../usr/images/scms-lad.png"
      width={100}
      quality={80}
      formats={["AUTO", "WEBP"]}
      alt="LAD: Laboratorio di Archeologia Digitale alla Sapienza"
      className="img-fluid"
    />
    <br />
    Built with ♥ with s:CMS v{Package.version}
    {" "}by{" "}
    <a href="https://lad.saras.uniroma1.it" target="_blank" rel="noreferrer">
      LAD @Sapienza
    </a>
    {links && (
      <div className="border-top mt-2 pt-2">
        <a
          href="https://github.com/lad-sapienza/sCMS"
          target="_blank"
          rel="noreferrer"
        >
          Code
        </a>
        &nbsp;|&nbsp;
        <a
          href="https://github.com/lad-sapienza/sCMS/issues"
          target="_blank"
          rel="noreferrer"
        >
          Issues
        </a>
      </div>
    )}
  </div>
)

export default SCMSLogo
